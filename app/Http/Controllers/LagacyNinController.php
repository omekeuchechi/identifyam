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
     * Save NIN data to database
     */
    private function saveNinData($nin, $data, $searchType, $version)
    {
        try {
            $this->logLagacyNin('INFO', 'Saving NIN data to database', [
                'nin' => $nin,
                'search_type' => $searchType,
                'version' => $version,
                'api_data' => $data
            ]);

            // Extract fields from nested data structure and match database column names
            $extractedData = [
                'telephone' => $data['data']['telephoneno'] ?? $data['data']['phone'] ?? '',
                'image' => $data['data']['image'] ?? $data['data']['photo'] ?? '',
                'surname' => $data['data']['surname'] ?? $data['data']['lastName'] ?? $data['data']['surName'] ?? '',
                'first_name' => $data['data']['first_name'] ?? $data['data']['firstName'] ?? '',
                'birth_data' => $data['data']['birth_date'] ?? $data['data']['birthdate'] ?? $data['data']['dateOfBirth'] ?? '',
                'gender' => $data['data']['gender'] ?? '',
                'email' => $data['data']['email'] ?? '',
                'search_type' => $searchType . ' (v' . $version . ')',
                'api_response' => json_encode($data),
                'api_version' => 'v' . $version,
                'status' => 1,
            ];

            // For demographic searches, use the first name as identifier if no NIN
            $identifier = $nin;
            if ($nin === 'demographic_search' && isset($data['data']['firstName'])) {
                $identifier = 'demo_' . $data['data']['firstName'] . '_' . $data['data']['surName'] . '_' . $data['data']['dateOfBirth'];
            }

            lagacy_nin::Create(
                ['nin' => $identifier],
                $extractedData
            );

            $this->logLagacyNin('INFO', 'NIN data saved successfully', [
                'nin' => $identifier,
                'version' => $version,
                'fields_saved' => array_keys(array_filter($extractedData, function($value) {
                    return $value !== null && $value !== '';
                }))
            ]);

        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', 'Failed to save NIN data', [
                'nin' => $nin,
                'error' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Common cURL request handler
     */
    private function makeApiRequest($url, $requestData, $token, $version)
    {
        $maxRetries = 3;
        $retryCount = 0;
        
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
                'Accept: application/json'
            ]);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
            
            // Add retry count header for debugging
            curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge([
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json',
                'Accept: application/json',
                'X-Retry-Count: ' . ($retryCount + 1)
            ]));

            // Execute cURL request
            $responseBody = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            $curlErrno = curl_errno($ch);
            
            curl_close($ch);

            $this->logLagacyNin('INFO', "cURL response received for v{$version} (attempt " . ($retryCount + 1) . ")", [
                'http_code' => $httpCode,
                'response_body' => $responseBody,
                'curl_error' => $curlError,
                'curl_errno' => $curlErrno,
                'successful' => $httpCode >= 200 && $httpCode < 300
            ]);

            // Check for connection errors
            if ($curlError && strpos($curlError, 'connection') !== false) {
                $this->logLagacyNin('ERROR', "Connection error occurred for v{$version} (attempt " . ($retryCount + 1) . ")", [
                    'curl_error' => $curlError,
                    'curl_errno' => $curlErrno,
                    'retry_count' => $retryCount + 1
                ]);
                
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
                $this->logLagacyNin('ERROR', "cURL error occurred for v{$version} (attempt " . ($retryCount + 1) . ")", [
                    'curl_error' => $curlError,
                    'curl_errno' => $curlErrno
                ]);
                
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
                $this->logLagacyNin('ERROR', "JSON parse error for v{$version} (attempt " . ($retryCount + 1) . ")", [
                    'json_error' => $jsonError,
                    'json_error_message' => json_last_error_msg(),
                    'response_body' => $responseBody
                ]);
                
                return [
                    'error' => 'API response parsing failed',
                    'code' => 'JSON_PARSE_ERROR',
                    'status' => 500
                ];
            }

            $this->logLagacyNin('INFO', "Parsed response data for v{$version} (attempt " . ($retryCount + 1) . ")", [
                'response_data' => $responseData,
                'http_status' => $httpCode
            ]);

            // Check if response is HTML error page (503 Service Unavailable)
            if ($httpCode === 503 || (isset($responseData['title']) && str_contains($responseData['title'], '503 Service Unavailable'))) {
                $this->logLagacyNin('ERROR', "Service unavailable for v{$version} (attempt " . ($retryCount + 1) . ")", [
                    'http_code' => $httpCode,
                    'error_message' => 'Service temporarily unavailable'
                ]);
                
                return [
                    'error' => 'Service temporarily unavailable. The server is busy, please try again later.',
                    'code' => 'SERVICE_UNAVAILABLE',
                    'status' => 503
                ];
            }

            // Check user's wallet balance
                $user = Auth::user();
                $walletAmount = $user->walletAmount ?? 0;
                $serviceCharge = config('services.nin_cash.cash');
                $purchaseAmount = $serviceCharge;

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
        if (Auth::check()) {
            $request->session()->put('last_activity', time());
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
            $this->logLagacyNin('INFO', "Fetching lagacy NINs v{$version}", [
                'user_id' => Auth::check() ? Auth::id() : 'guest',
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $this->logLagacyNin('INFO', "About to validate request v{$version}", [
                'nin' => $request->nin,
                'search_type' => $request->search_type,
            ]);

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
            
            $this->logLagacyNin('INFO', "Validation passed v{$version}", [
                'validation_successful' => true
            ]);

            $token = Config('services.lagacy_nin.token');
            $this->logLagacyNin('INFO', "Token retrieved v{$version}", [
                'token_retrieved' => !empty($token),
                'token_length' => strlen($token ?? '')
            ]);

            if (!$token) {
                $this->logLagacyNin('ERROR', "API token not configured v{$version}", [
                    'user_id' => Auth::check() ? Auth::id() : 'guest',
                    'search_type' => $request->search_type
                ]);
                
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

            $this->logLagacyNin('INFO', "Request data prepared v{$version}", [
                'request_data' => $requestData
            ]);

            // Make API request to appropriate version
            $url = 'https://ideefied.com/api/v' . $version . '/nin-search';
            $result = $this->makeApiRequest($url, $requestData, $token, $version);

            if (isset($result['error'])) {
                return response()->json($result, $result['status'] ?? 500);
            }

            // Save to database if request is successful
            if ($result['status'] >= 200 && $result['status'] < 300 && isset($result['data'])) {
                $this->saveNinData(
                    $request->nin ?? 'demographic_search', 
                    $result['data'], 
                    $request->search_type, 
                    $version
                );
            }

            return response()->json([
                'data' => $result['data'],
                'status' => $result['status']
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
            // Check authentication first with proper error response
            if (!Auth::check()) {
                $this->logLagacyNin('ERROR', 'PDF generation attempted without authentication', [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'session_id' => session()->getId(),
                ]);
                
                return response()->json([
                    'error' => 'Session expired. Please refresh the page and login again.',
                    'authenticated' => false
                ], 401);
            }
            
            // Refresh session to prevent expiration during long PDF generation
            $request->session()->put('last_activity', time());
            
            $this->logLagacyNin('INFO', 'Generating PDF for NIN verification', [
                'user_id' => Auth::id(),
                'request_data' => $request->all()
            ]);

            $request->validate([
                'data' => 'required|array',
                'nin' => 'required|string',
                'api_version' => 'required|string|in:v1,v2,v3,v4',
                'search_type' => 'required|string',
                'template_type' => 'required|string|in:slip,card'
            ]);

            // Get data directly from request
            $data = $request->data['data'] ?? $request->data;
            
            // Create a minimal ninRecord for compatibility
            $ninRecord = (object)[
                'id' => time(),
                'api_response' => json_encode($request->data),
                'nin' => $request->nin,
                'api_version' => $request->api_version
            ];

            $this->logLagacyNin('INFO', 'Using data from request', [
                'nin' => $request->nin,
                'template_type' => $request->template_type,
                'data_keys' => array_keys($data)
            ]);

            // Generate PDF content based on template type
            $pdfContent = $this->generateNinPDF($data, $ninRecord, $request->template_type);

            // Return PDF download with appropriate filename
            $filename = $request->template_type === 'card' 
                ? 'nin-card-' . $request->nin . '.pdf' 
                : 'nin-slip-' . $request->nin . '.pdf';

            return response($pdfContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"')
                ->header('Cache-Control', 'private, no-cache, must-revalidate');

        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', 'Failed to generate PDF', [
                'error' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString(),
                'session_id' => session()->getId()
            ]);
            return response()->json([
                'error' => 'Failed to generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate QR code from data
     */
    private function generateQRCode($data)
    {
        try {
            // Create QR code using simplesoftwareio/simple-qrcode
            $qrCode = new \SimpleSoftwareIO\QrCode\Generator();
            
            // Convert data to string if it's an array
            $qrText = is_array($data) ? json_encode($data) : $data;
            
            // Generate QR code as SVG
            $qrCodeData = $qrCode->generate($qrText);
            
            // Convert to base64 for PDF embedding
            $base64 = base64_encode($qrCodeData);
            return 'data:image/svg+xml;base64,' . $base64;
            
        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', 'Failed to generate QR code', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            return '';
        }
    }

    /**
     * Generate PDF HTML content
     */
    private function generateNinPDF($data, $ninRecord, $templateType = 'slip')
    {
        if ($templateType === 'card') {
            $html = $this->getPlasticCardHTML($data, $ninRecord);
        } else {
            $html = $this->getPDFHTML($data, $ninRecord);
        }

        try {
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            return $dompdf->output();
        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', 'PDF generation failed, returning HTML', [
                'error' => $e->getMessage()
            ]);
            return $html;
        }
    }

    /**
     * Get PDF HTML template
     */
    private function getPDFHTML($data, $ninRecord)
    {
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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>NIN Slip - Official National Identity Management System</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #eef2f5;
      font-family: "Segoe UI", "Roboto", "Arial", sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 32px 20px;
    }

    /* MAIN CARD CONTAINER (matches official slip style) */
    .nin-slip {
      max-width: 880px;
      width: 100%;
      background: #ffffff;
      border: 1px solid #222;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
      margin: 0 auto;
      font-family: "Segoe UI", "Arial", sans-serif;
      transition: all 0.2s;
    }

    /* inner content padding (matching the original image style) */
    .slip-inner {
      padding: 20px 22px 16px 22px;
    }

    /* ----- HEADER SECTION ----- */
    .slip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 5px;
      padding-bottom: 10px;
    }

    .logo-left img, .logo-right img {
      width: 58px;
      height: auto;
      display: block;
    }

    .center-text {
      text-align: center;
      flex: 1;
    }

    .center-text h2 {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.3px;
      color: #0b3f2a;
      margin: 0;
    }

    .center-text p {
      font-size: 12px;
      color: #2c3e2f;
      margin: 4px 0 2px;
    }

    .center-text h3 {
      font-size: 15px;
      font-weight: 700;
      color: #0b8640;
      margin-top: 5px;
      letter-spacing: 0.3px;
    }

    /* Table layout (exactly like official NIN slip) */
    .slip-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 10px;
    }

    .slip-table td {
      border: 1px solid #1e2a2e;
      padding: 10px 12px;
      vertical-align: top;
      font-size: 13px;
    }

    .slip-table strong {
      font-weight: 700;
      color: #000;
      display: inline-block;
      min-width: 90px;
      font-size: 13px;
    }

    .field-value {
      font-weight: 600;
      color: #0c2b1c;
      word-break: break-word;
    }

    /* Photo cell styling */
    .photo-cell {
      text-align: center;
      width: 140px;
      background: #fefef7;
    }

    .photo-frame {
      width: 120px;
      height: 140px;
      margin: 0 auto;
      border: 1px solid #bdc3c7;
      background: #f9fafb;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 4px;
    }

    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .photo-placeholder-text {
      font-size: 11px;
      color: #7f8c8d;
      text-align: center;
    }

    /* Address block styling */
    .address-box {
      margin-top: 2px;
      line-height: 1.4;
    }

    #clientAddress {
      font-weight: 500;
      font-size: 13px;
      display: inline-block;
      width: 100%;
    }

    .nin-note {
      font-size: 10.5px;
      padding: 6px 8px 2px 8px;
      margin: 0 0 8px 0;
      color: #2c3e50;
    }

    /* Footer contact row (identical to official image style) */
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      border-top: 1.5px solid #1e2a2e;
      margin-top: 10px;
      padding-top: 12px;
      background: #ffffff;
    }

    .contact-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 6px 8px;
      border-right: 1px solid #cbd5e0;
      min-width: 130px;
    }

    .contact-item:last-child {
      border-right: none;
    }

    .digital-icon {
      width: 28px;
      height: 28px;
      object-fit: contain;
      margin-bottom: 6px;
      opacity: 0.9;
    }

    .contact-item strong {
      font-size: 11px;
      font-weight: 700;
      color: #0b3f2a;
    }

    .contact-item div {
      font-size: 10px;
      color: #2d3748;
      line-height: 1.3;
    }

    /* Action buttons (print / download / edit) */
    .action-bar {
      max-width: 880px;
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      gap: 14px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .btn {
      background: #0b8640;
      border: none;
      padding: 10px 22px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 40px;
      color: white;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      font-family: inherit;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-outline {
      background: white;
      color: #0b8640;
      border: 1px solid #0b8640;
    }

    .btn-outline:hover {
      background: #e9f7ef;
    }

    .btn:hover {
      background: #096e37;
      transform: scale(0.98);
    }

    /* print adjustments */
    @media print {
      body {
        background: white;
        padding: 0;
        margin: 0;
      }
      .action-bar {
        display: none;
      }
      .nin-slip {
        box-shadow: none;
        border: 1px solid #000;
        margin: 0;
        max-width: 100%;
      }
      .slip-inner {
        padding: 0.4in;
      }
      .contact-item {
        border-right: 1px solid #aaa;
      }
      .btn, .no-print {
        display: none;
      }
      .photo-frame {
        break-inside: avoid;
      }
    }

    /* responsive */
    @media (max-width: 700px) {
      .slip-header .logo-left img, .slip-header .logo-right img {
        width: 42px;
      }
      .center-text h2 {
        font-size: 16px;
      }
      .center-text h3 {
        font-size: 12px;
      }
      .slip-table td {
        padding: 6px 8px;
      }
      .slip-table strong {
        min-width: 70px;
        font-size: 11px;
      }
      .contact-item {
        padding: 6px 4px;
      }
      .slip-inner {
        padding: 16px;
      }
    }

    @media (max-width: 580px) {
      .contact-row {
        flex-direction: column;
      }
      .contact-item {
        border-right: none;
        border-bottom: 1px solid #ddd;
        padding: 10px;
      }
      .contact-item:last-child {
        border-bottom: none;
      }
    }
  </style>
</head>
<body>


<div class="nin-slip" id="ninSlipContainer">
  <div class="slip-inner">
    <!-- HEADER (as per Nigerian NIMC style) -->
    <div class="slip-header">
      <div class="logo-left">
        <img src="https://raw.githubusercontent.com/omekeuchechi/nin_assets/main/coatofarm.png" alt="Nigerian Coat of Arms">
      </div>
      <div class="center-text">
        <h2>National Identity Management System</h2>
        <p>Federal Republic of Nigeria</p>
        <h3>National Identification Number Slip (NINS)</h3>
      </div>
      <div class="logo-right">
        <img src="https://raw.githubusercontent.com/omekeuchechi/nin_assets/main/nimc.png" alt="NIMC Logo">
      </div>
    </div>

    <!-- MAIN DETAIL TABLE: official grid layout with photo cell -->
    <table class="slip-table" id="detailsTable">
      <tbody>
        <tr>
          <td><strong>Tracking ID:</strong> <span id="trackingVal" class="field-value">'. $trackingId .'</span></td>
          <td><strong>Surname:</strong> <span id="surnameVal" class="field-value">'. $surname .'</span></td>
          <td rowspan="4" class="photo-cell">
            <div class="photo-frame" id="photoFrame">
              <img id="passportImage" src="'. $photoSrc .'" alt="Passport Photo">
            </div>
            <div class="photo-placeholder-text" style="margin-top: 6px;">Passport</div>
          </td>
        </tr>
        <tr>
          <td><strong>NIN:</strong> <span id="ninVal" class="field-value">'. $nin .'</span></td>
          <td><strong>First Name:</strong> <span id="firstnameVal" class="field-value">'. $firstName .'</span></td>
        </tr>
        <tr>
          <td><strong>Issue Date:</strong> <span id="issueDateVal" class="field-value">'. $issueDate .'</span></td>
          <td><strong>Middle Name:</strong> <span id="middlenameVal" class="field-value">'. $middleName .'</span></td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td><strong>Gender:</strong> <span id="genderVal" class="field-value">'. $gender .'</span></td>
        </tr>
        <tr>
          <td colspan="3">
            <div class="address-box">
              <strong id="ad">Address:</strong><br>
              <span id="clientAddress">'. $address .'</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Official NIN confidentiality note (matching original style) -->
    <div class="nin-note">
      <strong>Note:</strong> The National Identification Number (NIN) is your identity. It is confidential and may only be released for legitimate transactions. 
      You will be notified when your National Identity Card is ready (for any enquiries please contact NIMC).
    </div>

    <!-- FOOTER CONTACT ROW exactly as per NIMC slip design -->
    <div class="contact-row">
      <div class="contact-item">
        <img class="digital-icon" src="https://raw.githubusercontent.com/omekeuchechi/nin_assets/main/cloud.png" alt="Email Icon">
        <strong>helpdesk@nimc.gov.ng</strong>
        <div>Email Support</div>
      </div>
      <div class="contact-item">
        <img class="digital-icon" src="https://raw.githubusercontent.com/omekeuchechi/nin_assets/main/explorer.png" alt="Website">
        <strong>www.nimc.gov.ng</strong>
        <div>Official Portal</div>
      </div>
      <div class="contact-item">
        <img class="digital-icon" src="https://raw.githubusercontent.com/omekeuchechi/nin_assets/main/phone.png" alt="Phone">
        <strong>0700-CALL-NIMC</strong>
        <div>(0700-2255-6462)</div>
      </div>
      <div class="contact-item">
        <img class="digital-icon" src="https://raw.githubusercontent.com/omekeuchechi/nin_assets/main/R.png" alt="Address Icon">
        <div><strong>National Identity Management Commission</strong><br>11 Sokoto Crescent, Off Dalaba Street, Zone 5 Wuse, Abuja Nigeria</div>
      </div>
    </div>
  </div>
</div>

</body>
</html>';
    }

    /**
     * Get Plastic Card PDF HTML template
     */
    private function getPlasticCardHTML($data, $ninRecord)
    {
        // Format data for the template
        $nin = $data['nin'] ?? '1234 5678 901';
        $surname = $data['surName'] ?? $data['surname'] ?? 'DOE';
        $firstName = $data['firstName'] ?? $data['firstname'] ?? 'JOHN';
        $middleName = $data['middleName'] ?? $data['middlename'] ?? 'SMITH';
        $gender = $data['gender'] ?? 'M';
        $birthDate = $data['dateOfBirth'] ?? $data['birthdate'] ?? $data['birth_date'] ?? '01 JAN 1990';
        $issueDate = now()->format('d M Y');
        
        // Get photo data
        $photoSrc = '';
        if (!empty($data['photo'])) {
            $photoSrc = $this->formatImageForPDF($data['photo']);
        } elseif (!empty($data['image'])) {
            $photoSrc = $this->formatImageForPDF($data['image']);
        } else {
            $photoSrc = 'data:image/jpeg;base64,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';
        }

        // Generate QR code data
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
        
        // Create QR code
        $qrCode = $this->generateQRCode(json_encode($qrData));

        // Format NIN with spaces for display
        $formattedNin = preg_replace('/(\d{4})(\d{4})(\d{3})/', '$1 $2 $3', $nin);

        return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NIN Card Template</title>

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
                top: 107px !important;
                left: 18px !important;
                width: 120px !important;
                height: 150px !important;
            }
            
            .nin-plastic-data {
                page-break-inside: avoid;
                position: absolute !important;
                top: 117px !important;
                left: 160px !important;
            }
            
            .qr-code-area {
                page-break-inside: avoid;
                position: absolute !important;
                top: 34px !important;
                right: 20px !important;
            }
            
            .nin-number-display {
                page-break-inside: avoid;
                position: absolute !important;
                bottom: 7px !important;
                left: 100px !important;
            }
            
            .nin-disclaimer-box {
                page-break-inside: avoid;
                margin-top: 20px;
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

        /* The Main ID Container */
        .nin-card-wrapper {
            width: 550px;
        }

        /* Top Section: Photo and Details */
        .nin-container {
            position: relative;
            width: 100%;
            height: 350px;
            overflow: hidden;
        }

        .background-img {
            width: 100%;
            height: 100%;
            display: block;
        }

        /* Positioning the Passport */
        .passport {
            position: absolute;
            top: 107px;
            left: 18px;
            width: 120px;
            height: 150px;
            border: 1px solid #999;
            background: #eee;
        }

        .passport img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Positioning Data Fields */
        .nin-plastic-data {
            position: absolute;
            top: 117px;
            left: 160px;
            color: #000;
            font-weight: 400;
            font-size: 10px;
            display: flex;
            flex-direction: column;
            gap: 33px;
            font-size: 14px;
            line-height: 1.8;
        }

        .nin-plastic-data > .date_and_sex{
            display: inline-flex;
            gap: 95px;
        }

        .qr-code-area {
            position: absolute;
            top: 34px;
            right: 20px;
            width: 130px;
            height: 145px;
            background: #fff;
        }

        .nin-number-display {
            position: absolute;
            bottom: 7px;
            left: 100px;
            font-size: 40px;
            letter-spacing: 2px;
            font-weight: 900;
            color: #000;
        }

        /* Bottom Section: Disclaimer (Inverted for folding) */
        .nin-disclaimer-box {
            padding: 15px;
            border: 1px solid #000;
            background-color: #fff;
            text-align: center;
            transform: rotate(180deg);
        }

        .section-title { font-weight: bold; font-size: 28px; margin: 5px 0; text-transform: uppercase; }
        .italic-subtitle { font-style: italic; font-size: 15px; margin-bottom: 8px; display: block; }
        .content-text { font-size: 13px; line-height: 1.3; color: #000; margin-bottom: 10px; }
        .caution-title { font-weight: bold; font-size: 18px; margin: 5px 0; text-transform: uppercase; }
    </style>
</head>
<body>

    <h1>NIN Card</h1>
    <h2>For your Security and Privacy, Please Do Not Share This Card or take Photocopies</h2>

    <div class="nin-card-wrapper">
        <!-- FRONT SIDE / TOP SIDE -->
        <div class="nin-container">
            <img src="https://raw.githubusercontent.com/omekeuchechi/nin_assets/main/plastic.png" alt="NIN Backdrop" class="background-img">

            <div class="passport">
                <img id="photoPreview" src="' . $photoSrc . '" alt="Passport">
            </div>

            <div class="nin-plastic-data">
                <span class="surname">' . strtoupper($surname) . '</span>
                
                <span class="given_names">' . strtoupper($firstName . ' ' . $middleName) . '</span>
                
                <span class="date_and_sex">
                    <span class="birth_date">' . strtoupper($birthDate) . '</span>
                    <span class="gender">' . strtoupper($gender) . '</span>
                    <span class="issue-date">' . $issueDate . '</span>
                </span>
            </div>

            <div class="qr-code-area">
                ' . (!empty($qrCode) ? '<img src="' . $qrCode . '" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;">' : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #666; font-size: 10px; text-align: center;">QR Code<br>Area</div>') . '
            </div>

            <div class="nin-number-display">
                ' . $formattedNin . '
            </div>
        </div>

        <!-- BACK SIDE / DISCLAIMER -->
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

    <p style="margin-top: 20px;">Thank you for using our service.</p>

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