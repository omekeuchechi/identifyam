<?php

namespace App\Http\Controllers;

use App\Models\ExamCard;
use App\Models\ExamCardPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class ExamCardController extends Controller
{
    /**
     * Custom logging method for exam cards
     */
    private function logExamCard($level, $message, $context = [])
    {
        $logFile = storage_path('logs/exam_cards.log');
        $timestamp = now()->format('Y-m-d H:i:s');
        $logEntry = "[{$timestamp}] {$level}: {$message} " . json_encode($context) . PHP_EOL;
        
        // Ensure log directory exists
        $logDir = dirname($logFile);
        if (!File::exists($logDir)) {
            File::makeDirectory($logDir, 0755, true);
        }
        
        // Append to log file
        File::append($logFile, $logEntry);
    }
    /**
     * Get available exam cards from NaijaResultPins API
     */
    public function getAvailableCards()
    {
        try {
            $this->logExamCard('INFO', 'getAvailableCards called', ['user_id' => Auth::id()]);

            $token = Config('services.naija_result_pins.token');
            if (!$token) {
                $this->logExamCard('WARNING', 'API token not configured, falling back to local cards', ['user_id' => Auth::id()]);
                
                // Fallback to local cards when token is missing
                $localCards = ExamCard::all();
                return response()->json([
                    'data' => $localCards,
                    'status' => 200,
                    'message' => 'Using local cards (API token not configured)'
                ]);
            }

            $this->logExamCard('INFO', 'Making API request to fetch available cards', [
                'user_id' => Auth::id(),
                'url' => 'https://www.naijaresultpins.com/api/v1'
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json'
            ])->get('https://www.naijaresultpins.com/api/v1');

            $data = $response->json();
            
            $this->logExamCard('INFO', 'API response received', [
                'user_id' => Auth::id(),
                'status' => $response->status(),
                'data_count' => is_array($data) ? count($data) : 0
            ]);

            // Store available cards in database
            if ($response->successful() && is_array($data)) {
                $updatedCount = 0;
                foreach ($data as $card) {
                    ExamCard::updateOrCreate(
                        ['card_type_id' => $card['card_type_id']],
                        [
                            'card_name' => $card['card_name'],
                            'unit_amount' => $card['unit_amount'],
                            'availability' => $card['availability'],
                        ]
                    );
                    $updatedCount++;
                }
                
                $this->logExamCard('INFO', 'Cards updated in database', [
                    'user_id' => Auth::id(),
                    'cards_updated' => $updatedCount,
                    'total_cards' => count($data)
                ]);
            }

            $this->logExamCard('INFO', 'getAvailableCards completed successfully', [
                'user_id' => Auth::id(),
                'status' => $response->status()
            ]);

            return response()->json([
                'data' => $data,
                'status' => $response->status()
            ]);

        } catch (\Exception $e) {
            $this->logExamCard('ERROR', 'getAvailableCards failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch exam cards: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Purchase exam cards from NaijaResultPins API
     */
    public function purchaseCards(Request $request)
    {
        try {
            $this->logExamCard('INFO', 'purchaseCards called', [
                'user_id' => Auth::id(),
                'card_type_id' => $request->card_type_id,
                'quantity' => $request->quantity
            ]);

            $request->validate([
                'card_type_id' => 'required|string',
                'quantity' => 'required|integer|min:1|max:2'
            ]);

            $token = Config('services.naija_result_pins.token');

            if (!$token) {
                $this->logExamCard('ERROR', 'API token not configured for purchase', [
                    'user_id' => Auth::id(),
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity
                ]);
                return response()->json([
                    'error' => 'API token not configured. Please set NAJA_RESULT_PINS_TOKEN in your .env file.'
                ], 500);
            }

            $requestData = [
                'card_type_id' => $request->card_type_id,
                'quantity' => $request->quantity
            ];

            // Check if cURL is available
            if (!function_exists('curl_init')) {
                $this->logExamCard('ERROR', 'cURL extension not available', [
                    'user_id' => Auth::id(),
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity
                ]);
                return response()->json([
                    'error' => 'cURL extension not available on this server',
                    'code' => 'CURL_NOT_AVAILABLE',
                    'status' => 500
                ], 500);
            }

            // Initialize cURL
            $ch = curl_init();
            
            if (!$ch) {
                $this->logExamCard('ERROR', 'Failed to initialize cURL', [
                    'user_id' => Auth::id(),
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity
                ]);
                return response()->json([
                    'error' => 'Failed to initialize cURL',
                    'code' => 'CURL_INIT_ERROR',
                    'status' => 500
                ], 500);
            }
            
            // Set cURL options
            curl_setopt($ch, CURLOPT_URL, 'https://www.naijaresultpins.com/api/v1/exam-card/buy');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json',
                'Accept: application/json'
            ]);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);

            // Execute cURL request
            $responseBody = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            $curlErrno = curl_errno($ch);
            
            curl_close($ch);

            $this->logExamCard('INFO', 'cURL request completed', [
                'user_id' => Auth::id(),
                'card_type_id' => $request->card_type_id,
                'quantity' => $request->quantity,
                'http_code' => $httpCode,
                'curl_error' => $curlError,
                'curl_errno' => $curlErrno
            ]);

            // Check for cURL errors
            if ($curlError) {
                $this->logExamCard('ERROR', 'cURL request failed', [
                    'user_id' => Auth::id(),
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity,
                    'curl_error' => $curlError,
                    'curl_errno' => $curlErrno
                ]);
                return response()->json([
                    'error' => 'API request failed: ' . $curlError,
                    'code' => 'CURL_ERROR',
                    'status' => 500
                ], 500);
            }

            // Parse JSON response
            $responseData = json_decode($responseBody, true);
            $jsonError = json_last_error();
            
            if ($jsonError !== JSON_ERROR_NONE) {
                $this->logExamCard('ERROR', 'JSON parsing failed', [
                    'user_id' => Auth::id(),
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity,
                    'json_error' => $jsonError,
                    'response_body' => substr($responseBody, 0, 500) // Log first 500 chars
                ]);
                return response()->json([
                    'error' => 'API response parsing failed',
                    'code' => 'JSON_PARSE_ERROR',
                    'status' => 500
                ], 500);
            }

            // Save purchase record
            if ($httpCode >= 200 && $httpCode < 300 && isset($responseData['status']) && $responseData['status'] === true) {

                // Check user's wallet balance
                $user = Auth::user();
                $walletAmount = $user->walletAmount ?? 0;
                $baseAmount = $responseData['amount'] ?? 0;
                $serviceCharge = config('services.exam_card_money.cash');
                $purchaseAmount = $baseAmount + $serviceCharge;

                $this->logExamCard('INFO', 'Checking wallet balance', [
                    'user_id' => Auth::id(),
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity,
                    'wallet_amount' => $walletAmount,
                    'base_amount' => $baseAmount,
                    'service_charge' => $serviceCharge,
                    'purchase_amount' => $purchaseAmount
                ]);

                if ($walletAmount < $purchaseAmount) {
                    $this->logExamCard('WARNING', 'Insufficient wallet balance', [
                        'user_id' => Auth::id(),
                        'card_type_id' => $request->card_type_id,
                        'quantity' => $request->quantity,
                        'wallet_amount' => $walletAmount,
                        'purchase_amount' => $purchaseAmount
                    ]);
                    return response()->json([
                        'error' => 'Insufficient wallet balance. Your current balance is ₦' . number_format($walletAmount, 2) . ' but this purchase requires ₦' . number_format($purchaseAmount, 2),
                        'code' => 'INSUFFICIENT_FUNDS',
                        'status' => 400
                    ], 400);
                }

                // Deduct from wallet
                $user->walletAmount = $walletAmount - $purchaseAmount;
                $user->save();

                $this->logExamCard('INFO', 'Wallet deducted', [
                    'user_id' => Auth::id(),
                    'old_wallet_amount' => $walletAmount,
                    'new_wallet_amount' => $user->walletAmount,
                    'amount_deducted' => $purchaseAmount
                ]);

                $purchase = ExamCardPurchase::create([
                    'user_id' => Auth::id(),
                    'card_type_id' => $request->card_type_id,
                    'card_name' => $responseData['message'] ?? 'Exam Card Purchase',
                    'quantity' => $responseData['quantity'] ?? $request->quantity,
                    'amount' => $purchaseAmount ?? 0,
                    'reference' => $responseData['reference'] ?? uniqid(),
                    'old_balance' => $responseData['old_balance'] ?? 0,
                    'new_balance' => $responseData['new_balance'] ?? 0,
                    'status' => 'success',
                    'message' => $responseData['message'] ?? 'Purchase successful',
                    'cards' => $responseData['cards'] ?? []
                ]);

                $this->logExamCard('INFO', 'Purchase completed successfully', [
                    'user_id' => Auth::id(),
                    'purchase_id' => $purchase->id,
                    'reference' => $purchase->reference,
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity,
                    'amount' => $purchaseAmount,
                    'cards_count' => is_array($responseData['cards']) ? count($responseData['cards']) : 0
                ]);

                return response()->json([
                    'data' => $responseData,
                    'status' => 200
                ]);
            } else {
                $this->logExamCard('ERROR', 'Purchase API returned failure', [
                    'user_id' => Auth::id(),
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity,
                    'http_code' => $httpCode,
                    'response_data' => $responseData
                ]);
                return response()->json([
                    'error' => $responseData['message'] ?? 'Purchase failed',
                    'code' => $responseData['code'] ?? '000',
                    'status' => $httpCode
                ], $httpCode);
            }

        } catch (\Exception $e) {
            $this->logExamCard('ERROR', 'purchaseCards failed with exception', [
                'user_id' => Auth::id(),
                'card_type_id' => $request->card_type_id,
                'quantity' => $request->quantity,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Purchase failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's exam card purchases
     */
    public function getUserPurchases()
    {
        try {
            $this->logExamCard('INFO', 'getUserPurchases called', ['user_id' => Auth::id()]);
            
            $purchases = ExamCardPurchase::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            $this->logExamCard('INFO', 'getUserPurchases completed', [
                'user_id' => Auth::id(),
                'purchases_count' => $purchases->count()
            ]);

            return response()->json([
                'data' => $purchases,
                'status' => 200
            ]);

        } catch (\Exception $e) {
            $this->logExamCard('ERROR', 'getUserPurchases failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to fetch purchases: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get locally stored available cards
     */
    public function getLocalCards()
    {
        try {
            $this->logExamCard('INFO', 'getLocalCards called', ['user_id' => Auth::id()]);
            
            $cards = ExamCard::all();
            
            $this->logExamCard('INFO', 'getLocalCards completed', [
                'user_id' => Auth::id(),
                'cards_count' => $cards->count()
            ]);
            
            return response()->json([
                'data' => $cards,
                'status' => 200
            ]);

        } catch (\Exception $e) {
            $this->logExamCard('ERROR', 'getLocalCards failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to fetch local cards: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download exam card as PDF
     */
    public function downloadPDF($reference)
    {
        try {
            $this->logExamCard('INFO', 'downloadPDF called', [
                'user_id' => Auth::id(),
                'reference' => $reference
            ]);
            
            $purchase = ExamCardPurchase::where('reference', $reference)
                ->where('user_id', Auth::id())
                ->where('status', 'success')
                ->firstOrFail();

            $this->logExamCard('INFO', 'Purchase found for PDF download', [
                'user_id' => Auth::id(),
                'reference' => $reference,
                'purchase_id' => $purchase->id,
                'card_name' => $purchase->card_name
            ]);

            // Generate PDF content
            $pdfContent = $this->generateExamCardPDF($purchase);
            
            $this->logExamCard('INFO', 'PDF generated successfully', [
                'user_id' => Auth::id(),
                'reference' => $reference,
                'pdf_size' => strlen($pdfContent)
            ]);
            
            // Return as PDF file
            return response($pdfContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="exam-card-' . $reference . '.pdf"');
                
        } catch (\Exception $e) {
            $this->logExamCard('ERROR', 'downloadPDF failed', [
                'user_id' => Auth::id(),
                'reference' => $reference,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'PDF not found or access denied'], 404);
        }
    }

    /**
     * Generate PDF content for exam card
     */
    private function generateExamCardPDF($purchase)
    {
        $this->logExamCard('INFO', 'generateExamCardPDF called', [
            'purchase_id' => $purchase->id,
            'reference' => $purchase->reference,
            'card_name' => $purchase->card_name
        ]);
        
        $html = $this->getPDFHTML($purchase);
        
        // Use DomPDF to generate actual PDF content
        try {
            $this->logExamCard('INFO', 'Initializing DomPDF', [
                'purchase_id' => $purchase->id,
                'html_length' => strlen($html)
            ]);
            
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            
            $pdfOutput = $dompdf->output();
            
            $this->logExamCard('INFO', 'DomPDF generation successful', [
                'purchase_id' => $purchase->id,
                'pdf_size' => strlen($pdfOutput)
            ]);
            
            return $pdfOutput;
        } catch (\Exception $e) {
            $this->logExamCard('ERROR', 'DomPDF generation failed', [
                'purchase_id' => $purchase->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Fallback to HTML if DomPDF fails
            $this->logExamCard('WARNING', 'Falling back to HTML', [
                'purchase_id' => $purchase->id,
                'html_length' => strlen($html)
            ]);
            
            return $html;
        }
    }

    /**
     * Get HTML content for PDF
     */
    private function getPDFHTML($purchase)
    {
        $cards = is_array($purchase->cards) ? $purchase->cards : [];
        $cardsHTML = '';
        
        if (!empty($cards)) {
            $cardsHTML = '<div class="cards-section">
                <h3>Generated Cards</h3>
                <table class="cards-table">
                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>PIN</th>
                        </tr>
                    </thead>
                    <tbody>';
            
            foreach ($cards as $card) {
                $cardsHTML .= '
                    <tr>
                        <td>' . htmlspecialchars($card['serial_no'] ?? 'N/A') . '</td>
                        <td>' . htmlspecialchars($card['pin'] ?? 'N/A') . '</td>
                    </tr>';
            }
            
            $cardsHTML .= '
                    </tbody>
                </table>
            </div>';
        }

        return "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                .card-container { border: 2px solid #28a745; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                .card-info { margin: 20px 0; text-align: left; }
                .card-info p { margin: 10px 0; font-size: 14px; }
                .reference { font-weight: bold; color: #28a745; }
                .cards-section { margin-top: 30px; }
                .cards-section h3 { color: #28a745; margin-bottom: 15px; text-align: center; }
                .cards-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .cards-table th, .cards-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                .cards-table th { background: #f8f9fa; font-weight: bold; }
                .cards-table tr:nth-child(even) { background: #f8f9fa; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
                .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='card-container'>
                <div class='header'>
                    <h2>IDENTIFYAM EXAM CARD</h2>
                </div>
                <div class='card-info'>
                    <p><strong>Card Name:</strong> {$purchase->card_name}</p>
                    <p><strong>Quantity:</strong> {$purchase->quantity}</p>
                    <p><strong>Amount:</strong> ₦" . number_format($purchase->amount, 2) . "</p>
                    <p><strong>Reference:</strong> <span class='reference'>{$purchase->reference}</span></p>
                    <p><strong>Purchase Date:</strong> {$purchase->created_at->format('d M Y, H:i')}</p>
                    <p><strong>Status:</strong> {$purchase->status}</p>
                    <p><strong>Transaction Date:</strong> " . ($purchase->created_at ?? 'N/A') . "</p>
                </div>
                
                {$cardsHTML}
                
                <div class='warning'>
                    <strong>⚠️ Important:</strong> Keep these card details safe. Do not share with unauthorized persons.
                </div>
                
                <div class='footer'>
                    <p>This is an official exam card receipt from Identifyam</p>
                    <p>Generated on: " . now()->format('d M Y, H:i') . "</p>
                </div>
            </div>
        </body>
        </html>";
    }
}
