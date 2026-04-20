import { useState } from 'react';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import logoImage from '../../../assets/svg/shield.svg';
import defaultProfileImage from '../../../assets/img/user_profile.png';

export default function Edit({ auth, mustVerifyEmail, status }) {

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        if (showLogoutConfirm) {
            // Create and submit a form for POST request
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = route('logout');

            // Add CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (csrfToken) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = '_token';
                csrfInput.value = csrfToken.getAttribute('content');
                form.appendChild(csrfInput);
            }

            document.body.appendChild(form);
            form.submit();
        } else {
            setShowLogoutConfirm(true);
            setTimeout(() => setShowLogoutConfirm(false), 3000);
        }
    };

    return (
        <>
            <Head title="Profile" />

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
                        <a href="lagacy-nin"><i className="fas fa-id-card"></i> NIN Services</a>
                        <a href={route('exam.cards')}><i className="fas fa-credit-card"></i> Exam Cards</a>

                        <button onClick={handleLogout} style={{
                            padding: '15px 20px',
                            backgroundColor: 'red',
                            color: '#fff',
                            fontSize: '15px',
                            border: 'none',
                            borderRadius: '20px'
                         }}><i className='fas fa-sign-out'></i> Logout</button>

                </nav>
            </aside>

            {/* Main Area */}
            <div className="dashboard-main">

                {/* Topbar */}
                <header className="topbar">
                    <h3>Profile</h3>

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
                        <h1>Profile Settings</h1>
                        <p>
                            Manage your personal information and account security
                        </p>
                    </div>

                    {/* Profile Sections */}
                    <div className="profile-sections" style={{
                        display: 'grid',
                        gap: '32px',
                        marginTop: '32px'
                    }}>

                        {/* Profile Information */}
                        <div className="profile-card" style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <i className="fas fa-user" style={{
                                        marginRight: '12px',
                                        color: '#3b82f6',
                                        fontSize: '24px'
                                    }}></i>
                                    Profile Information
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                    Update your account's profile information and email address
                                </p>
                            </div>

                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="profile-form"
                            />
                        </div>

                        {/* Password Update */}
                        <div className="profile-card" style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <i className="fas fa-lock" style={{
                                        marginRight: '12px',
                                        color: '#10b981',
                                        fontSize: '24px'
                                    }}></i>
                                    Security Settings
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                    Ensure your account is using a long, random password to stay secure
                                </p>
                            </div>

                            <UpdatePasswordForm className="profile-form" />
                        </div>

                        {/* Danger Zone */}
                        <div className="profile-card danger-zone" style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '32px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #fecaca'
                        }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#dc2626',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <i className="fas fa-exclamation-triangle" style={{
                                        marginRight: '12px',
                                        color: '#dc2626',
                                        fontSize: '24px'
                                    }}></i>
                                    Danger Zone
                                </h3>
                                <p style={{ color: '#dc2626', fontSize: '14px' }}>
                                    Once your account is deleted, all of its resources and data will be permanently deleted
                                </p>
                            </div>

                            <DeleteUserForm className="profile-form" />
                        </div>

                    </div>

                    {/* Quick Links */}
                    <div className="quick-links" style={{
                        backgroundColor: '#f3f4f6',
                        borderRadius: '12px',
                        padding: '24px',
                        marginTop: '32px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h4 style={{ marginBottom: '16px', color: '#374151', fontSize: '16px' }}>
                            <i className="fas fa-compass" style={{ marginRight: '8px', color: '#3b82f6' }}></i>
                            Quick Links
                        </h4>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <a href={route('settings')} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                color: '#374151',
                                fontSize: '14px',
                                transition: 'all 0.2s'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}>
                                <i className="fas fa-cog" style={{ marginRight: '8px', color: '#3b82f6' }}></i>
                                Settings
                            </a>
                            <a href={route('report.bug')} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                color: '#374151',
                                fontSize: '14px',
                                transition: 'all 0.2s'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.borderColor = '#10b981';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}>
                                <i className="fas fa-bug" style={{ marginRight: '8px', color: '#10b981' }}></i>
                                Report Bug
                            </a>
                            <a href={route('dashboard')} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                color: '#374151',
                                fontSize: '14px',
                                transition: 'all 0.2s'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.borderColor = '#6b7280';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}>
                                <i className="fas fa-arrow-left" style={{ marginRight: '8px', color: '#6b7280' }}></i>
                                Back to Dashboard
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div >
        </>
    );
}
