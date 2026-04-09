import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`profile-form ${className}`}>
            <div className="delete-account-content">
                <div className="warning-message" style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                        <i className="fas fa-exclamation-triangle" style={{ 
                            marginRight: '12px', 
                            color: '#dc2626',
                            fontSize: '24px'
                        }}></i>
                        <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            color: '#dc2626',
                            margin: 0
                        }}>
                            Delete Account
                        </h3>
                    </div>
                    <p style={{ 
                        color: '#991b1b', 
                        fontSize: '14px',
                        lineHeight: '1.5',
                        margin: 0
                    }}>
                        Once your account is deleted, all of its resources and data will be permanently deleted. 
                        Before deleting your account, please download any data or information that you wish to retain.
                    </p>
                </div>

                <button
                    onClick={confirmUserDeletion}
                    className="btn-danger"
                    style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                    <i className="fas fa-trash-alt" style={{ marginRight: '8px' }}></i>
                    Delete Account
                </button>
            </div>

            {/* Confirmation Modal */}
            {confirmingUserDeletion && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '32px',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <form onSubmit={deleteUser}>
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ 
                                    fontSize: '20px', 
                                    fontWeight: '600', 
                                    color: '#dc2626',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <i className="fas fa-exclamation-triangle" style={{ 
                                        marginRight: '12px', 
                                        color: '#dc2626' 
                                    }}></i>
                                    Confirm Account Deletion
                                </h3>
                                <p style={{ 
                                    color: '#6b7280', 
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    marginBottom: '16px'
                                }}>
                                    Once your account is deleted, all of its resources and data will be permanently deleted. 
                                    Please enter your password to confirm you would like to permanently delete your account.
                                </p>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label htmlFor="password" className="form-label">
                                    Password <span className="required">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your password to confirm"
                                    autoFocus
                                />
                                {errors.password && (
                                    <p className="error-message">{errors.password}</p>
                                )}
                            </div>

                            <div className="modal-actions" style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px'
                            }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-secondary"
                                    style={{
                                        backgroundColor: '#6b7280',
                                        color: 'white',
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-danger"
                                    style={{
                                        backgroundColor: processing ? '#9ca3af' : '#dc2626',
                                        color: 'white',
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!processing) e.currentTarget.style.backgroundColor = '#b91c1c';
                                    }}
                                    onMouseOut={(e) => {
                                        if (!processing) e.currentTarget.style.backgroundColor = '#dc2626';
                                    }}
                                >
                                    {processing ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-trash-alt" style={{ marginRight: '8px' }}></i>
                                            Delete Account
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .delete-account-content {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .form-label {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #374151;
                    font-size: 14px;
                    display: block;
                }

                .required {
                    color: #ef4444;
                }

                .form-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 4px;
                }

                @media (max-width: 640px) {
                    .modal-content {
                        margin: 16px;
                        padding: 24px;
                    }

                    .modal-actions {
                        flex-direction: column;
                    }

                    .modal-actions button {
                        width: 100%;
                    }
                }
            `}</style>
        </section>
    );
}
