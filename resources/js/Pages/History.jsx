import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';

const History = ({ auth }) => {
    const { props } = usePage();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [clearingCache, setClearingCache] = useState(false);

    useEffect(() => {
        fetchUserHistory();
    }, []);

    const fetchUserHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('user.history'), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            if (response.ok) {
                const data = await response.json();
                setActivities(data.activities || []);
            }
        } catch (err) {
            console.error('Failed to fetch user history:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearCache = async (cacheType = 'all') => {
        try {
            setClearingCache(true);
            const response = await fetch(route('cache.clear'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({ type: cacheType })
            });

            if (response.ok) {
                // Refresh history after cache clear
                await fetchUserHistory();
            }
        } catch (err) {
            console.error('Failed to clear cache:', err);
        } finally {
            setClearingCache(false);
        }
    };

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            activity.action?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || activity.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const getActivityIcon = (action) => {
        const iconMap = {
            'login': 'fas fa-sign-in-alt',
            'logout': 'fas fa-sign-out-alt',
            'profile_update': 'fas fa-user-edit',
            'password_change': 'fas fa-lock',
            'nin_verification': 'fas fa-id-card',
            'wallet_transaction': 'fas fa-wallet',
            'bug_report': 'fas fa-bug',
            'admin_login': 'fas fa-user-shield',
            'admin_action': 'fas fa-cogs',
            'cache_clear': 'fas fa-trash-alt',
            'email_verification': 'fas fa-envelope',
            'google_login': 'fab fa-google'
        };
        return iconMap[action] || 'fas fa-circle';
    };

    const getActivityColor = (type) => {
        const colorMap = {
            'auth': '#10b981',
            'profile': '#3b82f6',
            'security': '#f59e0b',
            'verification': '#8b5cf6',
            'transaction': '#06b6d4',
            'admin': '#ef4444',
            'system': '#6b7280'
        };
        return colorMap[type] || '#6b7280';
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return formatTime(timestamp);
    };

    return (
        <>
            <Head title="Activity History" />

            <div className="history-page">
                {/* Header */}
                <div className="history-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h2>Activity History</h2>
                            <p>
                                {auth.user.isAdmin 
                                    ? "View system-wide activity and manage cache"
                                    : "View your recent activity and manage your data"
                                }
                            </p>
                        </div>
                        <div className="header-actions">
                            <button
                                onClick={() => clearCache('user')}
                                disabled={clearingCache}
                                className="btn btn-secondary"
                                style={{
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: clearingCache ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    if (!clearingCache) e.currentTarget.style.backgroundColor = '#4b5563';
                                }}
                                onMouseOut={(e) => {
                                    if (!clearingCache) e.currentTarget.style.backgroundColor = '#6b7280';
                                }}
                            >
                                {clearingCache ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                        Clearing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-trash-alt" style={{ marginRight: '8px' }}></i>
                                        Clear My Cache
                                    </>
                                )}
                            </button>
                            
                            {auth.user.isAdmin && (
                                <button
                                    onClick={() => clearCache('all')}
                                    disabled={clearingCache}
                                    className="btn btn-danger"
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: clearingCache ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s',
                                        marginLeft: '12px'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!clearingCache) e.currentTarget.style.backgroundColor = '#dc2626';
                                    }}
                                    onMouseOut={(e) => {
                                        if (!clearingCache) e.currentTarget.style.backgroundColor = '#ef4444';
                                    }}
                                >
                                    {clearingCache ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                            Clearing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-server" style={{ marginRight: '8px' }}></i>
                                            Clear All Cache
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filter-controls">
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            style={{
                                padding: '10px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                width: '300px'
                            }}
                        />
                        
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                            style={{
                                padding: '10px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                marginLeft: '12px'
                            }}
                        >
                            <option value="all">All Activities</option>
                            <option value="auth">Authentication</option>
                            <option value="profile">Profile</option>
                            <option value="security">Security</option>
                            <option value="verification">Verification</option>
                            <option value="transaction">Transactions</option>
                            {auth.user.isAdmin && <option value="admin">Admin Actions</option>}
                            <option value="system">System</option>
                        </select>
                    </div>
                </div>

                {/* Activities List */}
                <div className="activities-container">
                    {loading ? (
                        <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#6b7280' }}></i>
                            <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading activity history...</p>
                        </div>
                    ) : filteredActivities.length === 0 ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                            <i className="fas fa-history" style={{ fontSize: '48px', color: '#d1d5db' }}></i>
                            <h3 style={{ marginTop: '16px', color: '#6b7280' }}>No activities found</h3>
                            <p style={{ marginTop: '8px', color: '#9ca3af' }}>
                                {searchTerm || filterType !== 'all' 
                                    ? 'Try adjusting your search or filters'
                                    : 'Your activity will appear here as you use the application'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="activities-list">
                            {filteredActivities.map((activity, index) => (
                                <div key={activity.id || index} className="activity-item">
                                    <div className="activity-icon" style={{ 
                                        backgroundColor: `${getActivityColor(activity.type)}20`,
                                        color: getActivityColor(activity.type)
                                    }}>
                                        <i className={getActivityIcon(activity.action)}></i>
                                    </div>
                                    
                                    <div className="activity-content">
                                        <div className="activity-header">
                                            <h4>{activity.description || activity.action}</h4>
                                            <span className="activity-time" title={formatTime(activity.created_at)}>
                                                {getRelativeTime(activity.created_at)}
                                            </span>
                                        </div>
                                        
                                        {activity.details && (
                                            <p className="activity-details">{activity.details}</p>
                                        )}
                                        
                                        {activity.ip_address && (
                                            <div className="activity-meta">
                                                <span className="meta-item">
                                                    <i className="fas fa-globe" style={{ marginRight: '4px' }}></i>
                                                    {activity.ip_address}
                                                </span>
                                                {activity.user_agent && (
                                                    <span className="meta-item">
                                                        <i className="fas fa-desktop" style={{ marginRight: '4px' }}></i>
                                                        {activity.user_agent.split(' ')[0]}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .history-page {
                    padding: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .history-header {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 24px;
                    box-shadow: '0 1px 3px rgba(0, 0, 0, 0.1)';
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-text h2 {
                    margin: 0 0 8px 0;
                    color: #1f2937;
                    font-size: 24px;
                    font-weight: 600;
                }

                .header-text p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .filters-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                    box-shadow: '0 1px 3px rgba(0, 0, 0, 0.1)';
                }

                .filter-controls {
                    display: flex;
                    align-items: center;
                }

                .activities-container {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: '0 1px 3px rgba(0, 0, 0, 0.1)';
                }

                .activities-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .activity-item {
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    border: 1px solid #f3f4f6;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .activity-item:hover {
                    background: #f9fafb;
                    border-color: #e5e7eb;
                }

                .activity-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .activity-content {
                    flex: 1;
                }

                .activity-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 4px;
                }

                .activity-header h4 {
                    margin: 0;
                    color: #1f2937;
                    font-size: 14px;
                    font-weight: 500;
                }

                .activity-time {
                    color: #6b7280;
                    font-size: 12px;
                    white-space: nowrap;
                }

                .activity-details {
                    color: #6b7280;
                    font-size: 13px;
                    margin: 4px 0 0 0;
                }

                .activity-meta {
                    display: flex;
                    gap: 16px;
                    margin-top: 8px;
                }

                .meta-item {
                    color: #9ca3af;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    .history-page {
                        padding: 16px;
                    }

                    .header-content {
                        flex-direction: column;
                        gap: 16px;
                        align-items: flex-start;
                    }

                    .header-actions {
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .filter-controls {
                        flex-direction: column;
                        gap: 12px;
                    }

                    .search-input,
                    .filter-select {
                        width: 100%;
                        margin-left: 0 !important;
                    }

                    .activity-header {
                        flex-direction: column;
                        gap: 4px;
                    }

                    .activity-meta {
                        flex-direction: column;
                        gap: 4px;
                    }
                }
            `}</style>
        </>
    );
};

export default History;