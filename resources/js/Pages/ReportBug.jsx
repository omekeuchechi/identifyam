import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import logoImage from '../../assets/svg/shield.svg';
import defaultProfileImage from '../../assets/img/user_profile.png';

export default function ReportBug({ auth }) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        title: '',
        description: '',
        category: 'bug',
        priority: 'medium',
        browser: '',
        user_agent: navigator.userAgent,
        reproduction_steps: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('report.bug.submit'), {
            onSuccess: () => {
                setShowSuccess(true);
                reset();
                setTimeout(() => setShowSuccess(false), 5000);
            }
        });
    };

    return (
        <>
            <Head title="Report Bug" />

            <div className="dashboard-layout">

                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-image">
                            <img src={logoImage} alt="" />
                        </div>
                        <span>IDENTIFYAM</span>
                    </div>

                    <nav className="sidebar-menu">
                        <a href={route('dashboard')}><i className="fas fa-home"></i>Dashboard</a>
                        <a href={route('nin.service')}><i className="fas fa-id-card"></i> NIN Services</a>
                        <a href={route('exam.cards')}><i className="fas fa-credit-card"></i> Exam Cards</a>
                        <a><i className="fas fa-building"></i> CAC Registration</a>
                        <a><i className="fas fa-graduation-cap"></i> Study Abroad</a>
                        <a href={route('funding')}><i className="fas fa-wallet"></i> Wallet</a>
                        <a><i className="fas fa-history"></i> History</a>
                        <a href={route('settings')}><i className="fas fa-cog"></i> Settings</a>
                    </nav>
                </aside>

                {/* Main Area */}
                <div className="dashboard-main">

                    {/* Topbar */}
                    <header className="topbar">
                        <h3>Report Bug</h3>

                        <div className="topbar-right">
                            <span className="notification"><i className="fas fa-bell"></i></span>
                            <div className="user-profile">
                                <img src={defaultProfileImage} alt="avatar" />
                                <span>{auth.user.name}</span>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="dashboard-content">

                        {/* Welcome */}
                        <div className="welcome">
                            <h1>Report a Bug</h1>
                            <p>
                                Help us improve your experience by reporting any issues
                                you encounter while using our platform
                            </p>
                        </div>

                        {/* Success Message */}
                        {(showSuccess || wasSuccessful) && (
                            <div className="success-message" style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                padding: '16px',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <i className="fas fa-check-circle" style={{ fontSize: '20px' }}></i>
                                <div>
                                    <strong>Success!</strong> Bug report submitted successfully! We will investigate and resolve it soon.
                                </div>
                            </div>
                        )}

                        {/* Bug Report Form */}
                        <div className="bug-report-form" style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="title" className="form-label">
                                            Title <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="form-input"
                                            maxLength="255"
                                            placeholder="Brief description of the issue"
                                            required
                                        />
                                        {errors.title && (
                                            <p className="error-message">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category" className="form-label">
                                            Category <span className="required">*</span>
                                        </label>
                                        <select
                                            id="category"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="form-select"
                                            required
                                        >
                                            <option value="bug">🐛 Bug</option>
                                            <option value="feature">✨ Feature Request</option>
                                            <option value="other">📋 Other</option>
                                        </select>
                                        {errors.category && (
                                            <p className="error-message">{errors.category}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="priority" className="form-label">
                                            Priority <span className="required">*</span>
                                        </label>
                                        <select
                                            id="priority"
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                            className="form-select"
                                            required
                                        >
                                            <option value="low">🟢 Low</option>
                                            <option value="medium">🟡 Medium</option>
                                            <option value="high">🟠 High</option>
                                            <option value="critical">🔴 Critical</option>
                                        </select>
                                        {errors.priority && (
                                            <p className="error-message">{errors.priority}</p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="browser" className="form-label">
                                            Browser
                                        </label>
                                        <input
                                            type="text"
                                            id="browser"
                                            value={data.browser}
                                            onChange={(e) => setData('browser', e.target.value)}
                                            className="form-input"
                                            maxLength="100"
                                            placeholder="e.g., Chrome 120.0.0.0"
                                        />
                                        {errors.browser && (
                                            <p className="error-message">{errors.browser}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" className="form-label">
                                        Description <span className="required">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className="form-textarea"
                                        maxLength="2000"
                                        placeholder="Please describe the issue in detail..."
                                        required
                                    />
                                    {errors.description && (
                                        <p className="error-message">{errors.description}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reproduction_steps" className="form-label">
                                        Steps to Reproduce
                                    </label>
                                    <textarea
                                        id="reproduction_steps"
                                        value={data.reproduction_steps}
                                        onChange={(e) => setData('reproduction_steps', e.target.value)}
                                        rows="3"
                                        className="form-textarea"
                                        maxLength="1000"
                                        placeholder="Please describe the steps to reproduce the issue..."
                                    />
                                    {errors.reproduction_steps && (
                                        <p className="error-message">{errors.reproduction_steps}</p>
                                    )}
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="btn-secondary"
                                        style={{
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            padding: '12px 24px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            marginRight: '12px'
                                        }}
                                    >
                                        Cancel
                                    </button>
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
                                            cursor: processing ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {processing ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                                                Submit Bug Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Help Section */}
                        <div className="help-section" style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: '12px',
                            padding: '24px',
                            marginTop: '32px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h3 style={{ marginBottom: '16px', color: '#374151' }}>
                                <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#3b82f6' }}></i>
                                Tips for a Good Bug Report
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '8px', color: '#6b7280' }}>
                                    <i className="fas fa-check" style={{ marginRight: '8px', color: '#10b981' }}></i>
                                    Be specific and provide as much detail as possible
                                </li>
                                <li style={{ marginBottom: '8px', color: '#6b7280' }}>
                                    <i className="fas fa-check" style={{ marginRight: '8px', color: '#10b981' }}></i>
                                    Include steps to reproduce the issue
                                </li>
                                <li style={{ marginBottom: '8px', color: '#6b7280' }}>
                                    <i className="fas fa-check" style={{ marginRight: '8px', color: '#10b981' }}></i>
                                    Mention your browser and operating system
                                </li>
                                <li style={{ color: '#6b7280' }}>
                                    <i className="fas fa-check" style={{ marginRight: '8px', color: '#10b981' }}></i>
                                    Include screenshots if applicable
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx>{`
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

                .form-input,
                .form-select,
                .form-textarea {
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
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
                    justify-content: flex-end;
                    margin-top: 32px;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .form-actions button {
                        width: 100%;
                        margin-right: 0 !important;
                        margin-bottom: 12px;
                    }
                }
            `}</style>
        </>
    );
}
