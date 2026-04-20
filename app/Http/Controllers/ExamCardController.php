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

            $token = Config('services.naija_result_pins.token');
            if (!$token) {
                return response()->json([
                    'error' => 'API token not configured. Please set NAJA_RESULT_PINS_TOKEN in your .env file.'
                ], 500);
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json'
            ])->get('https://www.naijaresultpins.com/api/v1');

            $data = $response->json();

            // Store available cards in database
            if ($response->successful() && is_array($data)) {
                foreach ($data as $card) {
                    ExamCard::updateOrCreate(
                        ['card_type_id' => $card['card_type_id']],
                        [
                            'card_name' => $card['card_name'],
                            'unit_amount' => $card['unit_amount'],
                            'availability' => $card['availability'],
                        ]
                    );
                }
            }

            return response()->json([
                'data' => $data,
                'status' => $response->status()
            ]);

        } catch (\Exception $e) {
            
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

            $request->validate([
                'card_type_id' => 'required|string',
                'quantity' => 'required|integer|min:1|max:2'
            ]);

            $token = Config('services.naija_result_pins.token');

            if (!$token) {
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
                return response()->json([
                    'error' => 'cURL extension not available on this server',
                    'code' => 'CURL_NOT_AVAILABLE',
                    'status' => 500
                ], 500);
            }

            // Initialize cURL
            $ch = curl_init();
            
            if (!$ch) {
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

            // Check for cURL errors
            if ($curlError) {
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

                if ($walletAmount < $purchaseAmount) {
                    return response()->json([
                        'error' => 'Insufficient wallet balance. Your current balance is ₦' . number_format($walletAmount, 2) . ' but this purchase requires ₦' . number_format($purchaseAmount, 2),
                        'code' => 'INSUFFICIENT_FUNDS',
                        'status' => 400
                    ], 400);
                }

                // Deduct from wallet
                $user->walletAmount = $walletAmount - $purchaseAmount;
                $user->save();

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

                return response()->json([
                    'data' => $responseData,
                    'status' => 200
                ]);
            } else {
                return response()->json([
                    'error' => $responseData['message'] ?? 'Purchase failed',
                    'code' => $responseData['code'] ?? '000',
                    'status' => $httpCode
                ], $httpCode);
            }

        } catch (\Exception $e) {
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
            $purchases = ExamCardPurchase::where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'data' => $purchases,
                'status' => 200
            ]);

        } catch (\Exception $e) {
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
            $cards = ExamCard::all();
            
            return response()->json([
                'data' => $cards,
                'status' => 200
            ]);

        } catch (\Exception $e) {
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
            $purchase = ExamCardPurchase::where('reference', $reference)
                ->where('user_id', Auth::id())
                ->where('status', 'success')
                ->firstOrFail();

            // Generate PDF content
            $pdfContent = $this->generateExamCardPDF($purchase);
            
            // Return as PDF file
            return response($pdfContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="exam-card-' . $reference . '.pdf"');
                
        } catch (\Exception $e) {
            return response()->json(['error' => 'PDF not found or access denied'], 404);
        }
    }

    /**
     * Generate PDF content for exam card
     */
    private function generateExamCardPDF($purchase)
    {
        $html = $this->getPDFHTML($purchase);
        
        // Use DomPDF to generate actual PDF content
        try {
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            
            return $dompdf->output();
        } catch (\Exception $e) {
            $this->logExamCard('ERROR', 'DomPDF generation failed', [
                'error' => $e->getMessage(),
                'purchase_id' => $purchase->id
            ]);
            
            // Fallback to HTML if DomPDF fails
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
