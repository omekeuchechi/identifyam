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
                'status' => 1, // Convert to integer for tinyint
            ];

            // For demographic searches, use the first name as identifier if no NIN
            $identifier = $nin;
            if ($nin === 'demographic_search' && isset($data['data']['firstName'])) {
                $identifier = 'demo_' . $data['data']['firstName'] . '_' . $data['data']['surName'] . '_' . $data['data']['dateOfBirth'];
            }

            lagacy_nin::updateOrCreate(
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
                
                // If this is the last retry, return error
                if ($retryCount === $maxRetries - 1) {
                    return [
                        'error' => 'Service temporarily unavailable due to network issues. Please check your internet connection and try again.',
                        'code' => 'CONNECTION_ERROR',
                        'status' => 503
                    ];
                }
                
                // Wait before retry
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

            // Success - return data
            return [
                'data' => $responseData,
                'status' => $httpCode
            ];
        }
        
        // This should not be reached, but just in case
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
     * Common NIN search handler
     */
    private function handleNinSearch(Request $request, $version)
    {
        try {
            $this->logLagacyNin('INFO', "Fetching lagacy NINs v{$version}", [
                'user_id' => Auth::id(),
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
                    'user_id' => Auth::id(),
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
            $this->logLagacyNin('INFO', 'Generating PDF for NIN verification', [
                'user_id' => Auth::id(),
                'request_data' => $request->all()
            ]);

            $request->validate([
                'nin' => 'required|string',
                'api_version' => 'required|string|in:v1,v2,v3,v4',
                'search_type' => 'required|string',
                'template_type' => 'required|string|in:slip,card'
            ]);

            // Get latest NIN record
            $this->logLagacyNin('INFO', 'Searching for NIN record', [
                'requested_nin' => $request->nin,
                'requested_api_version' => $request->api_version,
                'search_type' => $request->search_type,
                'template_type' => $request->template_type
            ]);

            $ninRecord = lagacy_nin::where('nin', $request->nin)
                ->where('api_version', $request->api_version)
                ->orderBy('created_at', 'desc')
                ->first();

            $this->logLagacyNin('INFO', 'NIN record search result', [
                'record_found' => $ninRecord ? true : false,
                'record_id' => $ninRecord ? $ninRecord->id : null,
                'all_records_count' => lagacy_nin::count()
            ]);

            if (!$ninRecord) {
                // Try to find any record with this NIN (for debugging)
                $anyRecord = lagacy_nin::where('nin', $request->nin)->first();
                $this->logLagacyNin('ERROR', 'No NIN record found with exact version', [
                    'requested_nin' => $request->nin,
                    'requested_api_version' => $request->api_version,
                    'found_any_record_with_nin' => $anyRecord ? true : false,
                    'found_record_api_version' => $anyRecord ? $anyRecord->api_version : null
                ]);
                
                // If we found a record with NIN but different version, use it as fallback
                if ($anyRecord) {
                    $this->logLagacyNin('INFO', 'Using fallback NIN record with different version', [
                        'requested_version' => $request->api_version,
                        'found_version' => $anyRecord->api_version
                    ]);
                    $ninRecord = $anyRecord;
                } else {
                    return response()->json([
                        'error' => 'No NIN record found for provided details. NIN: ' . $request->nin . ', Version: ' . $request->api_version
                    ], 404);
                }
            }

            $apiResponse = json_decode($ninRecord->api_response, true);
            if (!$apiResponse || !isset($apiResponse['data'])) {
                return response()->json([
                    'error' => 'Invalid API response data'
                ], 400);
            }

            $data = $apiResponse['data']['data'] ?? $apiResponse['data'];

            // Generate PDF content based on template type
            $pdfContent = $this->generateNinPDF($data, $ninRecord, $request->template_type);

            // Return PDF download with appropriate filename
            $filename = $request->template_type === 'card' 
                ? 'nin-card-' . $request->nin . '.pdf' 
                : 'nin-slip-' . $request->nin . '.pdf';

            return response($pdfContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');

        } catch (\Exception $e) {
            $this->logLagacyNin('ERROR', 'Failed to generate PDF', [
                'error' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to generate PDF: ' . $e->getMessage()
            ], 500);
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

        return '<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>NIN Slip — Preview & Download</title>

  <style>
    :root{
      --green:#0b8640;
      --dark:#0b3f2a;
      --muted:#666;
      --card-bg:#fff;
      margin: 0;
      padding: 0;
    }
    body{
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      margin:24px;
      background:#f3f6f8;
      color:#111;
    }
    .wrap{ max-width:900px; margin:0 auto; }
    header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
    header .brand{ display:flex; align-items:center; gap:12px; }
   
    header h1{font-size:18px;margin:0}
    header p{margin:0;color:var(--muted);font-size:13px}

    .actions{display:flex;gap:10px;align-items:center;margin-bottom:18px}
    button{
      background:var(--green);color:#fff;border:none;padding:10px 14px;border-radius:6px;cursor:pointer;
      box-shadow:0 6px 18px rgba(11,134,64,0.12);
    }
    button.secondary{background:#fff;color:#111;border:1px solid #e1e5e9}
    button:disabled{opacity:.6;cursor:not-allowed}

    .slip{
      background:var(--card-bg);
      border-radius:8px;
      padding:18px;
      box-shadow:0 10px 30px rgba(20,30,40,0.06);
      border:1px solid #e9eef2;
      width:100%;
    }

    .slip .header{
      display:flex; align-items:center; gap:16px;
      border-bottom:6px solid var(--green);
      padding-bottom:12px;margin-bottom:12px;
    }
    .slip .org-title{font-weight:700;font-size:16px}
    .slip .org-sub{font-size:12px;color:var(--muted)}

    .slip-grid{ display:grid; grid-template-columns: 1fr 220px; gap:16px; align-items:start; }
    .info-grid{ display:grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap:8px 18px; }
    .field{font-size:13px}
    .label{color:var(--muted);font-size:11px;margin-bottom:4px}
    .val{font-weight:600}

    .photo-box{
      width:200px; border:1px solid #e6eef2; border-radius:6px;
      padding:8px; text-align:center; background:#fbfeff;
    }
    .photo-box img{width:100%;height:240px;object-fit:cover;border-radius:4px;border:1px solid #dfeef3}
    .photo-placeholder{
      width:100%;height:240px;display:flex;align-items:center;justify-content:center;
      color:#9aa9af;background:#f6fbf9;border-radius:4px;border:1px dashed #dfeef3;font-size:13px;
    }

    .foot{
      margin-top:14px; font-size:12px;color:var(--muted);
      display:flex;justify-content:space-between;align-items:center; gap:12px;
    }

    @media print {
      body { margin:0; }
      header, .actions { display:none; }
      .wrap{ max-width:100% }
      .slip{ box-shadow:none; border:none; padding:12mm; }
    }

    @media (max-width:720px){
      .slip-grid{ grid-template-columns: 1fr }
      .photo-box{ width:100% }
    }

  .nin-slip {
  border: 1px solid #000;
  padding: 0px;
  width: 100%;
  max-width: 1200px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  background: #fff;
  margin-left: 150px;
}

.slip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 8px;
  position: relative;
}

.slip-header .center-text {
  text-align: center;
  flex: 1;
}

.slip-header h2 {
  margin: 0;
  font-size: 30px;
  font-weight: bold;
}
.slip-header p {
  margin: 0;
  font-size: 13px;
}
.slip-header h3 {
  margin: 5px 0 0;
  font-size: 15px;
  color: green;
}

.slip-header .logo-left,
.slip-header .logo-right {
  width: 60px;
  height: 60px;
}

.slip-header .logo-left{
    margin-left: 10px;
}

.slip-header .logo-right{
    margin-right: 10px;
}

.slip-header .logo-left img,
.slip-header .logo-right img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.slip-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.slip-table > tbody > tr > td {
  border: 1px solid #000;
  padding: 5px;
  vertical-align: top;
}
.slip-table strong {
  display: block;
  font-size: 12px;
  margin-bottom: 2px;
}

.slip-footer {
  border-top: 1px solid #000;
  padding-top: 5px;
  font-size: 11px;
  text-align: center;
}

.contact-row {
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
  font-size: 11px;
}

.slip-table td {
  border: 1px solid #333;
  padding: 6px 10px;
  vertical-align: top;
}

.slip-table strong {
  font-size: 12px;
  color: #555;
  display: block;
  margin-bottom: 4px;
}

.photo-cell {
  width: 300px;
  text-align: center;
  vertical-align: top;
}

/* Passport photo container */
.photo-box,
#photoContainer,
#photoPreview {
  width: 140px;
  height: 180px;
  overflow: hidden;
}

.photo-box img,
#photoContainer img,
#photoPreview img {
  width: 140px;
  height: 180px;
  object-fit: cover;
  padding-right: 100px;
}

#photoContainer2{
  width: 100%;
  max-width: 400px;
  object-fit: cover;
  margin-left: 80px;
  margin-top: 4px;
}

.photo-placeholder {
  color: #999;
  font-size: 13px;
  width: 100%;
}

.address-box {
  margin-top: 5px;
  font-size: 12px;
  float: left;
}

#ad {
  font-size: 12px;
  margin-bottom: 4px;
  float: left;
}

.contact-row {
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
  font-size: 11px;
  text-align: center;
  border-top: 1px solid #000;
  padding-top: 8px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 200px;
  padding: 0 12px;
  text-align: center;
  z-index: 200;
  border-right: 1px solid #000;
}

.side-adjust{
  transform: translateX(-40px);
}

.contact-item:last-child {
  border-right: none;
}

.digital {
  width: 28px;
  height: 28px;
  margin-bottom: 6px;
}

#clientAddress {
  display: inline-block;
  max-width: 100px;
  word-wrap: break-word;
  text-align: left;
}

#nimc {
  width: 50px;
  height: 20;
}

  </style>
</head>
<body>

<div id="slipRoot2" class="nin-slip">

  <!-- Header -->
  <div class="slip-header">
    <div class="logo-left">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Coat_of_arms_of_Nigeria.svg/120px-Coat_of_arms_of_Nigeria.svg.png" alt="Coat of Arms">
    </div>
    <div class="center-text">
      <h2>National Identity Management System</h2>
      <p>Federal Republic of Nigeria</p>
      <h3>National Identification Number Slip (NINS)</h3>
    </div>
    <div class="logo-right">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/NIMC_logo.png/120px-NIMC_logo.png" alt="NIMC Logo">
    </div>
  </div>

  <!-- Details Grid -->
  <table class="slip-table">
    <tr>
      <td><strong>Tracking ID:</strong><span>' . $trackingId . '</span></td>
      <td><strong>Surname:</strong><span>' . $surname . '</span></td>
      <td rowspan="5" class="photo-cell">
         <div class="address-box">
          <strong id="ad">Address</strong><br>
          <span id="clientAddress">' . $address . '</span>
          </div>
        <div id="photoContainer2">
            <img id="photoPreview" src="' . $photoSrc . '" alt="Passport Photo"> 
        </div>
        </td>
    </tr>
    <tr>
      <td><strong>NIN:</strong><span>' . $nin . '</span></td>
      <td><strong>First Name:</strong><span>' . $firstName . '</span></td>
    </tr>
    <tr>
      <td><strong>Issue Date:</strong><span>' . $issueDate . '</span></td>
      <td><strong>Middle Name:</strong><span>' . $middleName . '</span></td>
    </tr>
    <tr>
      <td></td>
      <td><strong>Gender:</strong><span>' . $gender . '</span>
    </td>
    </tr>
  </table>
   <p style="font-size: 0.9rem; padding-left: 10px; ">
    <strong>Note: The National Identification Number (NIN) is your identity.</strong> It is confidential and may only be released for legitimate transactions.
    you will notified your National Identity Card is ready (for any enquiries please contact)
   </p>

  <!-- Footer Disclaimer -->
 <div class="contact-row">
  <div class="contact-item">
    <img style="transform: translateX(-40px);" class="digital" src="https://img.icons8.com/ios-filled/50/000000/cloud.png" alt="Email">
    <div class="side-adjust"><strong>helpdesk@nimc.gov.ng</strong></div>
  </div>
  <div class="contact-item">
    <img style="transform: translateX(-80px);" class="digital" src="https://img.icons8.com/ios-filled/50/000000/internet.png" alt="Website">
    <div style="transform: translateX(-80px);"><strong>www.nimc.gov.ng</strong></div>
  </div>
  <div class="contact-item">
    <img style="transform: translateX(-80px);" class="digital" src="https://img.icons8.com/ios-filled/50/000000/phone.png" alt="Phone">
    <div style="transform: translateX(-80px);"><strong>0700-CALL-NIMC</strong><br>(0700-2255-6462)</div>
  </div>
  <div class="contact-item">
    <img style="transform: translateX(-40px);" class="digital" src="https://img.icons8.com/ios-filled/50/000000/address.png" alt="Address">
    <div style="transform: translateX(-40px);">
      <strong>National Identity Management Commission</strong><br>
      11 Sokoto Crescent, Off Dalaba Street,Zone 5 Wuse, Abuja Nigeria
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
            // Use the base64 image from the template
            $photoSrc = 'data:image/jpeg;base64,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';
        }

        // Format NIN with spaces for display
        $formattedNin = preg_replace('/(\d{4})(\d{4})(\d{3})/', '$1 $2 $3', $nin);

        return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NIN Card Template</title>

    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 0;
            background-color: #fff;
            font-family: Arial, sans-serif;
            color: #333;
        }

        h1, h2 {
            margin: 5px 0;
            text-align: center;
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
            height: 350px; /* Adjust based on your plastic.png height */
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
            <img src="plastic.png" alt="NIN Backdrop" class="background-img">

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
                <!-- Insert QR Code Image Here -->
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
                If this NIN was not issued to person on the front of this document, please DO<br>
                NOT attempt to scan, photocopy or replicate personal data contained herein.<br><br>
                You are only permitted to scan barcode for purpose of identity verification.<br>
                The FEDERAL GOVERNMENT OF NIGERIA assumes no responsibility<br>
                if you accept any variance in scan result or do not scan 2D barcode overleaf
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
