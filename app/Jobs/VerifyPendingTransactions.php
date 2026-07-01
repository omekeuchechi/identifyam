<?php

namespace App\Jobs;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VerifyPendingTransactions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle()
    {
        Log::info('Starting verification of pending transactions');

        // Get pending transactions older than 5 minutes
        $pendingTransactions = Transaction::where('status', 'pending')
            ->where('type', 'funding')
            ->where('created_at', '<', now()->subMinutes(5))
            ->where('gateway', 'paystack')
            ->limit(50) // Process in batches to avoid overwhelming Paystack API
            ->get();

        Log::info('Found pending transactions to verify', ['count' => $pendingTransactions->count()]);

        foreach ($pendingTransactions as $transaction) {
            $this->verifyTransaction($transaction);
        }

        Log::info('Completed verification of pending transactions');
    }

    /**
     * Verify a single transaction with Paystack.
     */
    private function verifyTransaction(Transaction $transaction)
    {
        $reference = $transaction->reference;

        try {
            // Verify transaction with Paystack
            $response = Http::withToken(config('services.paystack.secret_key'))
                ->timeout(30)
                ->get("https://api.paystack.co/transaction/verify/{$reference}");

            $data = $response->json();

            if (!$response->successful() || !$data['status']) {
                Log::warning('Failed to verify transaction with Paystack', [
                    'reference' => $reference,
                    'response' => $data
                ]);
                return;
            }

            $paystackData = $data['data'];

            // Use database transaction with row locking
            DB::transaction(function () use ($transaction, $paystackData) {
                // Lock the transaction row
                $lockedTransaction = Transaction::where('id', $transaction->id)
                    ->lockForUpdate()
                    ->first();

                if (!$lockedTransaction) {
                    Log::warning('Transaction not found during verification', [
                        'reference' => $transaction->reference
                    ]);
                    return;
                }

                // Check if already processed (idempotency)
                if ($lockedTransaction->status !== 'pending') {
                    Log::info('Transaction already processed, skipping verification', [
                        'reference' => $lockedTransaction->reference,
                        'status' => $lockedTransaction->status
                    ]);
                    return;
                }

                // Validate amounts match
                $expectedAmount = $lockedTransaction->amount;
                $actualAmount = $paystackData['amount'] / 100; // Convert from kobo

                if (abs($expectedAmount - $actualAmount) > 0.01) {
                    Log::error('Amount mismatch during verification', [
                        'reference' => $lockedTransaction->reference,
                        'expected' => $expectedAmount,
                        'actual' => $actualAmount
                    ]);

                    $lockedTransaction->update([
                        'status' => 'failed',
                        'gateway_response' => array_merge($paystackData, [
                            'fraud_detected' => 'amount_mismatch',
                            'expected_amount' => $expectedAmount,
                            'actual_amount' => $actualAmount,
                            'verification_method' => 'scheduled_job'
                        ]),
                    ]);

                    return;
                }

                // Validate payment currency
                if ($paystackData['currency'] !== 'NGN') {
                    Log::error('Invalid currency during verification', [
                        'reference' => $lockedTransaction->reference,
                        'currency' => $paystackData['currency']
                    ]);

                    $lockedTransaction->update([
                        'status' => 'failed',
                        'gateway_response' => array_merge($paystackData, [
                            'fraud_detected' => 'invalid_currency',
                            'verification_method' => 'scheduled_job'
                        ]),
                    ]);

                    return;
                }

                // Update transaction status based on Paystack status
                $newStatus = $paystackData['status'] === 'success' ? 'successful' : 'failed';
                $lockedTransaction->update([
                    'status' => $newStatus,
                    'gateway_response' => array_merge($paystackData, [
                        'verification_method' => 'scheduled_job'
                    ]),
                    'processed_at' => now(),
                ]);

                // If successful, add funds to wallet
                if ($paystackData['status'] === 'success') {
                    $user = $lockedTransaction->user;

                    if (!$user || $user->email_verified_at === null) {
                        Log::error('User verification required during scheduled verification', [
                            'reference' => $lockedTransaction->reference,
                            'user_id' => $lockedTransaction->user_id
                        ]);

                        // Revert to pending
                        $lockedTransaction->update(['status' => 'pending']);
                        return;
                    }

                    $success = $user->addToWallet($lockedTransaction->amount);

                    if (!$success) {
                        Log::error('Failed to update wallet balance during scheduled verification', [
                            'reference' => $lockedTransaction->reference,
                            'user_id' => $user->id,
                            'amount' => $lockedTransaction->amount
                        ]);

                        // Revert to pending
                        $lockedTransaction->update(['status' => 'pending']);
                        return;
                    }

                    $newBalance = $user->fresh()->walletAmount;

                    Log::info('Scheduled verification: Wallet funded successfully', [
                        'reference' => $lockedTransaction->reference,
                        'user_id' => $user->id,
                        'amount' => $lockedTransaction->amount,
                        'new_balance' => $newBalance
                    ]);
                } else {
                    Log::info('Scheduled verification: Transaction marked as failed', [
                        'reference' => $lockedTransaction->reference,
                        'paystack_status' => $paystackData['status']
                    ]);
                }
            });

        } catch (\Exception $e) {
            Log::error('Exception during transaction verification', [
                'reference' => $reference,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}
