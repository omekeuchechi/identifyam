<?php

namespace App\Http\Controllers;

use App\Models\report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Show bug report form
     */
    public function index(): Response
    {
        return Inertia::render('ReportBug', [
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Submit bug report
     */
    public function submit(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'category' => 'required|string|in:bug,feature,other',
            'priority' => 'required|string|in:low,medium,high,critical',
            'browser' => 'nullable|string|max:100',
            'user_agent' => 'nullable|string|max:500',
            'reproduction_steps' => 'nullable|string|max:1000'
        ]);

        try {
            $report = report::create([
                'user_id' => Auth::id(),
                'title' => $request->title,
                'description' => $request->description,
                'category' => $request->category,
                'priority' => $request->priority,
                'browser' => $request->browser,
                'user_agent' => $request->user_agent,
                'reproduction_steps' => $request->reproduction_steps,
                'status' => 'open',
                'ip_address' => $request->ip()
            ]);

            // Log bug report submission
            $this->logActivity('bug_report', 'Bug report submitted', 'system', [
                'report_id' => $report->id,
                'title' => $request->title,
                'category' => $request->category,
                'priority' => $request->priority
            ]);

            return redirect()->back()->with('success', 'Bug report submitted successfully! We will investigate and resolve it soon.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to submit bug report: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Get all bug reports for admin
     */
    public function allReports(): Response
    {
        $reports = report::with(['user'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Reports', [
            'auth' => [
                'user' => Auth::user()
            ],
            'reports' => $reports
        ]);
    }
}
