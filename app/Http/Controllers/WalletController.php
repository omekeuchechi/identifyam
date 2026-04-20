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
     * Initialize Paystack funding.
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
                return redirect()->route('funding')
                    ->with('error', 'Invalid input. Amount must be between 100 and 1,000,000.')
                    ->withInput();
            }

            $user = Auth::user();
            
            // Rate limiting check
            $cacheKey = "funding_attempt_{$user->id}";
            if (Cache::has($cacheKey)) {
                return redirect()->route('funding')
                    ->with('error', 'Please wait before making another funding attempt.');
            }

            // Rate limit: 1 funding attempt per 30 seconds
            Cache::put($cacheKey, true, 30);

            $amount = $request->amount * 100; // Convert to kobo
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
                    'gateway' => 'paystack',
                    'description' => 'Wallet funding',
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                // Initialize Paystack transaction
                $response = Http::withToken(config('services.paystack.secret_key'))
                    ->timeout(30) // Add timeout
                    ->post('https://api.paystack.co/transaction/initialize', [
                        'amount' => $amount,
                        'email' => $request->email,
                        'reference' => $reference,
                        'callback_url' => route('wallet.funding.callback'),
                        'metadata' => [
                            'user_id' => $user->id,
                            'transaction_id' => $transaction->id,
                            'ip_address' => $request->ip(),
                        ],
                    ]);

                $data = $response->json();

                if (!$response->successful() || !$data['status']) {
                    $transaction->update([
                        'status' => 'failed',
                        'gateway_response' => $data,
                    ]);

                    DB::rollBack();
                    Cache::forget($cacheKey);

                    return redirect()->route('funding')
                        ->with('error', 'Failed to initialize payment. Please try again.');
                }

                DB::commit();

                // Use Inertia visit to handle redirect properly
                return inertia()->location($data['data']['authorization_url']);

            } catch (\Exception $e) {
                DB::rollBack();
                Cache::forget($cacheKey);
                throw $e;
            }

        } catch (\Exception $e) {

            return redirect()->route('funding')
                ->with('error', 'An unexpected error occurred. Please try again.');
        }
    }

    /**
     * Handle Paystack callback.
     */
    public function fundingCallback(Request $request)
    {
        $reference = $request->reference;
        
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
                    return redirect()->route('funding')->with('success', 
                        'Wallet funded successfully! New balance: ' . $transaction->user->formatted_wallet_balance);
                }
                
                return redirect()->route('funding')->with('error', 'Payment already processed');
            }

            // Verify transaction with Paystack
            $response = Http::withToken(config('services.paystack.secret_key'))
                ->timeout(30)
                ->get("https://api.paystack.co/transaction/verify/{$reference}");

            $data = $response->json();

            if (!$response->successful() || !$data['status']) {
                
                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => $data,
                ]);
                
                return redirect()->route('funding')->with('error', 'Payment verification failed');
            }

            $paystackData = $data['data'];

            // Validate amounts match (prevent tampering)
            $expectedAmount = $transaction->amount;
            $actualAmount = $paystackData['amount'] / 100; // Convert from kobo
            
            if (abs($expectedAmount - $actualAmount) > 0.01) {
                
                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => array_merge($paystackData, [
                        'fraud_detected' => 'amount_mismatch',
                        'expected_amount' => $expectedAmount,
                        'actual_amount' => $actualAmount
                    ]),
                ]);
                
                return redirect()->route('funding')->with('error', 'Payment verification failed - amount mismatch');
            }

            // Validate payment currency
            if ($paystackData['currency'] !== 'NGN') {
                
                $transaction->update([
                    'status' => 'failed',
                    'gateway_response' => array_merge($paystackData, [
                        'fraud_detected' => 'invalid_currency'
                    ]),
                ]);
                
                return redirect()->route('funding')->with('error', 'Invalid payment currency');
            }

            // Update transaction status
            $newStatus = $paystackData['status'] === 'success' ? 'successful' : 'failed';
            $transaction->update([
                'status' => $newStatus,
                'gateway_response' => $paystackData,
                'processed_at' => now(),
            ]);

            // If successful, add funds to wallet atomically
            if ($paystackData['status'] === 'success') {
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

                return redirect()->route('funding')->with('success', 
                    'Wallet funded successfully! New balance: ' . $user->formatted_wallet_balance);
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
            'gateway' => 'paystack',
            'description' => 'Transfer to ' . $request->recipient_name,
            'recipient_name' => $request->recipient_name,
            'recipient_account' => $request->recipient_account,
            'recipient_bank' => $request->recipient_bank,
        ]);

        // Initialize transfer
        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post('https://api.paystack.co/transfer', [
                'source' => 'balance',
                'amount' => $request->amount * 100, // Convert to kobo
                'reference' => $reference,
                'recipient' => $this->createTransferRecipient($request),
                'reason' => 'Wallet transfer to ' . $request->recipient_name,
            ]);

        $data = $response->json();

        if (!$response->successful()) {
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
     * Create transfer recipient.
     */
    private function createTransferRecipient(Request $request)
    {
        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post('https://api.paystack.co/transferrecipient', [
                'type' => 'nuban',
                'name' => $request->recipient_name,
                'account_number' => $request->recipient_account,
                'bank_code' => $request->recipient_bank,
                'currency' => 'NGN',
            ]);

        $data = $response->json();

        if ($response->successful()) {
            return $data['data']['recipient_code'];
        }

        throw new \Exception('Failed to create transfer recipient');
    }

    /**
     * Get wallet balance.
     */
    public function balance()
    {
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
        $transactions = Auth::user()
            ->transactions()
            ->latest()
            ->paginate(20);

        return response()->json($transactions);
    }
}
