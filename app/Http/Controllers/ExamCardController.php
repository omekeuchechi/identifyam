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

                // Log exam card purchase to activity log
                $this->logActivity('exam_card_purchase', 'Exam card purchased', 'exam', [
                    'purchase_id' => $purchase->id,
                    'reference' => $purchase->reference,
                    'card_type_id' => $request->card_type_id,
                    'quantity' => $request->quantity,
                    'amount' => $purchaseAmount,
                    'card_name' => $purchase->card_name
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
            
            // Log PDF download activity
            $this->logActivity('exam_card_download', 'Exam card PDF downloaded', 'exam', [
                'purchase_id' => $purchase->id,
                'reference' => $reference,
                'card_name' => $purchase->card_name,
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
        $cardName = htmlspecialchars($purchase->card_name);
        $purchaseDate = $purchase->created_at->format('d M Y, H:i');
        $currentDate = now()->format('d M Y, H:i');
        
        foreach ($cards as $card) {
            $pin = htmlspecialchars($card['pin'] ?? 'N/A');
            $serial = htmlspecialchars($card['serial_no'] ?? 'N/A');
            
            $cardsHTML .= "
            <div class='exam-card'>
                <div class='card-header'>
                    <h4>{$cardName}</h4>
                </div>
                <div class='card-body'>
                    <div class='pin-container'>
                        <div class='pin-label'>Examination PIN</div>
                        <div class='pin-value'>{$pin}</div>
                    </div>
                    <div class='serial-container'>
                        <span>Serial: <strong>{$serial}</strong></span>
                    </div>
                </div>
                <div class='card-footer'>
                    IDENTIFYAM VERIFIED • {$purchaseDate}
                </div>
            </div>";
        }

        return "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background: #f0f2f5; 
                    color: #1a1a1a;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .receipt-header {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    border-left: 5px solid #10b981;
                }
                .receipt-header h2 {
                    margin: 0 0 10px 0;
                    color: #10b981;
                    font-size: 24px;
                }
                .receipt-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    font-size: 14px;
                }
                .detail-item {
                    color: #64748b;
                }
                .detail-item strong {
                    color: #1e293b;
                    display: block;
                    margin-bottom: 2px;
                }
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                .exam-card {
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    position: relative;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 20px;
                }
                .card-header {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 15px;
                    text-align: center;
                }
                .card-header h4 {
                    margin: 0;
                    font-size: 16px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                .card-body {
                    padding: 20px;
                    background-image: radial-gradient(#10b981 0.5px, transparent 0.5px);
                    background-size: 15px 15px;
                    background-color: #ffffff;
                    opacity: 0.95;
                }
                .pin-container {
                    background: #f8fafc;
                    border: 2px dashed #cbd5e1;
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    margin-bottom: 15px;
                }
                .pin-label {
                    font-size: 12px;
                    color: #64748b;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }
                .pin-value {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 24px;
                    font-weight: bold;
                    color: #1e293b;
                    letter-spacing: 2px;
                }
                .serial-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 13px;
                    color: #475569;
                    padding-top: 10px;
                    border-top: 1px solid #f1f5f9;
                }
                .card-footer {
                    background: #f8fafc;
                    padding: 10px;
                    text-align: center;
                    font-size: 11px;
                    color: #94a3b8;
                }
                .warning-box {
                    background: #fffbeb;
                    border: 1px solid #fef3c7;
                    padding: 15px;
                    border-radius: 10px;
                    margin-top: 20px;
                    color: #92400e;
                    font-size: 13px;
                }
                @media print {
                    body { background: white; }
                    .receipt-header { box-shadow: none; border: 1px solid #e2e8f0; }
                    .exam-card { box-shadow: none; border: 1px solid #e2e8f0; break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='cards-grid'>
                    {$cardsHTML}
                </div>
                
                <div style='text-align: center; margin-top: 20px; font-size: 12px; color: #666;'>
                    <p>Generated on: {$currentDate}</p>
                </div>
            </div>
        </body>
        </html>";
    }
}
