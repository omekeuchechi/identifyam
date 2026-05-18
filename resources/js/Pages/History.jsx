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
                                className="btn btn-clear-user"
                            >
                                {clearingCache ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        <span>Clearing...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-trash-alt"></i>
                                        <span>Clear My Cache</span>
                                    </>
                                )}
                            </button>
                            
                            {auth.user.isAdmin && (
                                <button
                                    onClick={() => clearCache('all')}
                                    disabled={clearingCache}
                                    className="btn btn-clear-all"
                                >
                                    {clearingCache ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            <span>Clearing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-server"></i>
                                            <span>Clear All Cache</span>
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
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        
                        <div className="filter-box">
                            <i className="fas fa-filter"></i>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="filter-select"
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
                </div>

                {/* Activities List */}
                <div className="activities-container">
                    {loading ? (
                        <div className="loading-state">
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Loading activity history...</p>
                        </div>
                    ) : filteredActivities.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-history"></i>
                            <h3>No activities found</h3>
                            <p>
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
                                            <div className="activity-title-row">
                                                <h4>{activity.description || activity.action}</h4>
                                                {activity.amount && (
                                                    <span className="activity-amount">
                                                        ₦{Number(activity.amount).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="activity-time" title={formatTime(activity.created_at)}>
                                                {getRelativeTime(activity.created_at)}
                                            </span>
                                        </div>
                                        
                                        {activity.reference && (
                                            <div className="activity-reference">
                                                REF: {activity.reference}
                                            </div>
                                        )}
                                        
                                        {activity.details && (
                                            <div className="activity-details">
                                                {typeof activity.details === 'object' ? (
                                                    <div className="details-grid">
                                                        {Object.entries(activity.details).map(([key, value]) => (
                                                            <span key={key} className="detail-tag">
                                                                <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>{activity.details}</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        {activity.ip_address && (
                                            <div className="activity-meta">
                                                <span className="meta-item">
                                                    <i className="fas fa-globe"></i>
                                                    {activity.ip_address}
                                                </span>
                                                {activity.user_agent && (
                                                    <span className="meta-item">
                                                        <i className="fas fa-desktop"></i>
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
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
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

                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-clear-user {
                    background-color: #10b981;
                    color: white;
                }

                .btn-clear-user:hover:not(:disabled) {
                    background-color: #059669;
                }

                .btn-clear-all {
                    background-color: #ef4444;
                    color: white;
                }

                .btn-clear-all:hover:not(:disabled) {
                    background-color: #dc2626;
                }

                .filters-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .filter-controls {
                    display: flex;
                    gap: 16px;
                }

                .search-box, .filter-box {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-box i, .filter-box i {
                    position: absolute;
                    left: 14px;
                    color: #9ca3af;
                    font-size: 14px;
                }

                .search-input, .filter-select {
                    padding: 10px 16px 10px 40px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    width: 100%;
                    outline: none;
                    transition: border-color 0.2s;
                }

                .search-input:focus, .filter-select:focus {
                    border-color: #10b981;
                }

                .search-box { flex: 1; max-width: 400px; }
                .filter-box { width: 220px; }

                .activities-container {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .loading-state, .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                }

                .loading-state i {
                    font-size: 24px;
                    color: #10b981;
                }

                .loading-state p {
                    margin-top: 16px;
                    color: #6b7280;
                }

                .empty-state i {
                    font-size: 48px;
                    color: #d1d5db;
                }

                .empty-state h3 {
                    margin: 16px 0 8px 0;
                    color: #374151;
                }

                .empty-state p {
                    color: #6b7280;
                    font-size: 14px;
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
                    border-radius: 12px;
                    transition: all 0.2s;
                }

                .activity-item:hover {
                    background: #f9fafb;
                    border-color: #e5e7eb;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .activity-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 18px;
                }

                .activity-content {
                    flex: 1;
                    min-width: 0;
                }

                .activity-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 6px;
                }

                .activity-title-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .activity-title-row h4 {
                    margin: 0;
                    color: #111827;
                    font-size: 15px;
                    font-weight: 600;
                }

                .activity-amount {
                    font-weight: 700;
                    color: #10b981;
                    font-size: 14px;
                }

                .activity-time {
                    color: #6b7280;
                    font-size: 12px;
                    white-space: nowrap;
                    background: #f3f4f6;
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .activity-reference {
                    font-size: 11px;
                    color: #9ca3af;
                    margin-bottom: 6px;
                    font-family: monospace;
                }

                .details-grid {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-top: 8px;
                }

                .detail-tag {
                    background: #f3f4f6;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    color: #4b5563;
                    border: 1px solid #e5e7eb;
                }

                .activity-meta {
                    display: flex;
                    gap: 16px;
                    margin-top: 12px;
                    border-top: 1px solid #f3f4f6;
                    padding-top: 8px;
                }

                .meta-item {
                    color: #9ca3af;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                @media (max-width: 1024px) {
                    .filter-box { width: 200px; }
                }

                @media (max-width: 768px) {
                    .history-page {
                        padding: 16px;
                    }

                    .header-content {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .header-actions {
                        width: 100%;
                        flex-direction: column;
                    }

                    .btn {
                        width: 100%;
                    }

                    .filter-controls {
                        flex-direction: column;
                    }

                    .search-box, .filter-box {
                        width: 100%;
                        max-width: none;
                    }

                    .activity-item {
                        padding: 12px;
                        gap: 12px;
                    }

                    .activity-icon {
                        width: 36px;
                        height: 36px;
                        font-size: 16px;
                    }

                    .activity-header {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .activity-title-row {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .activity-time {
                        align-self: flex-start;
                    }

                    .activity-meta {
                        flex-wrap: wrap;
                        gap: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .activity-item {
                        flex-direction: column;
                    }

                    .activity-icon {
                        align-self: flex-start;
                    }

                    .activity-title-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                    }

                    .activity-amount {
                        font-size: 16px;
                    }
                }
            `}</style>
        </>
    );
};

export default History;