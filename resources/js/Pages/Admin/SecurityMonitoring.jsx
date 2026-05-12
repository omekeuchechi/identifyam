import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';

const SecurityMonitoring = ({ auth }) => {
    const { props } = usePage();
    const [securityLogs, setSecurityLogs] = useState([]);
    const [stats, setStats] = useState({
        totalLogs: 0,
        highSeverity: 0,
        criticalSeverity: 0,
        todayLogs: 0,
        activeUsers: 0,
        suspiciousIPs: 0
    });
    const [loading, setLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        fetchSecurityData();
    }, []);

    const fetchSecurityData = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('admin.security-monitoring'), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSecurityLogs(data.logs);
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch security data:', err);
        } finally {
            setLoading(false);
        }
    };

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        if (showLogoutConfirm) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = route('logout');

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
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-image"></div>
                        <span>IDENTIFYAM</span>
                    </div>

                    <nav className="sidebar-menu">
                        <Link href={route('admin.dashboard')} className="sidebar-link">
                            <i className="fas fa-tachometer-alt"></i>Dashboard
                        </Link>
                        <Link href={route('admin.users')} className="sidebar-link">
                            <i className="fas fa-users"></i>Manage Users
                        </Link>
                        <Link href={route('admin.security-monitoring')} className="sidebar-link active">
                            <i className="fas fa-shield-alt"></i>Security Monitor
                        </Link>
                        <Link href="/admin/nin-profit" className="sidebar-link">
                            <i className="fas fa-chart-line"></i> NIN Profit
                        </Link>

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
                        <h3>Security Monitoring Center</h3>

                        <div className="topbar-right">
                            <span className="notification"><i className="fas fa-bell"></i></span>
                            <div className="user-profile">
                                <img src="/assets/img/user_profile.png" alt="avatar" />
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
                                                <span style={{ fontSize: '12px' }}>{selectedLog.user_agent}</span>
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

                .notification {
                    font-size: 20px;
                    color: #6b7280;
                    cursor: pointer;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-profile img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
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

                @media (max-width: 768px) {
                    .sidebar {
                        width: 250px;
                    }
                    
                    .dashboard-main {
                        margin-left: 250px;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
                    
                    .detail-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    );
};

export default SecurityMonitoring;
