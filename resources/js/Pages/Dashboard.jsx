import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

import logoImage from '../../assets/svg/shield.svg';
import defaultProfileImage from '../../assets/img/user_profile.png';

import retrieveNin from '../../assets/img/Retrieve_nin_slip.png';
import registerBusiness from '../../assets/img/register_business.png';
import studyAbroadImage from '../../assets/img/study_abroad.png';
import secureQuestionImage from '../../assets/img/secure_question.png';


export default function Dashboard({ auth }) {
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
                const logoutConfirm = confirm("Do you want to logout");
                
                if (logoutConfirm) {
                    form.submit();
                }

            } else {
                setShowLogoutConfirm(true);
                setTimeout(() => setShowLogoutConfirm(false), 3000);
            }
        };

    return (
        <>
            <Head title="Dashboard" />

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
                        <a className="active" href="dashboard"><i className="fas fa-home"></i>Dashboard</a>
                        <a href="lagacy-nin"><i className="fas fa-id-card"></i> NIN Services</a>
                        <a href="exam-cards"><i className="fas fa-credit-card"></i> Exam Cards</a>
                        <a><i className="fas fa-building"></i> CAC Registration</a>
                        <a><i className="fas fa-graduation-cap"></i> Study Abroad</a>
                        <a><i className="fas fa-wallet"></i> Wallet</a>
                        <a href={route('history')}><i className="fas fa-history"></i> History</a>
                        <a href={route('settings')}><i className="fas fa-cog"></i> Settings</a>

                        <button onClick={handleLogout} style={{
                            padding: '15px 20px',
                            backgroundColor: 'red',
                            color: '#fff',
                            fontSize: '15px',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer'
                         }}><i className='fas fa-sign-out'></i> Logout</button>

                    </nav>
                </aside>

                {/* Main Area */}
                <div className="dashboard-main">

                    {/* Topbar */}
                    <header className="topbar">
                        <h3>Dashboard</h3>

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
                            <h1>Welcome back, {auth.user.name}</h1>
                            <p>
                                Manage your identity services and applications
                                from your secure dashboard
                            </p>
                        </div>

                        {/* Wallet Card */}
                        <div className="wallet-card">
                            <div>
                                <h4>Wallet Balance</h4>
                                <p>Account: 2087654321 | GTBank</p>
                                <h2>{auth.user.walletAmount || 0}</h2>
                            </div>

                            <button className="add-funds">
                                <Link href={route('funding')} style={{ color: 'white', textDecoration: 'none' }}>
                                    + Add Funds
                                </Link>
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <h3 className="section-title">Quick Actions</h3>

                        <div className="quick-actions">
                            <div className="qa-card">
                                <div className="icon green">
                                    <img src={retrieveNin} alt="" />
                                </div>
                                <h4>Retrieve NIN Slip</h4>
                                <p>Get your National Identity Number slip instantly</p>
                            </div>

                            <div className="qa-card">
                                <div className="icon blue">
                                    <img src={registerBusiness} alt="" />
                                </div>
                                <h4>Register a Business</h4>
                                <p>Start your CAC business registration process</p>
                            </div>

                            <div className="qa-card">
                                <div className="icon purple">
                                    <img src={studyAbroadImage} alt="" />
                                </div>
                                <h4>Study Abroad Support</h4>
                                <p>Apply for education travel assistance</p>
                            </div>
                        </div>

                        {/* Application Summary */}
                        <h3 className="section-title">Application Summary</h3>

                        {/* Recent Applications */}
                        <div className="recent-app">
                            <h3>Recent Applications</h3>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>NIN Slip Retrieval</td>
                                        <td>Jan 15, 2024</td>
                                        <td>
                                            <span className="badge completed">
                                                Completed
                                            </span>
                                        </td>
                                        <td>View Details</td>
                                    </tr>

                                    <tr>
                                        <td>CAC Registration</td>
                                        <td>Jan 12, 2024</td>
                                        <td>
                                            <span className="badge processing">
                                                Processing
                                            </span>
                                        </td>
                                        <td>View Details</td>
                                    </tr>

                                    <tr>
                                        <td>Study Abroad Support</td>
                                        <td>Jan 10, 2024</td>
                                        <td>
                                            <span className="badge pending">
                                                Pending
                                            </span>
                                        </td>
                                        <td>View Details</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Security Notice */}
                        <div className="security">
                            <img src={secureQuestionImage} alt="" />
                            <div className="security-side">
                            <strong>Your Data is Secure</strong>
                            <p>
                                All your information is encrypted and protected
                                with bank-level security standards
                            </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}