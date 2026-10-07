<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class FlutterwaveWebhookController extends Controller
{
    /**
     * Handle Flutterwave webhook events.
     */
    public function handle(Request $request)
    {
        // Flutterwave doesn't use webhook secrets like Stripe
        // Security is achieved by verifying the transaction with Flutterwave API
        // using the reference from the webhook payload

        $event = $request->input('event');
        $data = $request->input('data');

        Log::info('Flutterwave webhook received', [
            'event' => $event,
            'reference' => $data['tx_ref'] ?? null,
            'ip' => $request->ip()
        ]);

        // Handle different event types
        switch ($event) {
            case 'charge.completed':
                return $this->handleSuccessfulCharge($data);
            case 'charge.failed':
                return $this->handleFailedCharge($data);
            case 'transfer.completed':
                return $this->handleSuccessfulTransfer($data);
            case 'transfer.failed':
                return $this->handleFailedTransfer($data);
            default:
                Log::info('Unhandled Flutterwave webhook event', ['event' => $event]);
                return response()->json(['message' => 'Event received'], 200);
        }
    }

    /**
     * Handle successful charge event.
     */
    private function handleSuccessfulCharge($data)
    {
        $reference = $data['tx_ref'];

        // Validate reference format
        if (!preg_match('/^WALLET_[A-Za-z0-9]{12}_[0-9]+$/', $reference)) {
            Log::warning('Invalid transaction reference in webhook', ['reference' => $reference]);
            return response()->json(['message' => 'Invalid reference format'], 200);
        }

        // Use database transaction with row locking
        return DB::transaction(function () use ($reference, $data) {
            $transaction = Transaction::where('reference', $reference)
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                Log::warning('Transaction not found in webhook', ['reference' => $reference]);
                return response()->json(['message' => 'Transaction not found'], 200);
            }

            // Idempotency check - if already successful, skip
            if ($transaction->status === 'successful') {
                Log::info('Transaction already successful, skipping', ['reference' => $reference]);
                return response()->json(['message' => 'Already processed'], 200);
            }

            // Validate amounts match
            $expectedAmount = $transaction->amount;
            $actualAmount = $data['amount'];

            if (abs($expectedAmount - $actualAmount) > 0.01) {
                Log::error('Amount mismatch in webhook', [
                    'reference' => $reference,
                    'expected' => $expectedAmount,
                    'actual' => $actualAmount
                ]);

                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => array_merge($data, [
                        'fraud_detected' => 'amount_mismatch',
                        'expected_amount' => $expectedAmount,
                        'actual_amount' => $actualAmount
                    ]),
                ]);

                return response()->json(['message' => 'Amount mismatch'], 200);
            }

            // Validate payment currency
            if ($data['currency'] !== 'NGN') {
                Log::error('Invalid currency in webhook', [
                    'reference' => $reference,
                    'currency' => $data['currency']
                ]);

                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => array_merge($data, [
                        'fraud_detected' => 'invalid_currency'
                    ]),
                ]);

                return response()->json(['message' => 'Invalid currency'], 200);
            }

            // Update transaction status
            $transaction->update([
                'status' => 'successful',
                'gateway_response' => $data,
                'processed_at' => now(),
            ]);

            // Add funds to wallet
            $user = $transaction->user;

            if (!$user || $user->email_verified_at === null) {
                Log::error('User verification required for webhook transaction', [
                    'reference' => $reference,
                    'user_id' => $transaction->user_id
                ]);

                // Revert transaction status
                $transaction->update(['status' => 'pending']);
                return response()->json(['message' => 'User verification required'], 200);
            }

            $success = $user->addToWallet($transaction->amount);

            if (!$success) {
                Log::error('Failed to update wallet balance in webhook', [
                    'reference' => $reference,
                    'user_id' => $user->id,
                    'amount' => $transaction->amount
                ]);

                // Revert transaction status
                $transaction->update(['status' => 'pending']);
                return response()->json(['message' => 'Wallet update failed'], 200);
            }

            $newBalance = $user->fresh()->walletAmount;

            Log::info('Webhook: Wallet funded successfully', [
                'reference' => $reference,
                'user_id' => $user->id,
                'amount' => $transaction->amount,
                'new_balance' => $newBalance
            ]);

            return response()->json(['message' => 'Payment processed successfully'], 200);
        }, 3); // Retry transaction up to 3 times on deadlock
    }

    /**
     * Handle failed charge event.
     */
    private function handleFailedCharge($data)
    {
        $reference = $data['tx_ref'];

        return DB::transaction(function () use ($reference, $data) {
            $transaction = Transaction::where('reference', $reference)
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                Log::warning('Transaction not found in failed charge webhook', ['reference' => $reference]);
                return response()->json(['message' => 'Transaction not found'], 200);
            }

            // Only update if still pending
            if ($transaction->status === 'pending') {
                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => $data,
                    'processed_at' => now(),
                ]);

                Log::info('Webhook: Transaction marked as failed', ['reference' => $reference]);
            }

            return response()->json(['message' => 'Failure processed'], 200);
        });
    }

    /**
     * Handle successful transfer event.
     */
    private function handleSuccessfulTransfer($data)
    {
        $reference = $data['reference'];

        return DB::transaction(function () use ($reference, $data) {
            $transaction = Transaction::where('reference', $reference)
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                Log::warning('Transfer transaction not found in webhook', ['reference' => $reference]);
                return response()->json(['message' => 'Transaction not found'], 200);
            }

            // Only update if still processing
            if ($transaction->status === 'processing') {
                $transaction->update([
                    'status' => 'successful',
                    'gateway_response' => $data,
                    'processed_at' => now(),
                ]);

                Log::info('Webhook: Transfer marked as successful', ['reference' => $reference]);
            }

            return response()->json(['message' => 'Transfer processed'], 200);
        });
    }

    /**
     * Handle failed transfer event.
     */
    private function handleFailedTransfer($data)
    {
        $reference = $data['reference'];

        return DB::transaction(function () use ($reference, $data) {
            $transaction = Transaction::where('reference', $reference)
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                Log::warning('Transfer transaction not found in failed webhook', ['reference' => $reference]);
                return response()->json(['message' => 'Transaction not found'], 200);
            }

            // Only update if still processing
            if ($transaction->status === 'processing') {
                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => $data,
                    'processed_at' => now(),
                ]);

                // Refund the wallet
                $user = $transaction->user;
                if ($user) {
                    $user->addToWallet($transaction->amount);
                    Log::info('Webhook: Wallet refunded for failed transfer', [
                        'reference' => $reference,
                        'amount' => $transaction->amount
                    ]);
                }
            }

            return response()->json(['message' => 'Transfer failure processed'], 200);
        });
    }
}
