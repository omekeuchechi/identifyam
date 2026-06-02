import React, { useState, useEffect } from 'react';
import { usePage, Head, Link, router } from '@inertiajs/react';

const SecurityMonitoring = ({ auth, initialLogs, initialStats }) => {
    const [securityLogs, setSecurityLogs] = useState(initialLogs || []);
    const [stats, setStats] = useState(initialStats || {
        totalLogs: 0,
        highSeverity: 0,
        criticalSeverity: 0,
        todayLogs: 0,
        activeUsers: 0,
        suspiciousIPs: 0
    });
    const [loading, setLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // No need to fetch on mount as data is provided via props
    useEffect(() => {
        if (initialLogs) setSecurityLogs(initialLogs);
        if (initialStats) setStats(initialStats);
    }, [initialLogs, initialStats]);

    const handleLogout = (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
            router.post(route('logout'));
        }
    };

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'critical': return '#dc3545';
            case 'high': return '#fd7e14';
            case 'medium': return '#ffc107';
            default: return '#28a745';
        }
    };

    const getSeverityIcon = (severity) => {
        switch(severity) {
            case 'critical': return '🚨';
            case 'high': return '⚠️';
            case 'medium': return '⚡';
            default: return '✅';
        }
    };

    return (
        <>
            <Head title="Security Monitoring" />

            <div className="dashboard-layout">
                {/* Sidebar Overlay for Mobile */}
                {isSidebarOpen && (
                    <div 
                        className="sidebar-overlay" 
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-logo">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="logo-image">
                            </div>
                            <span>IDENTIFYAM</span>
                        </div>
                        <button 
                            className="sidebar-close-btn"
                            onClick={() => setIsSidebarOpen(false)}
                            aria-label="Close sidebar"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <nav className="sidebar-menu">
                        <Link href={route('admin.dashboard')} className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-tachometer-alt"></i>Dashboard
                        </Link>
                        <Link href="lagacy-nin" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-history"></i> Lagacy NIN
                        </Link>
                        <Link href={route('exam.cards')} className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-credit-card"></i> Exam Cards
                        </Link>
                        <Link href="/admin/users" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-credit-card"></i> Manage Users
                        </Link>
                        <Link href="/admin/nin-requests" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-search"></i> NIN Requests
                        </Link>
                        <Link href="/admin/send-email" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-envelope"></i> Send Email
                        </Link>
                        <Link href="history" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-history"></i>History
                        </Link>
                        <Link href="profile" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-user-edit"></i>Profile Edit
                        </Link>
                        <Link href={route('admin.nin-profit')} className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-chart-line"></i> NIN Profit
                        </Link>
                        <Link href={route('admin.exam-profit')} className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-chart-pie"></i> Exam Profit
                        </Link>

                        <button onClick={handleLogout} style={{
                            padding: '15px 20px',
                            backgroundColor: 'red',
                            color: '#fff',
                            fontSize: '15px',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            marginTop: '15px'
                        }}><i className='fas fa-sign-out'></i> Logout</button>

                    </nav>
                </aside>

                {/* Main Area */}
                <div className="dashboard-main">
                    {/* Topbar */}
                    <header className="topbar">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button 
                                className="sidebar-toggle-btn"
                                onClick={() => setIsSidebarOpen(true)}
                                aria-label="Toggle sidebar"
                            >
                                <i className="fas fa-bars"></i>
                            </button>
                            <h3>Security Monitoring Center</h3>
                        </div>

                        <div className="topbar-right">
                            <div className="user-profile">
                                <span>{auth.user?.name}</span>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="dashboard-content">
                        {/* Security Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' }}>
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>High Severity Alerts</h4>
                                    <span className="stat-number">{loading ? '...' : stats.highSeverity}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #721c24 100%)' }}>
                                    <i className="fas fa-bomb"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Critical Alerts</h4>
                                    <span className="stat-number">{loading ? '...' : stats.criticalSeverity}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)' }}>
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Today's Logs</h4>
                                    <span className="stat-number">{loading ? '...' : stats.todayLogs}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)' }}>
                                    <i className="fas fa-network-wired"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Suspicious IPs</h4>
                                    <span className="stat-number">{loading ? '...' : stats.suspiciousIPs}</span>
                                </div>
                            </div>
                        </div>

                        {/* Live Security Feed */}
                        <div className="admin-actions">
                            <h3>Live Security Feed</h3>
                            <div className="security-feed">
                                {securityLogs.slice(0, 20).map((log) => (
                                    <div key={log.id} className="security-log-item" onClick={() => setSelectedLog(log)}>
                                        <div className="log-severity" style={{ backgroundColor: getSeverityColor(log.severity) }}>
                                            {getSeverityIcon(log.severity)}
                                        </div>
                                        <div className="log-content">
                                            <div className="log-header">
                                                <span className="log-type">{log.activity_type || 'General Activity'}</span>
                                                <span className="log-time">{new Date(log.created_at).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="log-details">
                                                <span className="log-user">{log.user?.name || 'Unknown User'}</span>
                                                <span className="log-ip">IP: {log.ip_address}</span>
                                                {log.location && (
                                                    <span className="log-location">
                                                        📍 {log.location.city}, {log.location.country}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Log Modal */}
                        {selectedLog && (
                            <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h3>Security Log Details</h3>
                                        <button className="modal-close" onClick={() => setSelectedLog(null)}>×</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>User:</label>
                                                <span>{selectedLog.user?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Email:</label>
                                                <span>{selectedLog.user?.email || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>IP Address:</label>
                                                <span>{selectedLog.ip_address}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Activity Type:</label>
                                                <span>{selectedLog.activity_type || 'General'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Severity:</label>
                                                <span style={{ color: getSeverityColor(selectedLog.severity) }}>
                                                    {selectedLog.severity?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Timestamp:</label>
                                                <span>{new Date(selectedLog.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>User Agent:</label>
                                                <span style={{ fontSize: '12px', wordBreak: 'break-all' }}>{selectedLog.user_agent}</span>
                                            </div>
                                            {selectedLog.location && (
                                                <div className="detail-item">
                                                    <label>Location:</label>
                                                    <span>
                                                        {selectedLog.location.city}, {selectedLog.location.country}
                                                        ({selectedLog.location.isp})
                                                    </span>
                                                </div>
                                            )}
                                            {selectedLog.details && (
                                                <div className="detail-item full-width">
                                                    <label>Additional Details:</label>
                                                    <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f8f9fa;
                }

                .sidebar {
                    width: 280px;
                    background: white;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                    position: fixed;
                    height: 100vh;
                    left: 0;
                    top: 0;
                    z-index: 1000;
                }

                .sidebar-logo {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .sidebar-menu {
                    padding: 20px 0;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px 20px;
                    color: #6b7280;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .sidebar-link:hover,
                .sidebar-link.active {
                    background: #f3f4f6;
                    color: #059669;
                }

                .dashboard-main {
                    flex: 1;
                    margin-left: 280px;
                }

                .topbar {
                    background: white;
                    padding: 20px 30px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .topbar h3 {
                    color: #1f2937;
                    margin: 0;
                }

                .topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-profile span {
                    font-weight: 500;
                    color: #374151;
                }

                .dashboard-content {
                    padding: 30px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: transform 0.2s ease;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                }

                .stat-info h4 {
                    margin: 0 0 5px 0;
                    color: #6b7280;
                    font-size: 14px;
                    font-weight: 500;
                }

                .stat-number {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .admin-actions {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    margin-bottom: 25px;
                }

                .admin-actions h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 20px;
                }

                .security-feed {
                    max-height: 500px;
                    overflow-y: auto;
                }

                .security-log-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 15px;
                    border-bottom: 1px solid #e5e7eb;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .security-log-item:hover {
                    background: #f9fafb;
                }

                .log-severity {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    flex-shrink: 0;
                }

                .log-content {
                    flex: 1;
                }

                .log-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }

                .log-type {
                    font-weight: 600;
                    color: #1f2937;
                }

                .log-time {
                    font-size: 12px;
                    color: #6b7280;
                }

                .log-details {
                    display: flex;
                    gap: 15px;
                    font-size: 14px;
                    color: #6b7280;
                }

                .log-user {
                    font-weight: 500;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    margin: 20px;
                    width: 100%;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                }

                .modal-body {
                    padding: 20px;
                }

                .detail-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                }

                .detail-item.full-width {
                    grid-column: span 2;
                }

                .detail-item label {
                    font-weight: 600;
                    color: #6b7280;
                    margin-bottom: 5px;
                }

                .detail-item pre {
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 12px;
                    overflow-x: auto;
                }

                .sidebar-close-btn {
                    display: none !important;
                }

                /* Responsive Design */
                @media (max-width: 991px) {
                    .dashboard-layout {
                        flex-direction: column !important;
                    }

                    .sidebar {
                        position: fixed !important;
                        top: 0 !important;
                        left: -290px !important;
                        width: 280px !important;
                        height: 100vh !important;
                        z-index: 1000 !important;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1) !important;
                        overflow-y: auto !important;
                        display: block !important;
                    }

                    .sidebar.open {
                        left: 0 !important;
                    }

                    .sidebar-logo {
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        width: 100% !important;
                    }

                    .sidebar-close-btn {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        background: transparent !important;
                        border: none !important;
                        font-size: 20px !important;
                        color: #ef4444 !important;
                        cursor: pointer !important;
                        padding: 4px !important;
                    }

                    .sidebar-menu {
                        position: static !important;
                        width: 100% !important;
                        padding-bottom: 30px !important;
                    }

                    .sidebar-toggle-btn {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        background: transparent !important;
                        border: none !important;
                        font-size: 20px !important;
                        color: #374151 !important;
                        cursor: pointer !important;
                        padding: 8px !important;
                        margin-right: 15px !important;
                        border-radius: 6px !important;
                        transition: background-color 0.2s !important;
                    }

                    .sidebar-toggle-btn:hover {
                        background-color: #f3f4f6 !important;
                    }

                    .sidebar-overlay {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        background: rgba(0, 0, 0, 0.4) !important;
                        z-index: 999 !important;
                        backdrop-filter: blur(2px) !important;
                    }

                    .dashboard-main {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }

                    .topbar {
                        padding: 15px 20px !important;
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 100 !important;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
                    }

                    .topbar h3 {
                        font-size: 18px !important;
                    }

                    .dashboard-content {
                        padding: 20px 15px !important;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
                        gap: 12px !important;
                    }

                    .stat-card {
                        padding: 15px !important;
                    }

                    .log-details {
                        flex-direction: column !important;
                        gap: 4px !important;
                    }

                    .detail-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .detail-item.full-width {
                        grid-column: span 1 !important;
                    }
                }

                @media (min-width: 992px) {
                    .sidebar-toggle-btn {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
};

export default SecurityMonitoring;
