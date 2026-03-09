<?php

namespace App\Http\Controllers\Nin;

use App\Http\Controllers\Controller;
use App\Models\nin_slip;
use App\Models\nin_slip2;
use App\Models\nin_slip3;
use App\Models\nin_slip4;
use App\Models\nin_search3_demographic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class NinController extends Controller
{
    public function nin_search1(Request $request): Response
    {
        $nin = $request->input('nin');

        if (!$nin) {
            return response()->json([
                'error' => 'NIN is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token ' . config('services.easy_verify.token'),
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search1/', [
            'nin' => $nin
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data'])) {
            nin_slip::updateOrCreate(
                ['nin' => $nin],
                ['phone' => $responseData['data']['telephoneno'] ?? null],
                ['surname' => $responseData['data']['surname'] ?? null],
                ['first_name' => $responseData['data']['firstname'] ?? null],
                ['birth_date' => $responseData['data']['birthdate'] ?? null],
                ['gender' => $responseData['data']['gender'] ?? null],
                ['photo' => $responseData['data']['photo'] ?? null],
                ['signature' => $responseData['data']['signature'] ?? null],
                ['religion' => $responseData['data']['religion'] ?? null],
                ['title' => $responseData['data']['title'] ?? null],
                ['email' => $responseData['data']['email'] ?? null],
                ['trackingId' => $responseData['data']['trackingId'] ?? null],
                ['transaction_id' => $responseData['transaction_id'] ?? null],
                ['marital_status' => $responseData['data']['maritalstatus'] ?? null],
                ['status' => $responseData['status'] ?? null]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }

    public function search_by_Phone1(Request $request): Response
    {
        $phone = $request->input('phone');

        if (!$phone) {
            return response()->json([
                'error' => 'Phone number is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token ' . config('services.easy_verify.token'),
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search1/by-phone/', [
            'phone' => $phone
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data'])) {
            nin_slip::updateOrCreate(
                ['nin' => $responseData['data']['nin'] ?? null],
                [
                    'phone' => $responseData['data']['telephoneno'] ?? $phone,
                    'surname' => $responseData['data']['surname'] ?? null,
                    'first_name' => $responseData['data']['firstname'] ?? null,
                    'birth_date' => $responseData['data']['birthdate'] ?? null,
                    'gender' => $responseData['data']['gender'] ?? null,
                    'photo' => $responseData['data']['photo'] ?? null,
                    'signature' => $responseData['data']['signature'] ?? null,
                    'religion' => $responseData['data']['religion'] ?? null,
                    'title' => $responseData['data']['title'] ?? null,
                    'email' => $responseData['data']['email'] ?? null,
                    'trackingId' => $responseData['data']['trackingId'] ?? null,
                    'transaction_id' => $responseData['transaction_id'] ?? null,
                    'marital_status' => $responseData['data']['maritalstatus'] ?? null,
                    'status' => $responseData['status'] ?? null
                ]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }

    public function search_by_Phone2(Request $request): Response
    {
        $phone = $request->input('phone');

        if (!$phone) {
            return response()->json([
                'error' => 'Phone number is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token ' . config('services.easy_verify.token'),
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search2/by-phone/', [
            'phone' => $phone
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data'])) {
            $data = $responseData['data'];

            nin_slip2::updateOrCreate(
                ['nin' => $data['idNumber'] ?? null],
                [
                    'phone' => $data['mobile'] ?? $phone,
                    'surname' => $data['lastName'] ?? null,
                    'first_name' => $data['firstName'] ?? null,
                    'birth_date' => $data['dateOfBirth'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'image' => $data['image'] ?? null,
                    'last_name' => $data['lastName'] ?? null,
                    'religion' => $data['religion'] ?? null,
                    'middle_name' => $data['middleName'] ?? null,
                    'email' => $data['email'] ?? null,
                    'trackingId' => $data['id'] ?? null,
                    'country' => $data['country'] ?? null,
                    'all_validation_passed' => $data['allValidationPassed'] ? 'true' : 'false',
                    'signature' => $data['signature'] ?? null,
                    'transaction_id' => $responseData['transaction_id'] ?? null,
                ]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }

    public function nin_search2(Request $request): Response
    {
        $nin = $request->input('nin');

        if (!$nin) {
            return response()->json([
                'error' => 'NIN is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token ' . config('services.easy_verify.token'),
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search2/', [
            'nin' => $nin
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data'])) {
            $data = $responseData['data'];

            nin_slip2::updateOrCreate(
                ['nin' => $data['idNumber'] ?? null],
                [
                    'phone' => $data['mobile'] ?? null,
                    'surname' => $data['lastName'] ?? null,
                    'first_name' => $data['firstName'] ?? null,
                    'birth_date' => $data['dateOfBirth'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'image' => $data['image'] ?? null,
                    'last_name' => $data['lastName'] ?? null,
                    'religion' => $data['religion'] ?? null,
                    'middle_name' => $data['middleName'] ?? null,
                    'email' => $data['email'] ?? null,
                    'trackingId' => $data['id'] ?? null,
                    'country' => $data['country'] ?? null,
                    'all_validation_passed' => $data['allValidationPassed'] ? 'true' : 'false',
                    'signature' => $data['signature'] ?? null,
                    'transaction_id' => $responseData['transaction_id'] ?? null,
                ]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }

    public function nin_search3(Request $request): Response
    {
        $nin = $request->input('nin');
        
        if (!$nin) {
            return response()->json([
                'error' => 'NIN is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token ' . config('services.easy_verify.token'),
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search3/', [
            'nin' => $nin
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data']['data'])) {
            $data = $responseData['data']['data'];
            
            nin_slip3::updateOrCreate(
                ['nin' => $data['nin'] ?? null],
                [
                    'phone' => $data['telephoneno'] ?? null,
                    'photo' => $data['photo'] ?? null,
                    'signature' => $data['signature'] ?? null,
                    'religion' => $data['religion'] ?? null,
                    'title' => $data['title'] ?? null,
                    'surname' => $data['surname'] ?? null,
                    'firstname' => $data['firstname'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'birthdate' => $data['birthdate'] ?? null,
                    'email' => $data['email'] ?? null,
                    'trackingId' => $data['trackingId'] ?? null,
                    'marital_status' => $data['maritalstatus'] ?? null,
                ]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }

    public function search_by_Phone3(Request $request): Response
    {
        $phone = $request->input('phone');
        
        if (!$phone) {
            return response()->json([
                'error' => 'Phone number is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token ' . config('services.easy_verify.token'),
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search3/by-phone/', [
            'phone' => $phone
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data']['data'])) {
            $data = $responseData['data']['data'];
            
            nin_slip3::updateOrCreate(
                ['nin' => $data['nin'] ?? null],
                [
                    'phone' => $data['telephoneno'] ?? $phone,
                    'photo' => $data['photo'] ?? null,
                    'signature' => $data['signature'] ?? null,
                    'religion' => $data['religion'] ?? null,
                    'title' => $data['title'] ?? null,
                    'surname' => $data['surname'] ?? null,
                    'firstname' => $data['firstname'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'birthdate' => $data['birthdate'] ?? null,
                    'email' => $data['email'] ?? null,
                    'trackingId' => $data['trackingId'] ?? null,
                    'marital_status' => $data['maritalstatus'] ?? null,
                ]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }

    public function nin_search4(Request $request): Response
    {
        $nin = $request->input('nin');
        
        if (!$nin) {
            return response()->json([
                'error' => 'NIN is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token bff5c63bc7c894011b450ad51df750ed22e21132',
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search4/', [
            'nin' => $nin
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data'])) {
            $data = $responseData['data'];
            
            nin_slip4::updateOrCreate(
                ['nin' => $data['idNumber'] ?? null],
                [
                    'phone' => $data['mobile'] ?? null,
                    'photo' => $data['photo'] ?? null,
                    'signature' => $data['signature'] ?? null,
                    'religion' => $data['religion'] ?? null,
                    'title' => $data['title'] ?? null,
                    'surname' => $data['lastName'] ?? null,
                    'firstname' => $data['firstName'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'birthdate' => $data['dateOfBirth'] ?? null,
                    'lga' => $data['address']['lga'] ?? null,
                    'trackingId' => $data['trackingId'] ?? null,
                    'marital_status' => $data['maritalstatus'] ?? null,
                ]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }

    public function search_by_Phone4(Request $request): Response
    {
        $phone = $request->input('phone');
        
        if (!$phone) {
            return response()->json([
                'error' => 'Phone number is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token bff5c63bc7c894011b450ad51df750ed22e21132',
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search4/by-phone/', [
            'phone' => $phone
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data'])) {
            $data = $responseData['data'];
            
            nin_slip4::updateOrCreate(
                ['nin' => $data['nin'] ?? null],
                [
                    'phone' => $data['telephoneno'] ?? $phone,
                    'photo' => $data['image'] ?? null,
                    'signature' => $data['signature'] ?? null,
                    'religion' => $data['religion'] ?? null,
                    'title' => $data['title'] ?? null,
                    'surname' => $data['surname'] ?? null,
                    'firstname' => $data['firstname'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'birthdate' => $data['birthdate'] ?? null,
                    'lga' => $data['residence_lga'] ?? null,
                    'trackingId' => $data['trackingId'] ?? null,
                    'marital_status' => $data['maritalstatus'] ?? null,
                ]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }

    public function nin_search_demographic(Request $request): Response
    {
        $nin = $request->input('nin');
        
        if (!$nin) {
            return response()->json([
                'error' => 'NIN is required'
            ], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Token ' . config('services.easy_verify.token'),
            'Content-Type' => 'application/json'
        ])->post('https://eazyverify.com.ng/api/nin-search2/', [
            'nin' => $nin
        ]);

        $responseData = $response->json();

        // Save to database if request is successful
        if ($response->successful() && isset($responseData['data'])) {
            $data = $responseData['data'];
            
            nin_search3_demographic::updateOrCreate(
                ['nin' => $data['nin'] ?? null],
                [
                    'phone' => $data['telephoneno'] ?? null,
                    'photo' => $data['photo'] ?? null,
                    'signature' => $data['signature'] ?? null,
                    'religion' => $data['religion'] ?? null,
                    'title' => $data['title'] ?? null,
                    'surname' => $data['surname'] ?? null,
                    'first_name' => $data['firstname'] ?? null,
                    'birth_date' => $data['birthdate'] ?? null,
                    'gender' => $data['gender'] ?? null,
                    'batchid' => $data['batchid'] ?? null,
                    'birthcountry' => $data['birthcountry'] ?? null,
                    'birthlga' => $data['birthlga'] ?? null,
                    'birthstate' => $data['birthstate'] ?? null,
                    'cardstatus' => $data['cardstatus'] ?? null,
                    'centralID' => $data['centralID'] ?? null,
                    'educationallevel' => $data['educationallevel'] ?? null,
                    'emplymentstatus' => $data['emplymentstatus'] ?? null,
                    'middlename' => $data['middlename'] ?? null,
                    'heigth' => $data['heigth'] ?? null,
                    'maritalstatus' => $data['maritalstatus'] ?? null,
                    'nok_address1' => $data['nok_address1'] ?? null,
                    'nok_firstname' => $data['nok_firstname'] ?? null,
                    'nok_lga' => $data['nok_lga'] ?? null,
                    'nok_state' => $data['nok_state'] ?? null,
                    'nok_surname' => $data['nok_surname'] ?? null,
                    'nok_town' => $data['nok_town'] ?? null,
                    'nspokenlang' => $data['nspokenlang'] ?? null,
                    'ospokenlang' => $data['ospokenlang'] ?? null,
                    'pfirstname' => $data['pfirstname'] ?? null,
                    'pmiddlename' => $data['pmiddlename'] ?? null,
                    'psurname' => $data['psurname'] ?? null,
                    'residence_AdressLine1' => $data['residence_AdressLine1'] ?? null,
                    'residence_Town' => $data['residence_Town'] ?? null,
                    'residence_lga' => $data['residence_lga'] ?? null,
                    'residence_state' => $data['residence_state'] ?? null,
                    'residencestatus' => $data['residencestatus'] ?? null,
                    'trackingId' => $data['trackingId'] ?? null,
                ]
            );
        }

        return response()->json([
            'data' => $responseData,
            'status' => $response->status()
        ]);
    }


}

