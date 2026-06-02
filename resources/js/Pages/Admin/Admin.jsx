import React, { useState, useEffect } from 'react';
import { usePage, Head, Link, router } from '@inertiajs/react';

const Admin = ({ auth, initialStats }) => {
    const [stats, setStats] = useState(initialStats || {
        totalUsers: 0,
        activeUsers: 0,
        totalNinVerifications: 0,
        todayVerifications: 0
    });
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (initialStats) {
            setStats(initialStats);
        } else {
            fetchAdminStats();
        }
    }, [initialStats]);

    const fetchAdminStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('admin.stats'), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);

                console.log(data);
            }
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
            router.post(route('logout'));
        }
    };

    return (
        <>
            <Head title="Admin Dashboard" />

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
                        <Link href={route('admin.dashboard')} className="sidebar-link active" onClick={() => setIsSidebarOpen(false)}>
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
                            <h3>Admin Dashboard</h3>
                        </div>

                        <div className="topbar-right">
                            <div className="user-profile">
                                <span>{auth.user?.name}</span>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="dashboard-content">
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total Users</h4>
                                    <span className="stat-number">{loading ? '...' : stats.totalUsers}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-user-check"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Active Users</h4>
                                    <span className="stat-number">{loading ? '...' : stats.activeUsers}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-id-card"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total NIN Verifications</h4>
                                    <span className="stat-number">{loading ? '...' : stats.totalNinVerifications}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-calendar-day"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Today's Verifications</h4>
                                    <span className="stat-number">{loading ? '...' : stats.todayVerifications}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="admin-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-grid">
                                <Link href="/admin/users" className="action-card">
                                    <i className="fas fa-users"></i>
                                    <span>Manage Users</span>
                                </Link>
                                <Link href="/admin/nin-requests" className="action-card">
                                    <i className="fas fa-search"></i>
                                    <span>NIN Requests</span>
                                </Link>
                                <Link href="/admin/system-logs" className="action-card">
                                    <i className="fas fa-file-alt"></i>
                                    <span>System Logs</span>
                                </Link>
                                <Link href="/admin/nin-profit" className="action-card">
                                    <i className="fas fa-cog"></i>
                                    <span>Nin profit</span>
                                </Link>
                                <Link href="/admin/settings" className="action-card">
                                    <i className="fas fa-cog"></i>
                                    <span>System Settings</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
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
                    background: linear-gradient(135deg, #0B6B3A 0%, #10B981 100%);
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

                .action-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }

                .action-card {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    text-decoration: none;
                    color: #374151;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .action-card:hover {
                    background: #f3f4f6;
                    border-color: #d1d5db;
                    transform: translateY(-1px);
                }

                .action-card i {
                    font-size: 20px;
                    color: #6b7280;
                }

                .action-card span {
                    font-weight: 500;
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
                        left: -270px !important;
                        width: 260px !important;
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
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                    }

                    .stat-card {
                        padding: 20px !important;
                    }

                    .admin-actions {
                        padding: 20px 15px !important;
                    }

                    .action-grid {
                        grid-template-columns: 1fr !important;
                        gap: 10px !important;
                    }
                    
                    .action-card {
                        padding: 15px !important;
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

export default Admin;
