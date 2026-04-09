import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import logoImage from '../../assets/svg/shield.svg';
import defaultProfileImage from '../../assets/img/user_profile.png';

const Settings = ({ auth }) => {
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
            <Head title="Settings" />

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
                        <a href={route('settings')} className="active"><i className="fas fa-cog"></i> Settings</a>
                    </nav>
                </aside>

                {/* Main Area */}
                <div className="dashboard-main">
                    {/* Topbar */}
                    <header className="topbar">
                    <h2>Settings</h2>

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
                            <h1>Settings</h1>
                            <p>
                                Manage your account settings and preferences
                            </p>
                        </div>

                        {/* Settings Grid */}
                        <div className="settings-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '24px',
                            marginTop: '32px'
                        }}>
                            
                            {/* Profile Settings */}
                            <div className="settings-section" style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}>
                                <h3 style={{ marginBottom: '20px', color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                                    <i className="fas fa-user-cog" style={{ marginRight: '8px', color: '#3b82f6' }}></i>
                                    Account Settings
                                </h3>
                                
                                <div className="settings-cards">
                                    <Link href={route('profile.edit')} className="settings-card" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: '#374151',
                                        transition: 'all 0.2s',
                                        marginBottom: '12px'
                                    }} 
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f9fafb';
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}>
                                        <i className="fas fa-user-edit" style={{ 
                                            fontSize: '20px', 
                                            marginRight: '16px', 
                                            color: '#3b82f6',
                                            width: '24px',
                                            textAlign: 'center'
                                        }}></i>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Change Profile Details</div>
                                            <div style={{ fontSize: '14px', color: '#6b7280' }}>Update your personal information</div>
                                        </div>
                                        <i className="fas fa-chevron-right" style={{ 
                                            marginLeft: 'auto', 
                                            color: '#9ca3af',
                                            fontSize: '14px'
                                        }}></i>
                                    </Link>
                                </div>
                            </div>

                            {/* Support Settings */}
                            <div className="settings-section" style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}>
                                <h3 style={{ marginBottom: '20px', color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                                    <i className="fas fa-life-ring" style={{ marginRight: '8px', color: '#10b981' }}></i>
                                    Support
                                </h3>
                                
                                <div className="settings-cards">
                                    <Link href={route('report.bug')} className="settings-card" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: '#374151',
                                        transition: 'all 0.2s',
                                        marginBottom: '12px'
                                    }} 
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f9fafb';
                                        e.currentTarget.style.borderColor = '#10b981';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}>
                                        <i className="fas fa-bug" style={{ 
                                            fontSize: '20px', 
                                            marginRight: '16px', 
                                            color: '#10b981',
                                            width: '24px',
                                            textAlign: 'center'
                                        }}></i>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Report Bug</div>
                                            <div style={{ fontSize: '14px', color: '#6b7280' }}>Help us improve by reporting issues</div>
                                        </div>
                                        <i className="fas fa-chevron-right" style={{ 
                                            marginLeft: 'auto', 
                                            color: '#9ca3af',
                                            fontSize: '14px'
                                        }}></i>
                                    </Link>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="settings-section" style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #fecaca'
                            }}>
                                <h3 style={{ marginBottom: '20px', color: '#dc2626', fontSize: '18px', fontWeight: '600' }}>
                                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px', color: '#dc2626' }}></i>
                                    Danger Zone
                                </h3>
                                
                                <div className="settings-cards">
                                    <button
                                        onClick={handleLogout}
                                        className="settings-card logout-card" 
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '16px',
                                            border: showLogoutConfirm ? '2px solid #dc2626' : '1px solid #fecaca',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            color: showLogoutConfirm ? '#dc2626' : '#374151',
                                            transition: 'all 0.2s',
                                            backgroundColor: showLogoutConfirm ? '#fef2f2' : 'white',
                                            cursor: 'pointer',
                                            width: '100%',
                                            textAlign: 'left'
                                        }} 
                                        onMouseOver={(e) => {
                                            if (!showLogoutConfirm) {
                                                e.currentTarget.style.backgroundColor = '#fef2f2';
                                                e.currentTarget.style.borderColor = '#dc2626';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!showLogoutConfirm) {
                                                e.currentTarget.style.backgroundColor = 'white';
                                                e.currentTarget.style.borderColor = '#fecaca';
                                            }
                                        }}>
                                        <i className="fas fa-sign-out-alt" style={{ 
                                            fontSize: '20px', 
                                            marginRight: '16px', 
                                            color: showLogoutConfirm ? '#dc2626' : '#ef4444',
                                            width: '24px',
                                            textAlign: 'center'
                                        }}></i>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {showLogoutConfirm ? 'Click again to confirm logout' : 'Log Out'}
                                            </div>
                                            <div style={{ fontSize: '14px', color: showLogoutConfirm ? '#dc2626' : '#6b7280' }}>
                                                {showLogoutConfirm ? 'This action will end your session' : 'Sign out of your account'}
                                            </div>
                                        </div>
                                        <i className="fas fa-chevron-right" style={{ 
                                            marginLeft: 'auto', 
                                            color: showLogoutConfirm ? '#dc2626' : '#ef4444',
                                            fontSize: '14px'
                                        }}></i>
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Additional Info */}
                        <div className="info-section" style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: '12px',
                            padding: '24px',
                            marginTop: '32px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h4 style={{ marginBottom: '12px', color: '#374151', fontSize: '16px' }}>
                                <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#3b82f6' }}></i>
                                Account Information
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Email:</span>
                                    <div style={{ fontWeight: '500', color: '#374151' }}>{auth.user.email}</div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Name:</span>
                                    <div style={{ fontWeight: '500', color: '#374151' }}>{auth.user.name}</div>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Member Since:</span>
                                    <div style={{ fontWeight: '500', color: '#374151' }}>
                                        {new Date(auth.user.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;