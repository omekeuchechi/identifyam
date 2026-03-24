<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class WalletController extends Controller
{
    /**
     * Initialize Paystack funding.
     */
    public function initializeFunding(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100',
            'email' => 'required|email',
        ]);

        $user = Auth::user();
        $amount = $request->amount * 100; // Convert to kobo
        $reference = 'WALLET_' . Str::random(12) . '_' . time();

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
        ]);

        // Initialize Paystack transaction
        $response = Http::withToken(config('services.paystack.secret_key'))
            ->post('https://api.paystack.co/transaction/initialize', [
                'amount' => $amount,
                'email' => $request->email,
                'reference' => $reference,
                'callback_url' => route('wallet.funding.callback'),
                'metadata' => [
                    'user_id' => $user->id,
                    'transaction_id' => $transaction->id,
                ],
            ]);

        $data = $response->json();

        if (!$response->successful() || !$data['status']) {
            $transaction->update([
                'status' => 'failed',
                'gateway_response' => $data,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize payment',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $data['data'],
        ]);
    }

    /**
     * Handle Paystack callback.
     */
    public function fundingCallback(Request $request)
    {
        $reference = $request->reference;

        // Verify transaction with Paystack
        $response = Http::withToken(config('services.paystack.secret_key'))
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        $data = $response->json();

        if (!$response->successful() || !$data['status']) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed',
            ], 400);
        }

        $paystackData = $data['data'];
        $transaction = Transaction::where('reference', $reference)->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found',
            ], 404);
        }

        // Update transaction
        $transaction->update([
            'status' => $paystackData['status'] === 'success' ? 'successful' : 'failed',
            'gateway_response' => $paystackData,
        ]);

        // If successful, add funds to wallet
        if ($paystackData['status'] === 'success') {
            $user = $transaction->user;
            $user->addToWallet($transaction->amount);

            return response()->json([
                'success' => true,
                'message' => 'Wallet funded successfully',
                'new_balance' => $user->fresh()->formatted_wallet_balance,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Payment failed',
        ], 400);
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
