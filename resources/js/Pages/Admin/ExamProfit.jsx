import React, { useState, useEffect, useRef } from 'react';
import { usePage, Head, Link, router } from '@inertiajs/react';
import { formatCurrency } from '../../utils/formatCurrency';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ExamProfit = ({ auth, purchases: initialPurchases, analytics: initialAnalytics, profitData: initialProfitData }) => {
    const [analytics, setAnalytics] = useState(initialAnalytics || {
        totalPurchases: 0,
        totalRevenue: 0,
        totalProfit: 0,
        totalCardsSold: 0,
        avgDailyProfit: 0,
        avgMonthlyProfit: 0,
        avgYearlyProfit: 0,
        totalWalletBalance: 0
    });
    const [profitData, setProfitData] = useState(initialProfitData || []);
    const [purchases, setPurchases] = useState(initialPurchases?.data || []);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // No need to fetch on mount as data is provided via props
    useEffect(() => {
        if (initialAnalytics) setAnalytics(initialAnalytics);
        if (initialProfitData) setProfitData(initialProfitData);
        if (initialPurchases) setPurchases(initialPurchases.data);
    }, [initialAnalytics, initialProfitData, initialPurchases]);

    const handleLogout = (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
            router.post(route('logout'));
        }
    };

    // Chart data configuration
    const chartData = {
        labels: profitData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Revenue',
                data: profitData.map(item => item.revenue),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Profit',
                data: profitData.map(item => item.profit),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₦' + value.toLocaleString();
                    }
                }
            }
        }
    };

    // Bar chart for cards sold
    const barChartData = {
        labels: profitData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Cards Sold',
                data: profitData.map(item => item.cards_sold),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Purchases',
                data: profitData.map(item => item.purchases),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <>
            <Head title="Exam Card Profit Analytics" />

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
                            <i className="fas fa-users"></i> Manage Users
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
                        <Link href={route('admin.exam-profit')} className="sidebar-link active" onClick={() => setIsSidebarOpen(false)}>
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
                            <h3>Exam Card Profit Analytics</h3>
                        </div>

                        <div className="topbar-right">
                            <div className="user-profile">
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
                                    <i className="fas fa-credit-card"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total Cards Sold</h4>
                                    <span className="stat-number">{loading ? '...' : analytics.totalCardsSold}</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <div className="stat-info">
                                    <h4>Total Purchases</h4>
                                    <span className="stat-number">{loading ? '...' : analytics.totalPurchases}</span>
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

                        {/* Revenue and Profit Chart */}
                        <div className="admin-actions">
                            <h3>30-Day Revenue & Profit Trend</h3>
                            <div className="chart-container" style={{ height: '300px' }}>
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Cards Sold and Purchases Chart */}
                        <div className="admin-actions">
                            <h3>30-Day Cards Sold & Purchases</h3>
                            <div className="chart-container" style={{ height: '300px' }}>
                                <Bar data={barChartData} options={barChartOptions} />
                            </div>
                        </div>

                        {/* Recent Purchases Table */}
                        <div className="admin-actions">
                            <h3>Recent Exam Card Purchases</h3>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Card Type</th>
                                            <th>Quantity</th>
                                            <th>Amount</th>
                                            <th>Profit</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchases.slice(0, 10).map((purchase) => (
                                            <tr key={purchase.id}>
                                                <td>{purchase.user?.name || 'N/A'}</td>
                                                <td>{purchase.card_type || 'N/A'}</td>
                                                <td>{purchase.quantity || 1}</td>
                                                <td>{formatCurrency(purchase.amount || 0)}</td>
                                                <td className="profit-positive">{formatCurrency((purchase.amount || 0) - ((purchase.quantity || 1) * analytics.costPerCard))}</td>
                                                <td>{new Date(purchase.created_at).toLocaleDateString()}</td>
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

                .sidebar-link:hover {
                    background: #f3f4f6;
                    color: #1f2937;
                }

                .sidebar-link.active {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .sidebar-close-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: auto;
                }

                .sidebar-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 999;
                }

                .dashboard-main {
                    flex: 1;
                    margin-left: 280px;
                }

                .topbar {
                    background: white;
                    padding: 15px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .sidebar-toggle-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 20px;
                    margin-right: 15px;
                }

                .topbar h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: #1f2937;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #6b7280;
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
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .stat-info h4 {
                    margin: 0 0 5px 0;
                    font-size: 14px;
                    color: #6b7280;
                }

                .stat-number {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .admin-actions {
                    background: white;
                    border-radius: 12px;
                    padding: 25px;
                    margin-bottom: 25px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }

                .admin-actions h3 {
                    margin: 0 0 20px 0;
                    font-size: 18px;
                    color: #1f2937;
                }

                .action-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }

                .projection-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    padding: 20px;
                    color: white;
                    transition: transform 0.2s ease;
                }

                .projection-card:hover {
                    transform: translateY(-2px);
                }

                .projection-card h4 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    opacity: 0.9;
                }

                .projection-amount {
                    font-size: 24px;
                    font-weight: 700;
                }

                .chart-container {
                    position: relative;
                    background: #fafafa;
                    border-radius: 8px;
                    padding: 15px;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th {
                    background: #f9fafb;
                    padding: 12px 15px;
                    text-align: left;
                    font-weight: 600;
                    color: #6b7280;
                    border-bottom: 2px solid #e5e7eb;
                }

                .admin-table td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .admin-table tr:hover {
                    background: #f9fafb;
                }

                .profit-positive {
                    color: #10b981;
                    font-weight: 600;
                }

                /* Responsive styles */
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }

                    .sidebar.open {
                        transform: translateX(0);
                    }

                    .sidebar-overlay {
                        display: block;
                    }

                    .sidebar-overlay:not(:has(+ .sidebar.open)) {
                        display: none;
                    }

                    .dashboard-main {
                        margin-left: 0;
                    }

                    .sidebar-toggle-btn {
                        display: block;
                    }

                    .sidebar-close-btn {
                        display: block;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .dashboard-content {
                        padding: 15px;
                    }
                }
            `}</style>
        </>
    );
};

export default ExamProfit;
