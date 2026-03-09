<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $verificationCode;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $verificationCode)
    {
        $this->user = $user;
        $this->verificationCode = $verificationCode;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): \Illuminate\Mail\Mailables\Envelope
    {
        return new \Illuminate\Mail\Mailables\Envelope(
            subject: 'Email Verification Code',
        );
    }

    /**
     * Build the HTML content for the email.
     */
    public function buildHtmlContent(): string
    {
        return "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;'>
                <div style='background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                    <h2 style='color: #333; margin-bottom: 20px;'>Email Verification</h2>
                    <p style='color: #666; font-size: 16px; line-height: 1.5;'>
                        Hi {$this->user->name},
                    </p>
                    <p style='color: #666; font-size: 16px; line-height: 1.5;'>
                        Your verification code is: <strong style='color: #059669; font-size: 24px;'>{$this->verificationCode}</strong>
                    </p>
                    <p style='color: #666; font-size: 14px; line-height: 1.5;'>
                        This code will expire in 15 minutes.
                    </p>
                    <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;'>
                        <p style='color: #999; font-size: 12px; margin: 0;'>
                            If you didn't request this code, please ignore this email.
                        </p>
                    </div>
                </div>
            </div>
        ";
    }
}
