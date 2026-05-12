import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';

const AdminUsers = ({ users, securityStats }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users.data || []);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSecurityModal, setShowSecurityModal] = useState(false);

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

    const showUserSecurityDetails = (user) => {
        setSelectedUser(user);
        setShowSecurityModal(true);
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
            </div>

            <style>{`
                .admin-page {
                    padding: 20px;
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
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f3f4f6;
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

                @media (max-width: 768px) {
                    .security-overview {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    }
                    
                    .security-summary {
                        grid-template-columns: 1fr;
                    }
                    
                    .security-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminUsers;
