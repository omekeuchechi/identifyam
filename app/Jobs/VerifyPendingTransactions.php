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
use Illuminate\Support\Facades\Cache;

class VerifyPendingTransactions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle()
    {
        Log::info('Starting verification of pending Flutterwave transactions');

        // Get pending transactions older than 5 minutes
        $pendingTransactions = Transaction::where('status', 'pending')
            ->where('type', 'funding')
            ->where('created_at', '<', now()->subMinutes(5))
            ->where('gateway', 'flutterwave')
            ->limit(50) // Process in batches to avoid overwhelming Flutterwave API
            ->get();

        Log::info('Found pending Flutterwave transactions to verify', ['count' => $pendingTransactions->count()]);

        foreach ($pendingTransactions as $transaction) {
            $this->verifyTransaction($transaction);
        }

        Log::info('Completed verification of pending Flutterwave transactions');
    }

    /**
     * Get Flutterwave access token (using secret_key)
     */
    private function getFlutterwaveAccessToken()
    {
        // Flutterwave uses secret_key as Bearer token
        return 'Bearer ' . config('services.flutterwave.secret_key');
    }

    /**
     * Verify a single transaction with Flutterwave.
     */
    private function verifyTransaction(Transaction $transaction)
    {
        $reference = $transaction->reference;

        try {
            // Get access token
            $accessToken = $this->getFlutterwaveAccessToken();

            // Verify transaction with Flutterwave
            $response = Http::withHeaders([
                'Authorization' => $accessToken,
            ])
                ->timeout(30)
                ->get(config('services.flutterwave.base_url') . "/transactions/verify_by_reference?tx_ref={$reference}");

            $data = $response->json();

            if (!$response->successful() || $data['status'] !== 'success') {
                Log::warning('Failed to verify transaction with Flutterwave', [
                    'reference' => $reference,
                    'response' => $data
                ]);
                return;
            }

            $flutterwaveData = $data['data'];

            // Use database transaction with row locking
            DB::transaction(function () use ($transaction, $flutterwaveData) {
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
                $actualAmount = $flutterwaveData['amount'];

                if (abs($expectedAmount - $actualAmount) > 0.01) {
                    Log::error('Amount mismatch during verification', [
                        'reference' => $lockedTransaction->reference,
                        'expected' => $expectedAmount,
                        'actual' => $actualAmount
                    ]);

                    $lockedTransaction->update([
                        'status' => 'failed',
                        'gateway_response' => array_merge($flutterwaveData, [
                            'fraud_detected' => 'amount_mismatch',
                            'expected_amount' => $expectedAmount,
                            'actual_amount' => $actualAmount,
                            'verification_method' => 'scheduled_job'
                        ]),
                    ]);

                    return;
                }

                // Validate payment currency
                if ($flutterwaveData['currency'] !== 'NGN') {
                    Log::error('Invalid currency during verification', [
                        'reference' => $lockedTransaction->reference,
                        'currency' => $flutterwaveData['currency']
                    ]);

                    $lockedTransaction->update([
                        'status' => 'failed',
                        'gateway_response' => array_merge($flutterwaveData, [
                            'fraud_detected' => 'invalid_currency',
                            'verification_method' => 'scheduled_job'
                        ]),
                    ]);

                    return;
                }

                // Update transaction status based on Flutterwave status
                $newStatus = $flutterwaveData['status'] === 'successful' ? 'successful' : 'failed';
                $lockedTransaction->update([
                    'status' => $newStatus,
                    'gateway_response' => array_merge($flutterwaveData, [
                        'verification_method' => 'scheduled_job'
                    ]),
                    'processed_at' => now(),
                ]);

                // If successful, add funds to wallet
                if ($flutterwaveData['status'] === 'successful') {
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
                        'flutterwave_status' => $flutterwaveData['status']
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
