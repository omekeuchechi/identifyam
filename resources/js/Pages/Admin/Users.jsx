import React, { useState, useEffect } from 'react';
import { usePage, Head, Link, router } from '@inertiajs/react';

const AdminUsers = ({ auth, users, securityStats }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users.data || []);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (users?.data) {
            setFilteredUsers(users.data);
        }
    }, [users]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = users.data.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_login_ip?.includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users.data || []);
        }
    }, [searchTerm, users]);

    const getSecurityLevel = (user) => {
        if (user.suspicious_activities > 5) return { level: 'critical', color: '#dc2626', icon: '🚨' };
        if (user.suspicious_activities > 2) return { level: 'high', color: '#f59e0b', icon: '⚠️' };
        if (user.suspicious_activities > 0) return { level: 'medium', color: '#3b82f6', icon: '⚡' };
        return { level: 'safe', color: '#10b981', icon: '✅' };
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return '#dc2626';
            case 'high': return '#f59e0b';
            case 'medium': return '#3b82f6';
            default: return '#10b981';
        }
    };

    const showUserSecurityDetails = (user) => {
        setSelectedUser(user);
        setShowSecurityModal(true);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
            router.post(route('logout'));
        }
    };

    const logCurrentIP = () => {
        fetch(route('admin.log-ip'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(`IP logged: ${data.ip}`);
                window.location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error logging IP:', error);
            alert('Failed to log IP. Please check console for details.');
        });
    };

    return (
        <>
            <Head title="Manage Users - Admin" />

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
                        <Link href="/admin/users" className="sidebar-link active" onClick={() => setIsSidebarOpen(false)}>
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
                            <h3>Manage Users</h3>
                        </div>

                        <div className="topbar-right">
                            <div className="user-profile">
                                <span>{auth?.user?.name}</span>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="dashboard-content">
                        <div className="admin-page">
                            <div className="admin-header">
                                <h2>Manage Users</h2>
                                <div className="admin-actions">
                                    <input
                                        type="text"
                                        placeholder="Search users, IPs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                    <Link href={route('admin.security')} className="btn btn-security">
                                        <i className="fas fa-shield-alt"></i> Security Monitor
                                    </Link>
                                    <button className="btn btn-info" onClick={logCurrentIP}>
                                        <i className="fas fa-map-marker-alt"></i> Log Current IP
                                    </button>
                                    <Link href={route('admin.users', {}, false)} className="btn btn-primary">
                                        <i className="fas fa-refresh"></i> Refresh
                                    </Link>
                                </div>
                            </div>

                            {/* Security Stats Overview */}
                            <div className="security-overview">
                                <div className="stat-card">
                                    <div className="stat-icon security">
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h3>{securityStats?.totalSecurityLogs || 0}</h3>
                                        <p>Total Security Logs</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon high-risk">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h3>{securityStats?.highSeverityLogs || 0}</h3>
                                        <p>High Severity Alerts</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon critical">
                                        <i className="fas fa-bomb"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h3>{securityStats?.criticalSeverityLogs || 0}</h3>
                                        <p>Critical Alerts</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon today">
                                        <i className="fas fa-calendar-day"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h3>{securityStats?.todayLogs || 0}</h3>
                                        <p>Today's Activities</p>
                                    </div>
                                </div>
                            </div>

                            <div className="users-table-container">
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Wallet</th>
                                                <th>IP Address</th>
                                                <th>Security</th>
                                                <th>Last Login</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => {
                                                const security = getSecurityLevel(user);
                                                return (
                                                    <tr key={user.id} className={security.level !== 'safe' ? 'suspicious-row' : ''}>
                                                        <td>{user.id}</td>
                                                        <td>
                                                            <div className="user-info">
                                                                <span className="user-name">{user.name}</span>
                                                                {user.suspicious_activities > 0 && (
                                                                    <span className="suspicious-badge" title={`${user.suspicious_activities} suspicious activities`}>
                                                                        ⚠️
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            <span className={user.isAdmin ? 'role-badge admin' : 'role-badge user'}>
                                                                {user.isAdmin ? 'Admin' : 'User'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="wallet-info">
                                                                <span className="wallet-amount">₦{user.walletAmount?.toLocaleString() || 0}</span>
                                                                {user.walletAmount > 50000 && (
                                                                    <span className="high-wallet" title="High wallet balance">
                                                                        💰
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="ip-info">
                                                                <span className="ip-address">{user.last_login_ip || 'Unknown'}</span>
                                                                {user.last_login_ip && (
                                                                    <button 
                                                                        className="btn-locate" 
                                                                        onClick={() => window.open(`https://www.ipinfo.io/${user.last_login_ip}`, '_blank')}
                                                                        title="Locate IP"
                                                                    >
                                                                        📍
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="security-indicator">
                                                                <span 
                                                                    className="security-badge" 
                                                                    style={{ backgroundColor: security.color }}
                                                                    title={`Security Level: ${security.level}`}
                                                                >
                                                                    {security.icon} {security.level.toUpperCase()}
                                                                </span>
                                                                <div className="security-count">
                                                                    {user.suspicious_activities} alerts
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="login-info">
                                                                <span>{user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}</span>
                                                                {user.last_login_at && (
                                                                    <span className="login-time">
                                                                        {new Date(user.last_login_at).toLocaleTimeString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button 
                                                                    className="btn btn-sm btn-security"
                                                                    onClick={() => showUserSecurityDetails(user)}
                                                                    title="View Security Details"
                                                                >
                                                                    <i className="fas fa-shield-alt"></i>
                                                                </button>
                                                                <button className="btn btn-sm btn-secondary" title="Edit User">
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button className="btn btn-sm btn-danger" title="Delete User">
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {users?.links && (
                                    <div className="pagination">
                                        {users.links.map((link, index) => (
                                            <Link 
                                                key={index}
                                                href={link.url || '#'}
                                                className={link.active ? 'pagination-link active' : 'pagination-link'}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Details Modal */}
            {showSecurityModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowSecurityModal(false)}>
                    <div className="modal-content security-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Security Details - {selectedUser.name}</h3>
                            <button className="modal-close" onClick={() => setShowSecurityModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="security-summary">
                                <div className="summary-item">
                                    <label>Security Level:</label>
                                    <span className={`security-level ${getSecurityLevel(selectedUser).level}`}>
                                        {getSecurityLevel(selectedUser).icon} {getSecurityLevel(selectedUser).level.toUpperCase()}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <label>Suspicious Activities:</label>
                                    <span className="alert-count">{selectedUser.suspicious_activities}</span>
                                </div>
                                <div className="summary-item">
                                    <label>Last Login IP:</label>
                                    <span className="ip-address">{selectedUser.last_login_ip || 'Unknown'}</span>
                                </div>
                                <div className="summary-item">
                                    <label>Wallet Balance:</label>
                                    <span className="wallet-balance">₦{selectedUser.walletAmount?.toLocaleString() || 0}</span>
                                </div>
                            </div>

                            <div className="recent-logs">
                                <h4>Recent Security Logs</h4>
                                {selectedUser.recent_security_logs && selectedUser.recent_security_logs.length > 0 ? (
                                    <div className="logs-list">
                                        {selectedUser.recent_security_logs.map((log) => (
                                            <div key={log.id} className="log-item">
                                                <div className="log-header">
                                                    <span className="log-type">{log.activity_type || 'General Activity'}</span>
                                                    <span className="log-time">{new Date(log.created_at).toLocaleString()}</span>
                                                </div>
                                                <div className="log-details">
                                                    <span className="log-ip">IP: {log.ip_address}</span>
                                                    <span className="log-severity" style={{ color: getSeverityColor(log.severity) }}>
                                                        {log.severity?.toUpperCase()}
                                                    </span>
                                                </div>
                                                {log.location && (
                                                    <div className="log-location">
                                                        📍 {log.location.city}, {log.location.country}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-logs">No recent security logs found</p>
                                )}
                            </div>

                            <div className="security-actions">
                                <button className="btn btn-danger">
                                    <i className="fas fa-ban"></i> Block User
                                </button>
                                <button className="btn btn-warning">
                                    <i className="fas fa-exclamation-triangle"></i> Flag for Review
                                </button>
                                <button className="btn btn-secondary">
                                    <i className="fas fa-envelope"></i> Send Warning
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

                .admin-page {
                    padding: 0;
                }

                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .admin-header h2 {
                    margin: 0;
                    color: #1f2937;
                }

                .admin-actions {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    text-decoration: none;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }

                .btn-primary {
                    background: #10b981;
                }

                .btn-security {
                    background: #3b82f6;
                }

                .btn-info {
                    background: #0ea5e9;
                }

                .btn-warning {
                    background: #f59e0b;
                }

                .btn-danger {
                    background: #dc2626;
                }

                .btn-secondary {
                    background: #6b7280;
                }

                .search-input {
                    padding: 10px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    width: 300px;
                    color: #374151;
                }

                .search-input:focus {
                    border-color: #10b981;
                    outline: none;
                }

                .security-overview {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }

                .stat-icon.security { background: #3b82f6; }
                .stat-icon.high-risk { background: #f59e0b; }
                .stat-icon.critical { background: #dc2626; }
                .stat-icon.today { background: #10b981; }

                .stat-content h3 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .stat-content p {
                    margin: 5px 0 0 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .users-table-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .table-responsive {
                    overflow-x: auto;
                    width: 100%;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th {
                    background: #f8fafc;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 2px solid #e5e7eb;
                    white-space: nowrap;
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f3f4f6;
                    white-space: nowrap;
                }

                .admin-table tr:hover {
                    background: #f9fafb;
                }

                .suspicious-row {
                    background: #fef2f2 !important;
                }

                .suspicious-row:hover {
                    background: #fecaca !important;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .suspicious-badge {
                    background: #f59e0b;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                }

                .wallet-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .wallet-amount {
                    font-weight: 600;
                    color: #10b981;
                }

                .high-wallet {
                    font-size: 16px;
                }

                .ip-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .ip-address {
                    font-family: monospace;
                    font-size: 12px;
                    color: #6b7280;
                }

                .btn-locate {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 12px;
                }

                .security-indicator {
                    text-align: center;
                }

                .security-badge {
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    display: inline-block;
                    margin-bottom: 4px;
                }

                .security-count {
                    font-size: 11px;
                    color: #6b7280;
                }

                .login-info {
                    display: flex;
                    flex-direction: column;
                }

                .login-time {
                    font-size: 11px;
                    color: #6b7280;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .btn-sm {
                    padding: 6px 12px;
                    font-size: 12px;
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

                .security-modal {
                    max-width: 800px;
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

                .security-summary {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin-bottom: 30px;
                }

                .summary-item {
                    display: flex;
                    flex-direction: column;
                }

                .summary-item label {
                    font-weight: 600;
                    color: #6b7280;
                    margin-bottom: 5px;
                }

                .security-level {
                    padding: 6px 12px;
                    border-radius: 15px;
                    color: white;
                    font-weight: 600;
                    text-align: center;
                }

                .security-level.safe { background: #10b981; }
                .security-level.medium { background: #3b82f6; }
                .security-level.high { background: #f59e0b; }
                .security-level.critical { background: #dc2626; }

                .alert-count {
                    font-size: 18px;
                    font-weight: 700;
                    color: #f59e0b;
                }

                .wallet-balance {
                    font-size: 18px;
                    font-weight: 700;
                    color: #10b981;
                }

                .recent-logs h4 {
                    margin-bottom: 15px;
                    color: #1f2937;
                }

                .logs-list {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .log-item {
                    background: #f8fafc;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                }

                .log-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
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
                    margin-bottom: 8px;
                }

                .log-location {
                    font-size: 12px;
                    color: #6b7280;
                }

                .no-logs {
                    text-align: center;
                    color: #6b7280;
                    padding: 20px;
                }

                .security-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    justify-content: center;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }

                .pagination-link {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    text-decoration: none;
                    color: #374151;
                }

                .pagination-link.active {
                    background: #10b981;
                    color: white;
                }

                .pagination-link:hover {
                    background: #f3f4f6;
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

                    .admin-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 15px !important;
                        padding: 15px !important;
                    }

                    .admin-actions {
                        width: 100% !important;
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 10px !important;
                    }

                    .search-input {
                        width: 100% !important;
                    }

                    .btn {
                        width: 100% !important;
                        justify-content: center !important;
                    }

                    .security-overview {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
                        gap: 10px !important;
                    }

                    .stat-card {
                        padding: 15px !important;
                    }

                    .action-buttons {
                        flex-direction: column !important;
                        gap: 4px !important;
                    }

                    .security-summary {
                        grid-template-columns: 1fr !important;
                    }

                    .security-actions {
                        flex-direction: column !important;
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

export default AdminUsers;
