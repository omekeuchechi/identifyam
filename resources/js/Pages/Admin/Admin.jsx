import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';

const Admin = ({ auth }) => {
    const { props } = usePage();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalNinVerifications: 0,
        todayVerifications: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAdminStats();
    }, []);

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
            <Head title="Admin Dashboard" />

            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-image">
                        </div>
                        <span>IDENTIFYAM</span>
                    </div>

                    <nav className="sidebar-menu">
                        <Link href={route('admin.dashboard')} className="sidebar-link active">
                            <i className="fas fa-tachometer-alt"></i>Dashboard
                        </Link>
                        <Link href={route('dashboard')} className="sidebar-link">
                            <i className="fas fa-home"></i>User Dashboard
                        </Link>
                        <Link href="/lagacy-nin" className="sidebar-link">
                            <i className="fas fa-history"></i> Lagacy NIN
                        </Link>
                        <Link href={route('exam.cards')} className="sidebar-link">
                            <i className="fas fa-credit-card"></i> Exam Cards
                        </Link>
                        <Link href="/admin/users" className="sidebar-link">
                            <i className="fas fa-credit-card"></i> Manage Users
                        </Link>
                        <Link href="#" className="sidebar-link">
                            <i className="fas fa-history"></i>History
                        </Link>
                        <Link href="/profile" className="sidebar-link">
                            <i className="fas fa-user-edit"></i>Profile Edit
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
                        <h3>Admin Dashboard</h3>

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

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
                    
                    .action-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    );
};

export default Admin;
