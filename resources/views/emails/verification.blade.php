<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Hello {{ $notifiable->name }},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Please click the button below to verify your email address.
            </p>
            <div style="margin: 30px 0; text-align: center;">
                <a href="{{ $verificationUrl }}" style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
                If you're having trouble clicking the button, copy and paste the URL below into your web browser:
            </p>
            <p style="color: #059669; font-size: 12px; word-break: break-all;">
                {{ $verificationUrl }}
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    If you didn't create an account, no further action is required.
                </p>
            </div>
        </div>
    </div>
</body>
