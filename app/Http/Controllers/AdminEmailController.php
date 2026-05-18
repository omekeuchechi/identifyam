<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Mail\CustomAdminEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminEmailController extends Controller
{
    /**
     * Show the send email page.
     */
    public function index()
    {
        // Get all users for the selection
        $users = User::select('id', 'name', 'email')->get();
        
        return Inertia::render('Admin/SendEmail', [
            'users' => $users
        ]);
    }

    /**
     * Send email to selected users.
     */
    public function send(Request $request)
    {
        $request->validate([
            'users' => 'required|array',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $userIds = $request->users;
        $subject = $request->subject;
        $content = $request->content;

        // If 'all' is selected, get all user emails
        if (in_array('all', $userIds)) {
            $recipients = User::pluck('email')->toArray();
        } else {
            $recipients = User::whereIn('id', $userIds)->pluck('email')->toArray();
        }

        try {
            foreach ($recipients as $email) {
                Mail::to($email)->send(new CustomAdminEmail($subject, $content));
            }

            // Log activity
            $this->logActivity('admin_email_sent', "Email sent to " . count($recipients) . " recipients", 'admin', [
                'subject' => $subject,
                'recipient_count' => count($recipients)
            ]);

            return back()->with('success', 'Email sent successfully to ' . count($recipients) . ' users.');
        } catch (\Exception $e) {
            Log::error('Failed to send admin email: ' . $e->getMessage());
            return back()->with('error', 'Failed to send email. Please check logs.');
        }
    }
}
