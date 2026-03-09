import '../../../css/auth.css';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm();

    const resendVerification = (e) => {
        e.preventDefault();
        post(route('verification.send'), {
            onSuccess: () => {
                // Show success message
            }
        });
    };

    return (
        <>
            <Head title="Email Verification" />

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Verify Email</h1>
                        <p className="auth-subtitle">Please check your email for a verification link</p>
                    </div>
                    
                    {status === 'verification-link-sent' && (
                        <div className="auth-status">
                            A new verification link has been sent to your email address.
                        </div>
                    )}

                    <div className="form-actions">
                        <PrimaryButton 
                            className="auth-button" 
                            disabled={processing}
                            onClick={resendVerification}
                        >
                            Resend Verification Email
                        </PrimaryButton>
                    </div>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            <Link href={route('login')} className="auth-link">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
