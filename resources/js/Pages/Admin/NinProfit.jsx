import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import { formatCurrency } from '../../utils/formatCurrency';

const NinProfit = ({ auth }) => {
    const { props } = usePage();
    const [analytics, setAnalytics] = useState({
        totalRequests: 0,
        totalRevenue: 0,
        totalProfit: 0,
        avgDailyProfit: 0,
        avgMonthlyProfit: 0,
        avgYearlyProfit: 0,
        totalWalletBalance: 0
    });
    const [profitData, setProfitData] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNinProfitData();
    }, []);

    const fetchNinProfitData = async () => {
        try {
            setLoading(true);
            const response = await fetch(route('admin.nin-profit'), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data.analytics);
                setProfitData(data.profitData);
                setRequests(data.requests.data);
            }
        } catch (err) {
            console.error('Failed to fetch NIN profit data:', err);
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

    return (
        <>
            <Head title="NIN Profit Analytics" />

            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-image">
                        </div>
                        <span>IDENTIFYAM</span>
                    </div>

                    <nav className="sidebar-menu">
                        <Link href={route('admin.dashboard')} className="sidebar-link">
                            <i className="fas fa-tachometer-alt"></i>Dashboard
                        </Link>
                        <Link href="lagacy-nin" className="sidebar-link">
                            <i className="fas fa-history"></i> Lagacy NIN
                        </Link>
                        <Link href={route('exam.cards')} className="sidebar-link">
                            <i className="fas fa-credit-card"></i> Exam Cards
                        </Link>
                        <Link href="/admin/users" className="sidebar-link">
                            <i className="fas fa-credit-card"></i> Manage Users
                        </Link>
                        <Link href="history" className="sidebar-link">
                            <i className="fas fa-history"></i>History
                        </Link>
                        <Link href="profile" className="sidebar-link">
                            <i className="fas fa-user-edit"></i>Profile Edit
                        </Link>
                        <Link href={route('admin.nin-profit')} className="sidebar-link active">
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
                        <h3>NIN Profit Analytics</h3>

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
                        {/* Analytics Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-money-bill-wave"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total Revenue</h4>
                                    <span className="stat-number">{loading ? '...' : formatCurrency(analytics.totalRevenue)}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total Profit</h4>
                                    <span className="stat-number">{loading ? '...' : formatCurrency(analytics.totalProfit)}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-wallet"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total Wallet Balance</h4>
                                    <span className="stat-number">{loading ? '...' : formatCurrency(analytics.totalWalletBalance)}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total Requests</h4>
                                    <span className="stat-number">{loading ? '...' : analytics.totalRequests}</span>
                                </div>
                            </div>
                        </div>

                        {/* Profit Projections */}
                        <div className="admin-actions">
                            <h3>Profit Projections</h3>
                            <div className="action-grid">
                                <div className="projection-card">
                                    <h4>Daily Average</h4>
                                    <span className="projection-amount">{loading ? '...' : formatCurrency(analytics.avgDailyProfit)}</span>
                                </div>
                                <div className="projection-card">
                                    <h4>Monthly Average</h4>
                                    <span className="projection-amount">{loading ? '...' : formatCurrency(analytics.avgMonthlyProfit)}</span>
                                </div>
                                <div className="projection-card">
                                    <h4>Yearly Average</h4>
                                    <span className="projection-amount">{loading ? '...' : formatCurrency(analytics.avgYearlyProfit)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Profit Chart */}
                        <div className="admin-actions">
                            <h3>30-Day Profit Trend</h3>
                            <div className="chart-container">
                                <canvas id="profitChart" width="400" height="200"></canvas>
                            </div>
                        </div>

                        {/* Recent Requests Table */}
                        <div className="admin-actions">
                            <h3>Recent NIN Requests</h3>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>NIN</th>
                                            <th>Amount</th>
                                            <th>Profit</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.slice(0, 10).map((request) => (
                                            <tr key={request.id}>
                                                <td>{request.user?.name || 'N/A'}</td>
                                                <td>{request.nin}</td>
                                                <td>{formatCurrency(request.amount || 1000)}</td>
                                                <td className="profit-positive">{formatCurrency((request.amount || 1000) - 140)}</td>
                                                <td>{new Date(request.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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

                .projection-card {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    text-align: center;
                }

                .projection-card h4 {
                    color: #6b7280;
                    margin-bottom: 10px;
                    font-size: 14px;
                }

                .projection-amount {
                    font-size: 24px;
                    font-weight: 700;
                    color: #10b981;
                }

                .chart-container {
                    position: relative;
                    height: 300px;
                    margin: 20px 0;
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
                    color: #475569;
                    border-bottom: 2px solid #e2e8f0;
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .profit-positive {
                    color: #10b981;
                    font-weight: 600;
                }

                .table-responsive {
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
                    
                    .action-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Chart Script */}
            <script dangerouslySetInnerHTML={{
                __html: `
                    ${profitData.length > 0 ? `
                        const canvas = document.getElementById('profitChart');
                        const ctx = canvas.getContext('2d');
                        
                        // Simple bar chart implementation
                        const data = ${JSON.stringify(profitData)};
                        const maxProfit = Math.max(...data.map(d => d.profit));
                        const chartHeight = 200;
                        const chartWidth = canvas.width;
                        const barWidth = chartWidth / data.length - 10;
                        
                        // Clear canvas
                        ctx.clearRect(0, 0, chartWidth, chartHeight);
                        
                        // Draw bars
                        data.forEach((item, index) => {
                            const barHeight = (item.profit / maxProfit) * chartHeight;
                            const x = index * (barWidth + 10) + 5;
                            const y = chartHeight - barHeight;
                            
                            // Draw bar
                            ctx.fillStyle = '#10b981';
                            ctx.fillRect(x, y, barWidth, barHeight);
                            
                            // Draw value on top
                            ctx.fillStyle = '#1f2937';
                            ctx.font = '10px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('₦' + item.profit.toFixed(0), x + barWidth/2, y - 5);
                            
                            // Draw date label
                            ctx.save();
                            ctx.translate(x + barWidth/2, chartHeight + 15);
                            ctx.rotate(-45 * Math.PI / 180);
                            ctx.fillText(new Date(item.date).toLocaleDateString(), 0, 0);
                            ctx.restore();
                        });
                    ` : ''}
                `
            }} />
        </>
    );
};

export default NinProfit;
