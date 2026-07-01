import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

import logoImage from '../../assets/img/identifyam_logo.png';
import defaultProfileImage from '../../assets/img/user_profile.png';

import retrieveNin from '../../assets/img/Retrieve_nin_slip.png';
import registerBusiness from '../../assets/img/register_business.png';
import studyAbroadImage from '../../assets/img/study_abroad.png';
import secureQuestionImage from '../../assets/img/secure_question.png';

// responsiveness for dashboard who ever will read this code
import "../../css/dashboardRes.css";
import {
    getRecentActivities,
    formatActivityDate,
    getActivityStatusClass,
    addActivity,
    activityTypes,
    setCurrentUserId,
    detectAndRecordAuthActivity,
    detectLogoutFromCookie,
} from '../utils/activityTracker';


export default function Dashboard({ auth }) {
        const { auth_activity } = usePage().props;
        const [recentActivities, setRecentActivities] = useState([]);
        const [loading, setLoading] = useState(true);
        const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

        // Function to speak text using Web Speech API
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1; // Normal speed
            utterance.pitch = 1; // Normal pitch
            utterance.volume = 1; // Full volume
            
            window.speechSynthesis.speak(utterance);
        } else {
            console.log('Speech synthesis not supported in this browser');
        }
    };

        // Set user scope and detect auth events on component mount
        useEffect(() => {
            // Scope activities to the logged-in user
            if (auth?.user?.id) {
                setCurrentUserId(auth.user.id);
            }

            // Detect logout from cookie (set during session destroy)
            detectLogoutFromCookie();

            // Detect login / account-switch from Inertia shared props
            if (auth_activity) {
                detectAndRecordAuthActivity(auth_activity);
            }

            // Load activities after detection
            loadRecentActivities();
        }, []);

        const loadRecentActivities = () => {
            try {
                // Get activities from local storage
                const activities = getRecentActivities(3);
                
                // Map activities to table format
                const mappedActivities = activities.map(activity => ({
                    service: activity.description,
                    date: formatActivityDate(activity.timestamp),
                    status: getActivityStatusClass(activity.status),
                    action: 'View Details'
                }));
                
                setRecentActivities(mappedActivities);
            } catch (error) {
                console.error('Failed to load recent activities:', error);
            } finally {
                setLoading(false);
            }
        };

        const getActivityStatus = (type) => {
            const statusMap = {
                'nin_verification': 'completed',
                'wallet_transaction': 'completed',
                'profile_update': 'completed',
                'password_change': 'completed',
                'email_verification': 'completed',
                'google_login': 'completed',
                'default': 'pending'
            };
            return statusMap[type] || statusMap['default'];
        };
    
        const handleLogout = (e) => {
            e.preventDefault();
            speak('Do you want to logout')
            if (confirm("Do you want to logout?")) {
                // Track logout activity
                addActivity(
                    activityTypes.LOGOUT,
                    'User logged out',
                    'completed',
                    { timestamp: new Date().toISOString() }
                );
                
                router.post(route('logout'));
                speak('logout Successfully!')
            }
        };

        // Activity tracking functions for different user actions
        const trackLagacyNinActivity = (details = {}) => {
            addActivity(
                activityTypes.LAGACY_NIN,
                'NIN verification completed',
                'completed',
                { ...details, timestamp: new Date().toISOString() }
            );
        };

        const trackWalletFundingActivity = (amount, reference, details = {}) => {
            addActivity(
                activityTypes.FUND_WALLET,
                `Wallet funded with ${amount}`,
                'completed',
                { amount, reference, ...details, timestamp: new Date().toISOString() }
            );
        };

        const trackScratchCardPurchase = (cardName, amount, details = {}) => {
            addActivity(
                activityTypes.BUY_SCRATCH_CARD,
                `Purchased ${cardName}`,
                'completed',
                { cardName, amount, ...details, timestamp: new Date().toISOString() }
            );
        };

        const trackBugReport = (title, category, details = {}) => {
            addActivity(
                activityTypes.REPORT_BUG,
                `Bug report: ${title}`,
                'completed',
                { title, category, ...details, timestamp: new Date().toISOString() }
            );
        };

        const trackProfileUpdate = (fields, details = {}) => {
            addActivity(
                activityTypes.UPDATE_PROFILE,
                'Profile information updated',
                'completed',
                { fields, ...details, timestamp: new Date().toISOString() }
            );
        };

        const trackPDFDownload = (documentType, reference, details = {}) => {
            addActivity(
                activityTypes.DOWNLOAD_PDF,
                `Downloaded ${documentType}`,
                'completed',
                { documentType, reference, ...details, timestamp: new Date().toISOString() }
            );
        };

        // Make functions globally available for other components to call
        if (typeof window !== 'undefined') {
            window.trackLagacyNinActivity = trackLagacyNinActivity;
            window.trackWalletFundingActivity = trackWalletFundingActivity;
            window.trackScratchCardPurchase = trackScratchCardPurchase;
            window.trackBugReport = trackBugReport;
            window.trackProfileUpdate = trackProfileUpdate;
            window.trackPDFDownload = trackPDFDownload;
        }

    return (
        <>
            <Head title="Dashboard" />

            <div className="dashboard-layout">

                {/* Mobile Menu Overlay */}
                <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

                {/* Sidebar */}
                <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <a href="/" className="sidebar-logo">
                        <div className="logo-image">
                            <img src={logoImage} alt="" />
                        </div>
                        <span>IDENTIFYAM</span>
                    </a>

                    <nav className="sidebar-menu">
                        <a className="active" href="dashboard" onClick={() => {
                            setMobileMenuOpen(false)
                            speak("still on Dashboard screen")
                        }}><i className="fas fa-home"></i>Dashboard</a>
                        <a href="lagacy-nin" onClick={() => {
                            setMobileMenuOpen(false)
                            speak("Navigating to Nin service screen")
                        }}><i className="fas fa-id-card"></i> NIN Services</a>
                        <a href="exam-cards" onClick={() => {
                            setMobileMenuOpen(false)
                            speak("Navigating to Exam card screen")
                        }}><i className="fas fa-credit-card"></i> Exam Cards</a>
                        {/* <a><i className="fas fa-building"></i> CAC Registration</a> */}
                        {/* <a><i className="fas fa-graduation-cap"></i> Study Abroad</a> */}
                        <a href={route("funding")} onClick={()  => {
                            setMobileMenuOpen(false)
                            speak("Navigating to funding screen")
                        }}><i className="fas fa-wallet"></i> Wallet</a>
                        <a href={route('history')} onClick={() => {
                            setMobileMenuOpen(false)
                            speak("Navigating to history screen")
                        }}><i className="fas fa-history"></i> History</a>
                        <a href={route('settings')} onClick={() => {
                            setMobileMenuOpen(false)
                            speak("Navigating to Settings screen")
                        }}><i className="fas fa-cog"></i> Settings</a>

                        <button onClick={(e) => { e.preventDefault(); handleLogout(e); }} style={{
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
                        <div className="topbar-left">
                            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                            </button>
                            <h3>Dashboard</h3>
                        </div>

                        <div className="topbar-right">
                            {/* <span className="notification"><i className="fas fa-bell"></i></span> */}
                            <div className="user-profile">
                                {/* <img src={defaultProfileImage} alt="avatar" /> */}
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
                                <p>Paystack</p>
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
                                        {/* <th>Action</th> */}
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : recentActivities.length > 0 ? (
                                        recentActivities.map((activity, index) => (
                                            <tr key={index}>
                                                <td data-label="Service">{activity.service}</td>
                                                <td data-label="Date">{activity.date}</td>
                                                <td data-label="Status">
                                                    <span className={`badge ${activity.status}`}>
                                                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                                    </span>
                                                </td>
                                                {/* <td data-label="Action">{activity.action}</td> */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                                No recent activities found
                                            </td>
                                        </tr>
                                    )}
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