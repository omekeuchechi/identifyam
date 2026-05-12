<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class SecurityAlert extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $alertType;
    public $details;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $alertType, $details = [])
    {
        $this->user = $user;
        $this->alertType = $alertType;
        $this->details = $details;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🚨 SECURITY ALERT - ' . $this->alertType,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.security-alert',
            with: [
                'user' => $this->user,
                'alertType' => $this->alertType,
                'details' => $this->details,
            ]
        );
    }
}
