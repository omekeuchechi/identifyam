import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`profile-form ${className}`}>
            <form onSubmit={updatePassword} className="password-update-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="current_password" className="form-label">
                            Current Password <span className="required">*</span>
                        </label>
                        <input
                            type="password"
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            className="form-input"
                            autoComplete="current-password"
                            placeholder="Enter your current password"
                        />
                        {errors.current_password && (
                            <p className="error-message">{errors.current_password}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            New Password <span className="required">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="form-input"
                            autoComplete="new-password"
                            placeholder="Enter your new password"
                        />
                        {errors.password && (
                            <p className="error-message">{errors.password}</p>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password_confirmation" className="form-label">
                        Confirm New Password <span className="required">*</span>
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="form-input"
                        autoComplete="new-password"
                        placeholder="Confirm your new password"
                    />
                    {errors.password_confirmation && (
                        <p className="error-message">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="password-requirements" style={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #0ea5e9',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '16px'
                }}>
                    <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#0369a1',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
                        Password Requirements:
                    </h4>
                    <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        fontSize: '13px',
                        color: '#0c4a6e'
                    }}>
                        <li style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-check" style={{ marginRight: '8px', color: '#10b981', fontSize: '12px' }}></i>
                            At least 8 characters long
                        </li>
                        <li style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-check" style={{ marginRight: '8px', color: '#10b981', fontSize: '12px' }}></i>
                            Contains uppercase and lowercase letters
                        </li>
                        <li style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-check" style={{ marginRight: '8px', color: '#10b981', fontSize: '12px' }}></i>
                            Contains at least one number
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-check" style={{ marginRight: '8px', color: '#10b981', fontSize: '12px' }}></i>
                            Contains at least one special character
                        </li>
                    </ul>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                        style={{
                            backgroundColor: processing ? '#9ca3af' : '#10b981',
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
                            if (!processing) e.currentTarget.style.backgroundColor = '#059669';
                        }}
                        onMouseOut={(e) => {
                            if (!processing) e.currentTarget.style.backgroundColor = '#10b981';
                        }}
                    >
                        {processing ? (
                            <>
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                Updating...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>
                                Update Password
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
                            Password updated successfully!
                        </div>
                    )}
                </div>
            </form>

            <style jsx>{`
                .password-update-form {
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
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
