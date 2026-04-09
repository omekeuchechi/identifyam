import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={`profile-form ${className}`}>
            <form onSubmit={submit} className="profile-update-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Full Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="form-input"
                            required
                            autoFocus
                            autoComplete="name"
                            placeholder="Enter your full name"
                        />
                        {errors.name && (
                            <p className="error-message">{errors.name}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="form-input"
                            required
                            autoComplete="username"
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <p className="error-message">{errors.email}</p>
                        )}
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="verification-notice" style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <i className="fas fa-exclamation-triangle" style={{ 
                                marginRight: '8px', 
                                color: '#f59e0b' 
                            }}></i>
                            <span style={{ fontWeight: '600', color: '#92400e' }}>Email Verification Required</span>
                        </div>
                        <p style={{ color: '#92400e', fontSize: '14px', marginBottom: '12px' }}>
                            Your email address is unverified. Please verify your email to secure your account.
                        </p>
                        <button
                            onClick={() => window.location.href = route('verification.send')}
                            className="verification-button"
                            style={{
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                        >
                            <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                            Resend Verification Email
                        </button>
                        {status === 'verification-link-sent' && (
                            <div style={{ 
                                marginTop: '12px', 
                                fontSize: '14px', 
                                color: '#059669',
                                fontWeight: '500'
                            }}>
                                <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                        style={{
                            backgroundColor: processing ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => {
                            if (!processing) e.currentTarget.style.backgroundColor = '#2563eb';
                        }}
                        onMouseOut={(e) => {
                            if (!processing) e.currentTarget.style.backgroundColor = '#3b82f6';
                        }}
                    >
                        {processing ? (
                            <>
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                                Save Changes
                            </>
                        )}
                    </button>

                    {recentlySuccessful && (
                        <div className="success-message" style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#059669',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginLeft: '16px'
                        }}>
                            <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                            Profile updated successfully!
                        </div>
                    )}
                </div>
            </form>

            <style jsx>{`
                .profile-update-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-label {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #374151;
                    font-size: 14px;
                }

                .required {
                    color: #ef4444;
                }

                .form-input {
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 4px;
                }

                .form-actions {
                    display: flex;
                    align-items: center;
                    margin-top: 32px;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .form-actions {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .success-message {
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </section>
    );
}
