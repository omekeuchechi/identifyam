<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function settings() {

        $user = Auth::user();

        return Inertia::render('Settings', [
            'user' => $user
        ]);

    }

    // public function report_bug(Request $request) {

    // }
}
