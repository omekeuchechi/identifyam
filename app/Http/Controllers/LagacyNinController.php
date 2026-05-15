<?php

namespace App\Http\Controllers;

use App\Models\lagacy_nin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;
use DomPDF\DomPDF;

class LagacyNinController extends Controller
{
    /**
     * Custom logging method for lagacy NINs
     */
    private function logLagacyNin($level, $message, $context = [])
    {
        $logFile = storage_path('logs/lagacy_nins.log');
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
     * Get local asset as base64 (with caching)
     */
    private function getLocalAsset($filename, $defaultType = 'png')
    {
        $cacheKey = 'asset_' . $filename;
        $cachePath = storage_path('framework/cache/assets/' . $filename . '.txt');
        
        // Create cache directory if it doesn't exist
        $cacheDir = dirname($cachePath);
        if (!File::exists($cacheDir)) {
            File::makeDirectory($cacheDir, 0755, true);
        }
        
        // Check cache (24 hours)
        if (File::exists($cachePath) && (time() - File::lastModified($cachePath)) < 86400) {
            return File::get($cachePath);
        }
        
        // Try to get from local storage first
        $localPath = public_path('assets/img/' . $filename);
        if (File::exists($localPath)) {
            $imageContent = File::get($localPath);
            $base64 = 'data:image/' . $defaultType . ';base64,' . base64_encode($imageContent);
            File::put($cachePath, $base64);
            return $base64;
        }
        
        // Download from GitHub as fallback
        try {
            $url = 'https://raw.githubusercontent.com/omekeuchechi/nin_assets/main/' . $filename;
            $response = Http::timeout(10)->get($url);
            
            if ($response->successful()) {
                $imageContent = $response->body();
                $base64 = 'data:image/' . $defaultType . ';base64,' . base64_encode($imageContent);
                
                // Save to local storage for future use
                if (!File::exists($localPath)) {
                    $localDir = dirname($localPath);
                    if (!File::exists($localDir)) {
                        File::makeDirectory($localDir, 0755, true);
                    }
                    File::put($localPath, $imageContent);
                }
                
                File::put($cachePath, $base64);
                return $base64;
            }
        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', 'Failed to download asset', [
                'filename' => $filename,
                'error' => $e->getMessage()
            ]);
        }
        
        // Return fallback SVG for missing images
        return $this->getFallbackImage($filename);
    }
    
    /**
     * Get fallback SVG image when asset can't be loaded
     */
    private function getFallbackImage($filename)
    {
        $fallbacks = [
            'coatofarm.png' => '<svg width="58" height="58" xmlns="http://www.w3.org/2000/svg"><rect width="58" height="58" fill="#008751"/><circle cx="29" cy="29" r="20" fill="#fff"/><text x="29" y="34" font-size="12" text-anchor="middle" fill="#008751" font-weight="bold">COA</text></svg>',
            'nimc.png' => '<svg width="58" height="58" xmlns="http://www.w3.org/2000/svg"><rect width="58" height="58" fill="#0b8640"/><text x="29" y="34" font-size="10" text-anchor="middle" fill="#fff" font-weight="bold">NIMC</text></svg>',
            'cloud.png' => '<svg width="28" height="28" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" fill="#3498db" rx="4"/><text x="14" y="20" font-size="14" text-anchor="middle" fill="#fff">☁</text></svg>',
            'explorer.png' => '<svg width="28" height="28" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" fill="#e67e22" rx="4"/><text x="14" y="20" font-size="14" text-anchor="middle" fill="#fff">🌐</text></svg>',
            'phone.png' => '<svg width="28" height="28" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" fill="#2ecc71" rx="4"/><text x="14" y="20" font-size="14" text-anchor="middle" fill="#fff">📞</text></svg>',
            'R.png' => '<svg width="28" height="28" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" fill="#e74c3c" rx="4"/><text x="14" y="20" font-size="14" text-anchor="middle" fill="#fff">📍</text></svg>',
            'plastic.png' => '<svg width="550" height="350" xmlns="http://www.w3.org/2000/svg"><rect width="550" height="350" fill="#1a472a"/><rect x="10" y="10" width="530" height="330" fill="none" stroke="#d4af37" stroke-width="2"/><text x="275" y="175" font-family="Arial" font-size="24" fill="#d4af37" text-anchor="middle" font-weight="bold">NATIONAL ID CARD</text><text x="275" y="200" font-family="Arial" font-size="14" fill="#d4af37" text-anchor="middle">Federal Republic of Nigeria</text></svg>'
        ];
        
        if (isset($fallbacks[$filename])) {
            return 'data:image/svg+xml;base64,' . base64_encode($fallbacks[$filename]);
        }
        
        return '';
    }

    /**
     * Save NIN data to database
     */
    private function saveNinData($nin, $data, $searchType, $version)
    {
        try {
            $this->logLagacyNin('INFO', 'Saving NIN data to database', [
                'nin' => $nin,
                'search_type' => $searchType,
                'version' => $version,
            ]);

            // Extract fields from nested data structure
            $responseData = $data['data'] ?? $data;
            
            $extractedData = [
                'nin' => $nin === 'demographic_search' ? null : $nin,
                'telephone' => $responseData['telephoneno'] ?? $responseData['phone'] ?? $responseData['phoneNumber'] ?? null,
                'image' => $responseData['image'] ?? $responseData['photo'] ?? null,
                'surname' => $responseData['surname'] ?? $responseData['lastName'] ?? $responseData['surName'] ?? null,
                'first_name' => $responseData['first_name'] ?? $responseData['firstName'] ?? null,
                'birth_data' => $responseData['birth_date'] ?? $responseData['birthdate'] ?? $responseData['dateOfBirth'] ?? null,
                'gender' => $responseData['gender'] ?? null,
                'email' => $responseData['email'] ?? null,
                'search_type' => $searchType . ' (v' . $version . ')',
                'api_response' => json_encode($data),
                'api_version' => 'v' . $version,
                'status' => ($data['status'] ?? 'success') === 'success' ? 'success' : 'failed',
                'user_id' => Auth::user()->id,
            ];

            // Remove null values to avoid database issues
            $extractedData = array_filter($extractedData, function($value) {
                return $value !== null;
            });

            // For demographic searches, create a unique identifier
            if ($nin === 'demographic_search' && isset($responseData['firstName'])) {
                $extractedData['nin'] = 'demo_' . md5(
                    ($responseData['firstName'] ?? '') . 
                    ($responseData['surName'] ?? '') . 
                    ($responseData['dateOfBirth'] ?? '')
                );
            }

            // Use updateOrCreate to avoid duplicate entries
            lagacy_nin::updateOrCreate(
                ['nin' => $extractedData['nin'] ?? $nin],
                $extractedData
            );

        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', 'Failed to save NIN data', [
                'nin' => $nin,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Common cURL request handler
     */
    private function makeApiRequest($url, $requestData, $token, $version)
    {
        // Check user's wallet balance FIRST
        $user = Auth::user();
        $walletAmount = $user->walletAmount ?? 0;
        $serviceCharge = config('services.nin_cash.cash', 100);
        $purchaseAmount = $serviceCharge;

        if ($walletAmount < $purchaseAmount) {
            return [
                'error' => 'Insufficient wallet balance. Your current balance is ₦' . number_format($walletAmount, 2) . ' but this purchase requires ₦' . number_format($purchaseAmount, 2),
                'code' => 'INSUFFICIENT_FUNDS',
                'status' => 400
            ];
        }
        
        $maxRetries = 3;
        $retryCount = 0;
        $walletDeducted = false;
        
        while ($retryCount < $maxRetries) {
            // Initialize cURL
            $ch = curl_init();

            if (!$ch) {
                return [
                    'error' => 'Failed to initialize cURL',
                    'code' => 'CURL_INIT_ERROR',
                    'status' => 500
                ];
            }

            // Set cURL options
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json',
                'Accept: application/json',
                'X-Retry-Count: ' . ($retryCount + 1)
            ]);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

            // Execute cURL request
            $responseBody = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            $curlErrno = curl_errno($ch);
            
            curl_close($ch);

            // Check for connection errors
            if ($curlError && strpos($curlError, 'connection') !== false) {
                
                if ($retryCount === $maxRetries - 1) {
                    return [
                        'error' => 'Service temporarily unavailable due to network issues. Please check your internet connection and try again.',
                        'code' => 'CONNECTION_ERROR',
                        'status' => 503
                    ];
                }
                
                sleep(2);
                $retryCount++;
                continue;
            }

            // Check for other cURL errors
            if ($curlError) {
                
                return [
                    'error' => 'API request failed: ' . $curlError,
                    'code' => 'CURL_ERROR',
                    'status' => 500
                ];
            }

            // Parse JSON response
            $responseData = json_decode($responseBody, true);
            $jsonError = json_last_error();
            
            if ($jsonError !== JSON_ERROR_NONE) {
                return [
                    'error' => 'API response parsing failed',
                    'code' => 'JSON_PARSE_ERROR',
                    'status' => 500
                ];
            }

            // Check if response is HTML error page (503 Service Unavailable)
            if ($httpCode === 503 || (isset($responseData['title']) && str_contains($responseData['title'], '503 Service Unavailable'))) {
                
                if ($retryCount === $maxRetries - 1) {
                    return [
                        'error' => 'Service temporarily unavailable. The server is busy, please try again later.',
                        'code' => 'SERVICE_UNAVAILABLE',
                        'status' => 503
                    ];
                }
                
                sleep(2);
                $retryCount++;
                continue;
            }

            // Check if request was successful and deduct wallet only once
            if (isset($responseData['status']) && $responseData['status'] === 'success' && !$walletDeducted) {
                // Deduct from wallet ONLY for successful API calls
                $user->walletAmount = $walletAmount - $purchaseAmount;
                $user->save();
                $walletDeducted = true;
            }
            
            // Handle API-specific balance errors
            if (isset($responseData['status']) && $responseData['status'] === 'failed' && 
                isset($responseData['message']) && 
                (strpos(strtolower($responseData['message']), 'insufficient balance') !== false ||
                 strpos(strtolower($responseData['message']), 'balance') !== false)) {
                
                return [
                    'error' => 'The external API service reports insufficient balance. This may be separate from your local wallet balance. Please contact support or try a different search method.',
                    'code' => 'API_BALANCE_ERROR',
                    'status' => 400,
                    'api_message' => $responseData['message']
                ];
            }

            // Success - return data
            return [
                'data' => $responseData,
                'status' => $httpCode
            ];
        }
        
        return [
            'error' => 'Maximum retries exceeded. Please try again later.',
            'code' => 'MAX_RETRIES_EXCEEDED',
            'status' => 503
        ];
    }

    /**
     * V1 NIN Search
     */
    public function LagacyNin(Request $request)
    {   
        return $this->handleNinSearch($request, 1);
    }

    /**
     * V2 NIN Search
     */
    public function LagacyNinV2(Request $request)
    {
        return $this->handleNinSearch($request, 2);
    }

    /**
     * V3 NIN Search
     */
    public function LagacyNinV3(Request $request)
    {   
        return $this->handleNinSearch($request, 3);
    }

    /**
     * V4 NIN Search
     */
    public function LagacyNinV4(Request $request)
    {   
        return $this->handleNinSearch($request, 4);
    }

    /**
     * Keep session alive
     */
    public function keepAlive(Request $request)
    {
        $this->logLagacyNin('INFO', 'keepAlive called', [
            'user_id' => Auth::check() ? Auth::id() : 'guest',
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'session_id' => session()->getId()
        ]);
        
        if (Auth::check()) {
            $request->session()->put('last_activity', time());
            $this->logLagacyNin('INFO', 'Session kept alive', [
                'user_id' => Auth::id(),
                'last_activity' => time()
            ]);
            
            return response()->json(['status' => 'ok', 'authenticated' => true]);
        }
        
        return response()->json(['status' => 'error', 'authenticated' => false], 401);
    }

    /**
     * Common NIN search handler
     */
    private function handleNinSearch(Request $request, $version)
    {
        try {

            // Dynamic validation based on search type
            $rules = [
                'search_type' => 'required|string'
            ];

            if ($request->search_type === 'nin search by demographics') {
                $rules = array_merge($rules, [
                    'surName' => 'required|string',
                    'firstName' => 'required|string',
                    'dateOfBirth' => 'required|string',
                    'gender' => 'required|string'
                ]);
            } else {
                $rules['nin'] = 'required|string';
            }

            $request->validate($rules);
            
            $this->logLagacyNin('INFO', "Validation passed v{$version}");

            $token = Config('services.lagacy_nin.token');
            
            if (!$token) {
                $this->logLagacyNin('ERROR', "API token not configured v{$version}");
                
                return response()->json([
                    'error' => 'API token not configured. Please contact support.'
                ], 500);
            }

            // Build request data based on search type
            $requestData = [
                'searchType' => $request->search_type
            ];

            if ($request->search_type === 'nin search by demographics') {
                $requestData = array_merge($requestData, [
                    'surName' => $request->surName,
                    'firstName' => $request->firstName,
                    'dateOfBirth' => $request->dateOfBirth,
                    'gender' => $request->gender
                ]);
            } else {
                $requestData['nin'] = $request->nin;
            }

            // Make API request to appropriate version
            $url = 'https://ideefied.com/api/v' . $version . '/nin-search';
            
            $result = $this->makeApiRequest($url, $requestData, $token, $version);

            if (isset($result['error'])) {
                return response()->json($result, $result['status'] ?? 500);
            }

            // Save to database if request is successful
            if (($result['status'] >= 200 && $result['status'] < 300) && 
                isset($result['data']) && 
                isset($result['data']['status']) && 
                $result['data']['status'] === 'success') {
                
                $this->saveNinData(
                    $request->nin ?? 'demographic_search', 
                    $result['data'], 
                    $request->search_type, 
                    $version
                );
            }

            return response()->json([
                'data' => $result['data'] ?? null,
                'status' => $result['status'] ?? 500
            ]);

        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', "Failed to fetch lagacy NINs v{$version}", [
                'error' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to fetch lagacy NINs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate PDF for NIN verification results
     */
    public function generatePDF(Request $request)
    {
        
        try {
            // Check authentication first
            if (!Auth::check()) {
                return response()->json([
                    'error' => 'Session expired. Please refresh the page and login again.',
                    'authenticated' => false
                ], 401);
            }
            
            // Refresh session to prevent expiration during long PDF generation
            $request->session()->put('last_activity', time());

            $request->validate([
                'data' => 'required|array',
                'nin' => 'required|string',
                'api_version' => 'required|string|in:v1,v2,v3,v4',
                'search_type' => 'required|string',
                'template_type' => 'required|string|in:slip,card'
            ]);

            // Check if the API response was successful
            $responseData = $request->data;
            if (isset($responseData['status']) && $responseData['status'] !== 'success') {
                return response()->json([
                    'error' => $responseData['message'] ?? 'API request failed. Please try again.',
                    'status' => 'failed'
                ], 400);
            }

            // Get data directly from request
            $data = $request->data['data'] ?? $request->data;
            
            // Create a minimal ninRecord for compatibility
            $ninRecord = (object)[
                'id' => time(),
                'api_response' => json_encode($request->data),
                'nin' => $request->nin,
                'api_version' => $request->api_version
            ];

            // Generate PDF content based on template type
            $pdfContent = $this->generateNinPDF($data, $ninRecord, $request->template_type);

            // Check if we got PDF content or HTML fallback
            if (is_string($pdfContent) && strlen($pdfContent) > 1000 && strpos($pdfContent, '%PDF') === 0) {
                // We have a valid PDF
                $filename = $request->template_type === 'card' 
                    ? 'nin-card-' . $request->nin . '.pdf' 
                    : 'nin-slip-' . $request->nin . '.pdf';

                return response($pdfContent)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename="' . $filename . '"')
                    ->header('Cache-Control', 'private, no-cache, must-revalidate')
                    ->header('Content-Length', strlen($pdfContent));
            } else {
                // We have HTML fallback - return it as HTML with download prompt
                $filename = $request->template_type === 'card' 
                    ? 'nin-card-' . $request->nin . '.html' 
                    : 'nin-slip-' . $request->nin . '.html';

                return response($pdfContent)
                    ->header('Content-Type', 'text/html')
                    ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
            }

        } catch (\Exception $e) {
            // Return HTML fallback if PDF generation fails
            return $this->generateHTMLFallback($request, $e->getMessage());
        }
    }

    /**
     * Generate HTML fallback when PDF generation fails
     */
    private function generateHTMLFallback($request, $errorMessage = null)
    {
        $data = $request->data['data'] ?? $request->data;
        $ninRecord = (object)[
            'id' => time(),
            'nin' => $request->nin,
            'api_version' => $request->api_version
        ];
        
        $html = $request->template_type === 'card' 
            ? $this->getPlasticCardHTML($data, $ninRecord)
            : $this->getPDFHTML($data, $ninRecord);
        
        $fullHtml = '<!DOCTYPE html>
        <html>
        <head>
            <title>NIN Verification Document</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @media print {
                    body { margin: 0; padding: 20px; }
                    .no-print { display: none; }
                }
                .no-print {
                    text-align: center;
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                }
                .error-message {
                    background: #f8d7da;
                    color: #721c24;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                }
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    background: #0b8640;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    margin: 0 5px;
                }
                button:hover {
                    background: #096e37;
                }
            </style>
        </head>
        <body>
            <div class="no-print">
                ' . ($errorMessage ? '<div class="error-message">⚠️ PDF Generation Note: ' . htmlspecialchars($errorMessage) . '. Using HTML fallback.</div>' : '') . '
                <button onclick="window.print()">🖨️ Print / Save as PDF</button>
                <button onclick="window.close()">❌ Close</button>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">Tip: Use Ctrl+P (Windows) or Cmd+P (Mac) to save as PDF</p>
            </div>
            ' . $html . '
        </body>
        </html>';
        
        $filename = $request->template_type === 'card' 
            ? 'nin-card-' . $request->nin . '.html' 
            : 'nin-slip-' . $request->nin . '.html';
        
        return response($fullHtml)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Generate QR code from data (without GD dependency)
     */
    private function generateQRCode($data)
    {
        // Since GD extension is required for QR code generation,
        // we'll return a placeholder or use an external API
        $qrText = is_array($data) ? json_encode($data) : $data;
        
        // Use qrserver.com API (working alternative to Google Charts)
        $qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($qrText);
        
        // Try to fetch the QR code image
        try {
            $qrImageData = @file_get_contents($qrCodeUrl);
            if ($qrImageData !== false) {
                return 'data:image/png;base64,' . base64_encode($qrImageData);
            }
        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', 'Failed to generate QR code via API', [
                'error' => $e->getMessage()
            ]);
        }
        
        // Return empty string to trigger the fallback in the HTML
        return '';
    }

    /**
     * Generate PDF using DomPDF
     */
    private function generateNinPDF($data, $ninRecord, $templateType = 'slip')
    {
        try {
            // Generate HTML content
            if ($templateType === 'card') {
                $html = $this->getPlasticCardHTML($data, $ninRecord);
            } else {
                $html = $this->getPDFHTML($data, $ninRecord);
            }

            // Initialize DomPDF
            $options = new \Dompdf\Options();
            $options->set('defaultFont', 'Arial');
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('chroot', [public_path(), storage_path()]);
            
            $dompdf = new \Dompdf\Dompdf($options);
            
            // Load HTML
            $dompdf->loadHtml($html);
            
            // Set paper size and orientation
            if ($templateType === 'card') {
                $dompdf->setPaper('A4', 'landscape');
            } else {
                $dompdf->setPaper('A4', 'portrait');
            }
            
            // Render PDF
            $dompdf->render();
            
            // Return PDF output
            return $dompdf->output();
            
        } catch (\Exception $e) {
            // Fallback to HTML if DomPDF fails
            return $this->generateHTMLFallbackContent($data, $ninRecord, $templateType);
        }
    }
    
    /**
     * Generate HTML fallback content
     */
    private function generateHTMLFallbackContent($data, $ninRecord, $templateType = 'slip')
    {
        if ($templateType === 'card') {
            $html = $this->getPlasticCardHTML($data, $ninRecord);
        } else {
            $html = $this->getPDFHTML($data, $ninRecord);
        }
        
        $fullHtml = '<!DOCTYPE html>
        <html>
        <head>
            <title>NIN Verification Document</title>
            <meta charset="UTF-8">
            <style>
                @media print {
                    body { margin: 0; padding: 20px; }
                    .no-print { display: none; }
                }
                .no-print {
                    text-align: center;
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                }
            </style>
        </head>
        <body>
            <div class="no-print">
                <p>📄 <strong>Print Instructions:</strong> Press Ctrl+P (Windows) or Cmd+P (Mac) to save as PDF</p>
            </div>
            ' . $html . '
        </body>
        </html>';
        
        return $fullHtml;
    }

    /**
     * Convert remote images to base64 for better compatibility
     */
    private function convertRemoteImagesToBase64($html)
    {
        // Find all img tags with src attributes
        $pattern = '/<img[^>]*src\s*=\s*["\']([^"\']*)["\'][^>]*>/i';
        
        if (preg_match_all($pattern, $html, $matches)) {
            foreach ($matches[1] as $index => $src) {
                // Skip if already base64
                if (strpos($src, 'data:image') === 0) {
                    continue;
                }
                
                // Skip external URLs to avoid timeout
                if (filter_var($src, FILTER_VALIDATE_URL) && 
                    (strpos($src, 'raw.githubusercontent.com') !== false || strpos($src, 'chart.googleapis.com') !== false)) {
                    // Already using external URLs, keep as is
                    continue;
                }
            }
        }
        
        return $html;
    }

    /**
     * Get PDF HTML template
     */
    private function getPDFHTML($data, $ninRecord)
    {
        // Get local assets as base64
        $coatOfArm = $this->getLocalAsset('coatofarm.png', 'png');
        $nimcLogo = $this->getLocalAsset('nimc.png', 'png');
        $cloudIcon = $this->getLocalAsset('cloud.png', 'png');
        $explorerIcon = $this->getLocalAsset('explorer.png', 'png');
        $phoneIcon = $this->getLocalAsset('phone.png', 'png');
        $addressIcon = $this->getLocalAsset('R.png', 'png');
        $slip_bg = $this->getLocalAsset('nin_sp.png', 'png');
        
        // Format data for the template
        $trackingId = $ninRecord->id . time();
        $nin = $data['nin'] ?? 'N/A';
        $surname = $data['surName'] ?? $data['surname'] ?? 'N/A';
        $firstName = $data['firstName'] ?? $data['firstname'] ?? 'N/A';
        $middleName = $data['middleName'] ?? $data['middlename'] ?? 'N/A';
        $gender = $data['gender'] ?? 'N/A';
        $address = $data['residentialAddress'] ?? $data['address'] ?? 'N/A';
        $issueDate = now()->format('d/m/Y');
        
        // Get photo data
        $photoSrc = '';
        if (!empty($data['photo'])) {
            $photoSrc = $this->formatImageForPDF($data['photo']);
        } elseif (!empty($data['image'])) {
            $photoSrc = $this->formatImageForPDF($data['image']);
        }

        return '<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <meta name="generator" content="Imagetotext.io" />
    <title>NIMC - National Identification Number Slip (A4 Print Ready)</title>
    <style type="text/css">
        /* RESET & GLOBAL */
        * {
            max-width: 100%;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

       

        /* MAIN PRINT CONTAINER – EXACTLY A4 PORTRAIT DIMENSIONS (in screen + print) */
        .a4-container {
            background: white;
            width: 21cm;
            height: 29.7cm;
            max-height: 29.7cm;
            margin: 0 auto;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
            position: relative;
            page-break-after: avoid;
            page-break-inside: avoid;
            break-inside: avoid;
            overflow: hidden;
        }

        /* inner wrapper for relative positioning (same as original logic, but adapted for A4) */
        .print-wrapper {
            position: relative;
            width: 100%;
            height: auto;
            background: white;
        }

        /* background image (nin_sp.png) should fill exactly as in original */
        .print-wrapper > p {
            margin: 0;
            line-height: 0;
        }

        .background-slip {
            width: 100%;
            height: auto;
            max-height: 29.7cm;
            display: block;
        }

        /* ----- ABSOLUTE LAYER : exactly mimics original desktop structure but aligned inside A4 ----- */
        .nin-section {
            position: absolute;
            z-index: 1000;
            width: 100%;
            max-width: 950px;
            top: 22px;
            left: 20px;
        }

        /* make sure header images follow original style - REDUCED IMAGE SIZE */
        .nin-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .nin-header > img {
            width: 100%;
            max-width: 65px;
        }

        .nin-header > img.h-img-1 {
            padding-top: 10px;
            padding-left: 20px;
            max-width: 60px;
        }

        .nin-header > img.h-img-2 {
            padding-top: 10px;
            position: absolute;
            left: 660px;
            top: -8px;
            max-width: 70px;
        }

        .nin-data {
            display: block;
        }

        .nin-data > .trackking-id {
            font-size: 11px;
            position: absolute;
            left: 72px;
            top: 91px;
        }

        .nin-data > .nin {
            position: absolute;
            left: 78px;
            top: 131px;
            font-size: 14px;
        }

        .nin-data > .surname {
            position: absolute;
            left: 300px;
            top: 92px;
            font-size: 14px;
        }

        .nin-data > .firstname {
            position: absolute;
            left: 300px;
            top: 132px;
            font-size: 14px;
        }

        .nin-data > .middlname {
            position: absolute;
            left: 300px;
            top: 170px;
            font-size: 14px;
        }

        .nin-data > .gender {
            position: absolute;
            left: 300px;
            top: 202px;
            font-size: 14px;
        }

        .nin-data > .address {
            position: absolute;
            left: 435px;
            top: 100px;
            width: 130px;
            font-size: 14px;
        }

        .nin-data > .passport {
            position: absolute;
            left: 646.5px;
            top: 79px;
            width: 100%;
            max-width: 113px;
            height: 30px;
            font-size: 14px;
        }

        .passport img {
            width: 100%;
            max-width: 113px;
            height: 149px;
            border-radius: 4px;
            object-fit: cover;
            display: block;
        }

        /* NOTE SECTION - TEXT ALIGN LEFT (as requested) */
        .note {
            font-size: 12px;
            position: absolute;
            left: -4px;
            top: 230px;
            padding: 9px;
            padding-right: 11px;
            width: 95%;
            font-family: "Times New Roman", Times, serif;
            line-height: 1.35;
            text-align: left;
        }

        /* SOCIALS SECTION - CENTERED HORIZONTALLY, but inner text stays left-aligned */
        .socials {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            right: 0;
            gap: 45px;
            top: 310px;
            padding: 10px;
            width: 100%;
            flex-wrap: wrap;
            margin: 0 auto;
        }

        .socials > div {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 8px;
            text-align: center;
            min-width: 130px;
        }

        .socials > div > span {
            font-size: 11px;
            font-weight: 800;
            text-align: center;
        }

        .socials > div > small {
            font-size: 7px;
            text-align: center;
        }

        .socials > div > img {
            position: absolute;
            top: -20px;
            left: 50px;
            width: 20px;
            height: 20px;
            display: block;
            margin: 0 auto;
        }

        @media print {
            body {
                background: white;
                padding: 0;
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .a4-container {
                box-shadow: none;
                margin: 0;
                width: 100%;
                min-height: 0;
                page-break-after: avoid;
                page-break-inside: avoid;
            }
            .print-wrapper {
                page-break-inside: avoid;
                break-inside: avoid;
            }
            .background-slip {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .nin-section {
                position: absolute;
                top: 22px;
                left: 20px;
            }
            /* keep reduced image sizes in print */
            .nin-header > img {
                max-width: 65px;
            }
            .nin-header > img.h-img-1 {
                max-width: 60px;
            }
            .nin-header > img.h-img-2 {
                max-width: 70px;
            }
            .socials {
                justify-content: center;
                /* gap: 45px; */
            }
            .note {
                text-align: left;
            }
        }

        .a4-container {
            page-break-after: avoid;
            break-inside: avoid;
            position: relative;
        }

        .nin-data > .address {
            word-break: break-word;
            white-space: normal;
        }

        .socials {
            flex-wrap: wrap;
            row-gap: 12px;
        }

        .socials > .social-1{
            position: absolute;
            top: 10px;
            left: 0px;
        }
        .socials > .social-2{
            position: absolute;
            top: 10px;
            left: 170px;
        }
        .socials > .social-3{
            position: absolute;
            top: 10px;
            left: 330px;
        }
        .socials > .social-4{
            position: absolute;
            left: 490px;
            top: 5px;
            width: 100%;
            max-width: 250px;
        }

        /* Additional adjustments: keep passport image properly positioned */
        .nin-data > .passport {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        /* .passport img {
            margin: 0 auto;
        } */
    </style>
</head>

<body>
    <!-- A4 EXACT CONTAINER: PRINT VIEW OBSERVES EXACT DESKTOP LAYOUT INSIDE A4 SHEET -->
    <div class="a4-container">
        <div class="print-wrapper">
            <!-- ORIGINAL CODE: never removed or altered. everything exactly as provided -->
            <p style="text-align: justify">
                <img src="' . $slip_bg .'" alt="downloajpeg" height="auto" class="background-slip">
            </p>
            <div class="nin-section">
                <div class="nin-header">
                    <img src="'. $coatOfArm .'" alt="" class="h-img-1">
                    <img src="'. $nimcLogo .'" alt="" class="h-img-2">
                </div>
                <div class="nin-data">
                    <span class="trackking-id">'. $trackingId .'</span>
                    <span class="nin">'. $nin .'</span>
                    <span class="surname">'. $surname .'</span>
                    <span class="firstname">'. $firstName .'</span>
                    <Span class="middlname">'. $middleName .'</Span>
                    <span class="gender">'. $gender .'</span>
                    <span class="address">'. $address .'</span>
                    <span class="passport">
                        <img src="'. $photoSrc .'" alt="">
                    </span>
                </div>
                <div class="note">
                    <b>Note:</b> The National Identification Number (NIN) is your identity. It is confidential and may only be
                    released for legitimate transactions. You will be notified
                    when your National Identity Card is ready (for any enquiries please contact NIMC)
                </div>
                <div class="socials">
                    <div class="social-1">
                        <img src="'. $cloudIcon .'" alt="">
                        <span>helpdesk@nimc.gov.ng</span>
                    </div>
                    <div class="social-2">
                        <img src="'. $explorerIcon .'" alt="">
                        <span>www.nimc.gov.ng</span>
                    </div>
                    <div class="social-3">
                        <img src="'. $phoneIcon .'" alt="">
                        <span>0700-CALL-NIMC</span>
                    </div>
                    <div class="social-4">
                        <img src="'. $addressIcon .'" alt="" style="left: 110px">
                        <span>National Identity Management Commission</span>
                        <br>
                        <small>11 Sokoto Crescent, Off Dalaba Street, Zone 5 Wuse, Abuja Nigeria</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>';
    }

    /**
     * Format birth date to human-readable format with short capital month
     */
    private function formatBirthDate($birthDate)
    {
        try {
            // Try to parse the date
            $date = null;
            
            // Handle various date formats
            if (is_string($birthDate)) {
                // Try common date formats
                $formats = ['Y-m-d', 'd/m/Y', 'd-m-Y', 'm/d/Y', 'Y/m/d', 'F d, Y', 'M d, Y'];
                
                foreach ($formats as $format) {
                    try {
                        $date = \Carbon\Carbon::createFromFormat($format, $birthDate);
                        break;
                    } catch (\Exception $e) {
                        continue;
                    }
                }
                
                // If still not parsed, try Carbon's flexible parsing
                if (!$date) {
                    try {
                        $date = \Carbon\Carbon::parse($birthDate);
                    } catch (\Exception $e) {
                        // If all parsing fails, return as-is but ensure month is in capital short form
                        return $this->ensureCapitalShortMonth($birthDate);
                    }
                }
            } else {
                // If it's already a DateTime object or similar
                try {
                    $date = \Carbon\Carbon::parse($birthDate);
                } catch (\Exception $e) {
                    return '01 JAN 1990'; // fallback
                }
            }
            
            // Format as DD MON YYYY (e.g., 15 JAN 1990)
            return $date->format('d M Y');
            
        } catch (\Exception $e) {
            return '01 JAN 1990'; // fallback
        }
    }
    
    /**
     * Ensure month is in short capital form
     */
    private function ensureCapitalShortMonth($dateString)
    {
        // Replace various month formats with short capital form
        $monthReplacements = [
            'january' => 'JAN',
            'february' => 'FEB',
            'march' => 'MAR',
            'april' => 'APR',
            'may' => 'MAY',
            'june' => 'JUN',
            'july' => 'JUL',
            'august' => 'AUG',
            'september' => 'SEP',
            'october' => 'OCT',
            'november' => 'NOV',
            'december' => 'DEC',
            'jan' => 'JAN',
            'feb' => 'FEB',
            'mar' => 'MAR',
            'apr' => 'APR',
            'jun' => 'JUN',
            'jul' => 'JUL',
            'aug' => 'AUG',
            'sep' => 'SEP',
            'oct' => 'OCT',
            'nov' => 'NOV',
            'dec' => 'DEC',
            '01' => 'JAN',
            '02' => 'FEB',
            '03' => 'MAR',
            '04' => 'APR',
            '05' => 'MAY',
            '06' => 'JUN',
            '07' => 'JUL',
            '08' => 'AUG',
            '09' => 'SEP',
            '10' => 'OCT',
            '11' => 'NOV',
            '12' => 'DEC'
        ];
        
        // Replace month names/numbers with short capital form
        foreach ($monthReplacements as $search => $replace) {
            $dateString = preg_replace('/\b' . $search . '\b/i', $replace, $dateString);
        }
        
        return $dateString;
    }

    /**
     * Get Plastic Card PDF HTML template
     */
    private function getPlasticCardHTML($data, $ninRecord)
    {
        // Get plastic card background as local asset
        $plasticBg = $this->getLocalAsset('plastic.png', 'png');

        // Format data for the template
        $nin = $data['nin'] ?? '1234 5678 901';
        $surname = $data['surName'] ?? $data['surname'] ?? 'DOE';
        $firstName = $data['firstName'] ?? $data['firstname'] ?? 'JOHN';
        $middleName = $data['middleName'] ?? $data['middlename'] ?? 'SMITH';
        $gender = $data['gender'] ?? 'M';
        $birthDate = $this->formatBirthDate($data['dateOfBirth'] ?? $data['birthdate'] ?? $data['birth_date'] ?? '01 JAN 1990');
        $issueDate = now()->format('d M Y');

        $genderNewValue='';

        $gender === 'Male' ? $genderNewValue= 'M' : $genderNewValue= 'F';

        // Get photo data
        $photoSrc = '';
        if (!empty($data['photo'])) {
            $photoSrc = $this->formatImageForPDF($data['photo']);
        } elseif (!empty($data['image'])) {
            $photoSrc = $this->formatImageForPDF($data['image']);
        } else {
            $photoSrc = config('nin_profile_image_fallback.image');        
        }

        // Generate QR code data using external API (no GD required)
        $qrData = [
            'firstName' => $firstName,
            'surname' => $surname,
            'middleName' => $middleName,
            'nin' => $nin,
            'phone' => $data['telephoneno'] ?? $data['phone'] ?? '',
            'email' => $data['email'] ?? '',
            'birthDate' => $birthDate,
            'gender' => $gender
        ];
        
        // Create QR code using external API
        $qrCode = $this->generateQRCode(json_encode($qrData));

        // Format NIN with spaces for display
        $formattedNin = preg_replace('/(\d{4})(\d{3})(\d{4})/', '$1 $2 $3', $nin);

        return '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NIN Card</title>

    <style>
        @page {
            size: A4;
            margin: 10mm;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                background: #fff !important;
            }
            
            .nin-card-wrapper {
                page-break-inside: avoid;
                margin: 0;
                padding: 10px;
            }
            
            .nin-container {
                page-break-inside: avoid;
                position: relative;
                height: auto !important;
                overflow: visible !important;
            }
            
            .background-img {
                page-break-inside: avoid;
                width: 100% !important;
                height: auto !important;
                max-height: 350px;
            }
            
            .passport {
                page-break-inside: avoid;
                position: absolute !important;
                top: 100px !important;
                left: 15px !important;
                width: 115px !important;
                height: 145px !important;
            }

            .nin-plastic-data {
                page-break-inside: avoid;
                position: absolute !important;
                top: 110px !important;
                left: 150px !important;
            }

            .qr-code-area {
                page-break-inside: avoid;
                position: absolute !important;
                top: 30px !important;
                right: 15px !important;
            }

            .nin-number-display {
                page-break-inside: avoid;
                position: absolute !important;
                bottom: 10px !important;
                left: 90px !important;
            }
            
            .nin-disclaimer-box {
                page-break-inside: avoid;
                margin-top: 0;
                transform: none !important;
            }
            
            h1, h2 {
                page-break-after: avoid;
                margin-bottom: 10px;
            }
        }
        
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 0;
            background-color: #fff;
            font-family: Arial, sans-serif;
            color: #333;
        }

        h2 {
            font-size: 20px;
            color: #000;
            margin-bottom: 20px;
        }

        .nin-card-wrapper {
            width: 560px;
        }

        .nin-container {
            position: relative;
            width: 100%;
            height: 350px;
        }

        .background-img {
            width: 100%;
            height: 100%;
            display: block;
        }

        .passport {
            position: absolute;
            top: 38px;
            left: 15px;
            width: 115px;
            height: 145px;
            border: 1px solid #999;
            background: #eee;
        }

        .passport img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .nin-plastic-data {
            position: absolute;
            top: 110px;
            left: 150px;
            color: #000;
            font-weight: 600;
            font-size: 12px;
            display: block;
            line-height: 1.6;
        }

        .nin-plastic-data .surname {
            position: absolute;
            top: -65px;
            left: 5px;
            font-size: 16px;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
        }

        .nin-plastic-data .given_names {
            position: absolute;
            top: -5px;
            left: 5px;
            font-size: 14px;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
        }

        .nin-plastic-data > .date_and_sex{
            position: absolute;
            top: 49px;
            left: 5px;
            display: flex;
            justify-content: space-between;
            width: 400px;
        }

        .nin-plastic-data > .date_and_sex > .birth_date {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 14px;
            font-weight: 400;
        }

        .nin-plastic-data > .date_and_sex > .gender{
            position: absolute;
            top: 0;
            left: 193px;
            font-size: 14px;
            font-weight: 400;
        }

        .nin-plastic-data > .date_and_sex > .issue-date{
            position: absolute;
            top: 0;
            left: 286px;
            font-size: 14px;
            font-weight: 400;
        }

        .qr-code-area {
            position: absolute;
            top: -34px;
            right: 15px;
            width: 130px;
            height: 130px;
            background: #fff;
        }

        .nin-number-display {
            position: absolute;
            top: 220px;
            left: 112px;
            font-size: 44px;
            letter-spacing: 5.3px;
            font-weight: 800;
            color: #000;
        }

        .nin-disclaimer-box {
            padding: 5px;
            border: 1px solid #000;
            background-color: #fff;
            text-align: center;
            transform: rotate(180deg);
            margin-top: -60px;
            z-index: 900;
            margin-left: 17.5px;
            width: 100%;
            max-width: 536.5px;
        }

        .important-info{
            position: absolute;
            top: 900px;
            text-align: center;
            font-size: 25px;
            font-weight: 900;
            color: #000;
        }

        .section-title { font-weight: bold; font-size: 28px; margin: 5px 0; text-transform: uppercase; }
        .italic-subtitle { font-style: italic; font-size: 15px; margin-bottom: 8px; display: block; }
        .content-text { font-size: 13px; line-height: 1.3; color: #000; margin-bottom: 10px; }
        .caution-title { font-weight: bold; font-size: 18px; margin: 5px 0; text-transform: uppercase; }
    </style>
</head>
<body>

    <h2 class="important-info">For your Security and Privacy, Please Do Not Share This Card or take Photocopies</h2>

    <div class="nin-card-wrapper">
        <div class="nin-container">
            <img src="' . $plasticBg . '" alt="NIN Backdrop" class="background-img">

            <div class="passport">
                <img id="photoPreview" src="' . $photoSrc . '" alt="Passport">
            </div>

            <div class="nin-plastic-data">
                <span class="surname">' . strtoupper(htmlspecialchars($surname)) . '</span>
                
                <span class="given_names">' . strtoupper(htmlspecialchars($firstName . ' ' . $middleName)) . '</span>
                
                <div class="date_and_sex">
                    <span class="birth_date">' . strtoupper(htmlspecialchars($birthDate)) . '</span>
                    <span class="gender">' . strtoupper(htmlspecialchars($genderNewValue)) . '</span>
                    <span class="issue-date">' . $issueDate . '</span>
                </div>
            </div>

            <div class="qr-code-area">
                ' . (!empty($qrCode) ? '<img src="' . $qrCode . '" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;">' : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #666; font-size: 10px; text-align: center;">QR Code<br>Area</div>') . '
            </div>

            <div class="nin-number-display">
                ' . $formattedNin . '
            </div>
        </div>

        <div class="nin-disclaimer-box">
            <div class="section-title">DISCLAIMER</div>
            <span class="italic-subtitle">Trust, but verify</span>
            
            <div class="content-text">
                Kindly ensure each time this ID is presented, that you verify credentials<br>
                using a Government-APPROVED verification resource.<br>
                The details on front of this NIN Slip must EXACTLY match<br>
                verification result.
            </div>

            <div class="caution-title">CAUTION!</div>

            <div class="content-text">
                If this NIN was not issued to the person on the front of this document, please DO<br>
                NOT attempt to scan, photocopy or replicate personal data contained herein.<br><br>
                You are only permitted to scan the barcode for the purpose of identity verification.<br>
                The FEDERAL GOVERNMENT OF NIGERIA assumes no responsibility<br>
                if you accept any variance in scan result or do not scan the 2D barcode overleaf
            </div>
        </div>
    </div>

</body>
</html>';
    }

    /**
     * Format image for PDF (convert base64 to data URL if needed)
     */
    private function formatImageForPDF($imageData)
    {
        if (!$imageData) {
            return '';
        }

        // If it's already a data URL, return as is
        if (strpos($imageData, 'data:') === 0) {
            return $imageData;
        }

        // If it's raw base64, convert to data URL
        if (is_string($imageData)) {
            return 'data:image/jpeg;base64,' . $imageData;
        }

        return '';
    }
}