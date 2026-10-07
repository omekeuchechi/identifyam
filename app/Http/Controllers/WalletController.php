<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WalletController extends Controller
{
    /**
     * Custom logging method for wallet operations
     */
    private function logWalletOperation($level, $message, $context = [])
    {
        $logFile = storage_path('logs/wallet.log');
        $timestamp = now()->format('Y-m-d H:i:s');
        $logEntry = "[{$timestamp}] {$level}: {$message} " . json_encode($context) . PHP_EOL;

        // Ensure log directory exists
        $logDir = dirname($logFile);
        if (!\Illuminate\Support\Facades\File::exists($logDir)) {
            \Illuminate\Support\Facades\File::makeDirectory($logDir, 0755, true);
        }

        // Append to log file
        \Illuminate\Support\Facades\File::append($logFile, $logEntry);
    }

    /**
     * Get Flutterwave access token (using secret_key)
     */
    private function getFlutterwaveAccessToken()
    {
        // Flutterwave uses secret_key as Bearer token
        return 'Bearer ' . config('services.flutterwave.secret_key');
    }

    // REMOVED: Auto-fail mechanism disabled
    // We now rely on Flutterwave webhooks and scheduled verification jobs
    // to handle transaction status updates properly.
    // The previous auto-fail mechanism was incorrectly marking successful
    // payments as failed without verifying with Flutterwave.
    //
    // private function autoUpdateExpiredTransactions()
    // {
    //     // Check only once per hour to avoid performance issues
    //     $lastCheck = Cache::get('last_expired_check');
    //
    //     if (!$lastCheck || now()->diffInMinutes($lastCheck) >= 60) {
    //         try {
    //             Transaction::where('status', 'pending')
    //                 ->where('created_at', '<', now()->subMinutes(20))
    //                 ->update([
    //                     'status' => 'failed',
    //                     'failed_at' => now(),
    //                     'gateway_response' => json_encode(['timeout' => true, 'reason' => 'Auto-failed after 20 minutes'])
    //                 ]);
    //
    //             Cache::put('last_expired_check', now(), 3600);
    //         } catch (\Exception $e) {
    //             // Silent fail
    //         }
    //     }
    // }

    /**
     * Initialize Flutterwave funding.
     */
    public function initializeFunding(Request $request)
    {
        try {
            // Enhanced validation
            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:100|max:1000000', // Max 1M for security
                'email' => 'required|email|regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid input. Amount must be between 100 and 1,000,000.'
                ], 400);
            }

            $user = Auth::user();

            // Rate limiting check
            $cacheKey = "funding_attempt_{$user->id}";
            if (Cache::has($cacheKey)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please wait before making another funding attempt.'
                ], 429);
            }

            // Rate limit: 1 funding attempt per 30 seconds
            Cache::put($cacheKey, true, 30);

            $reference = 'WALLET_' . Str::random(12) . '_' . time();

            // Use database transaction for consistency
            DB::beginTransaction();

            try {
                // Create pending transaction
                $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'reference' => $reference,
                    'type' => 'funding',
                    'amount' => $request->amount,
                    'currency' => 'NGN',
                    'status' => 'pending',
                    'gateway' => 'flutterwave',
                    'description' => 'Wallet funding',
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                // Get access token
                try {
                    $accessToken = $this->getFlutterwaveAccessToken();
                } catch (\Exception $e) {
                    $transaction->update([
                        'status' => 'failed',
                        'gateway_response' => ['error' => $e->getMessage()],
                    ]);

                    DB::rollBack();
                    Cache::forget($cacheKey);

                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to authenticate with Flutterwave.',
                    ], 400);
                }

                // Initialize Flutterwave transaction with access token
                $response = Http::withHeaders([
                    'Authorization' => $accessToken,
                ])
                    ->timeout(30)
                    ->post(config('services.flutterwave.base_url') . '/payments', [
                        'tx_ref' => $reference,
                        'amount' => $request->amount,
                        'currency' => 'NGN',
                        'email' => $request->email,
                        'redirect_url' => route('wallet.funding.callback'),
                        'payment_options' => 'card,banktransfer,ussd',
                        'customer' => [
                            'email' => $request->email,
                            'name' => $user->name ?? 'User',
                        ],
                        'customizations' => [
                            'title' => 'Wallet Funding',
                            'description' => 'Fund your wallet',
                        ],
                        'meta' => [
                            'user_id' => $user->id,
                            'transaction_id' => $transaction->id,
                            'ip_address' => $request->ip(),
                        ],
                    ]);

                $data = $response->json();

                if (!$response->successful() || $data['status'] !== 'success') {
                    $transaction->update([
                        'status' => 'failed',
                        'gateway_response' => $data,
                    ]);

                    DB::rollBack();
                    Cache::forget($cacheKey);

                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to initialize payment. Please try again.',
                        'error' => $data,
                    ], 400);
                }

                DB::commit();

                // Return the payment link to the frontend
                return response()->json([
                    'success' => true,
                    'link' => $data['data']['link'],
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                Cache::forget($cacheKey);

                return response()->json([
                    'success' => false,
                    'message' => 'An error occurred: ' . $e->getMessage(),
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again.',
            ], 500);
        }
    }

    /**
     * Handle Flutterwave callback.
     */
    public function fundingCallback(Request $request)
    {
        $reference = $request->tx_ref ?? $request->reference;

        // Validate reference format
        if (!preg_match('/^WALLET_[A-Za-z0-9]{12}_[0-9]+$/', $reference)) {
            return redirect()->route('funding')->with('error', 'Invalid transaction reference');
        }

        // Use database transaction for atomicity
        return DB::transaction(function () use ($reference) {
            // Lock the transaction row to prevent race conditions
            $transaction = Transaction::where('reference', $reference)
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                return redirect()->route('funding')->with('error', 'Transaction not found');
            }

            // Prevent duplicate processing
            if ($transaction->status !== 'pending') {

                if ($transaction->status === 'successful') {
                    return redirect()->route('funding')->with(
                        'success',
                        'Wallet funded successfully! New balance: ' . $transaction->user->formatted_wallet_balance
                    );
                }

                return redirect()->route('funding')->with('error', 'Payment already processed');
            }

            // Verify transaction with Flutterwave
            $accessToken = $this->getFlutterwaveAccessToken();
            $response = Http::withHeaders([
                'Authorization' => $accessToken,
            ])
                ->timeout(30)
                ->get(config('services.flutterwave.base_url') . "/transactions/verify_by_reference?tx_ref={$reference}");

            $data = $response->json();

            if (!$response->successful() || $data['status'] !== 'success') {

                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => $data,
                ]);

                return redirect()->route('funding')->with('error', 'Payment verification failed');
            }

            $flutterwaveData = $data['data'];

            // Validate amounts match (prevent tampering)
            $expectedAmount = $transaction->amount;
            $actualAmount = $flutterwaveData['amount'];

            if (abs($expectedAmount - $actualAmount) > 0.01) {

                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => array_merge($flutterwaveData, [
                        'fraud_detected' => 'amount_mismatch',
                        'expected_amount' => $expectedAmount,
                        'actual_amount' => $actualAmount
                    ]),
                ]);

                return redirect()->route('funding')->with('error', 'Payment verification failed - amount mismatch');
            }

            // Validate payment currency
            if ($flutterwaveData['currency'] !== 'NGN') {

                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => array_merge($flutterwaveData, [
                        'fraud_detected' => 'invalid_currency'
                    ]),
                ]);

                return redirect()->route('funding')->with('error', 'Invalid payment currency');
            }

            // Update transaction status
            $newStatus = $flutterwaveData['status'] === 'successful' ? 'successful' : 'failed';
            $transaction->update([
                'status' => $newStatus,
                'gateway_response' => $flutterwaveData,
                'processed_at' => now(),
            ]);

            // If successful, add funds to wallet atomically
            if ($flutterwaveData['status'] === 'successful') {
                $user = $transaction->user;

                // Double-check user still exists and is active
                if (!$user || $user->email_verified_at === null) {
                    return redirect()->route('funding')->with('error', 'Account verification required');
                }

                // Add funds with additional validation
                $previousBalance = $user->walletAmount;
                $success = $user->addToWallet($transaction->amount);

                if (!$success) {
                    Log::error('Failed to update wallet balance', [
                        'reference' => $reference,
                        'user_id' => $user->id,
                        'amount' => $transaction->amount
                    ]);

                    throw new \Exception('Wallet update failed');
                }

                $newBalance = $user->fresh()->walletAmount;

                // Log history activity
                $this->logUserActivity(
                    'funding',
                    'wallet_funded',
                    "Wallet funded with ₦" . number_format($transaction->amount, 2),
                    $transaction->amount,
                    $reference,
                    ['gateway' => 'flutterwave', 'new_balance' => $newBalance]
                );

                return redirect()->route('funding')->with(
                    'success',
                    'Wallet funded successfully! New balance: ' . $user->formatted_wallet_balance
                );
            }

            return redirect()->route('funding')->with('error', 'Payment failed');
        }, 3); // Retry transaction up to 3 times on deadlock
    }

    /**
     * Transfer funds to bank account.
     */
    public function transfer(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100',
            'recipient_name' => 'required|string',
            'recipient_account' => 'required|string|digits:10',
            'recipient_bank' => 'required|string',
        ]);

        $user = Auth::user();

        // Check sufficient balance
        if (!$user->hasSufficientBalance($request->amount)) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient wallet balance',
            ], 400);
        }

        $reference = 'TRANSFER_' . Str::random(12) . '_' . time();

        // Create pending transaction
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'reference' => $reference,
            'type' => 'transfer',
            'amount' => $request->amount,
            'currency' => 'NGN',
            'status' => 'pending',
            'gateway' => 'flutterwave',
            'description' => 'Transfer to ' . $request->recipient_name,
            'recipient_name' => $request->recipient_name,
            'recipient_account' => $request->recipient_account,
            'recipient_bank' => $request->recipient_bank,
        ]);

        // Initialize transfer
        $accessToken = $this->getFlutterwaveAccessToken();
        $response = Http::withHeaders([
            'Authorization' => $accessToken,
        ])
            ->post(config('services.flutterwave.base_url') . '/transfers', [
                'account_bank' => $request->recipient_bank,
                'account_number' => $request->recipient_account,
                'amount' => $request->amount,
                'narration' => 'Wallet transfer to ' . $request->recipient_name,
                'currency' => 'NGN',
                'reference' => $reference,
                'callback_url' => route('wallet.transfer.callback'),
                'debit_currency' => 'NGN',
            ]);

        $data = $response->json();

        if (!$response->successful() || $data['status'] !== 'success') {
            $transaction->update([
                'status' => 'failed',
                'gateway_response' => $data,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Transfer failed',
                'data' => $data,
            ], 400);
        }

        // Deduct from wallet immediately
        $user->removeFromWallet($request->amount);

        $transaction->update([
            'status' => 'processing',
            'gateway_response' => $data,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transfer initiated successfully',
            'data' => $data['data'],
            'new_balance' => $user->fresh()->formatted_wallet_balance,
        ]);
    }

    /**
     * Get wallet balance.
     */
    public function balance()
    {
        // autoUpdateExpiredTransactions() removed - now handled by scheduled job
        $user = Auth::user();

        return response()->json([
            'balance' => $user->walletAmount,
            'formatted_balance' => $user->formatted_wallet_balance,
        ]);
    }

    /**
     * Get transaction history.
     */
    public function transactions()
    {
        // autoUpdateExpiredTransactions() removed - now handled by scheduled job
        $transactions = Auth::user()
            ->transactions()
            ->latest()
            ->paginate(20);

        return response()->json($transactions);
    }
}
