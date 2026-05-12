import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

import '../../../css/auth.css';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            {status && (
                <div className="auth-status">
                    {status}
                </div>
            )}

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Forgot Password</h1>
                        <p className="auth-subtitle">No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</p>
                    </div>
                    
                    <form onSubmit={submit} className="auth-form">
                        <div className="form-group">
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-input"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="form-error" />
                        </div>

                        <div className="form-actions">
                            <PrimaryButton className="auth-button" disabled={processing}>
                                Email Password Reset Link
                            </PrimaryButton>
                        </div>

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <div className="form-actions">
                            <a 
                                href={route('login')} 
                                className="google-button"
                            >
                                <svg className="arrow-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                                Back to Login
                            </a>

                            <p>Remember your password? <a href={route('login')}>Sign in</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
