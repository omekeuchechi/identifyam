import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

import "../../css/dashboardRes.css";
import "../../css/fundingRes.css";

export default function Funding({ auth }) {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTransferForm, setShowTransferForm] = useState(false);
    const [banks, setBanks] = useState([]);
    const [showBalance, setShowBalance] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data, setData, post, processing } = useForm({
        amount: '',
        email: auth.user.email,
    });

    const transferForm = useForm({
        amount: '',
        recipient_name: '',
        recipient_account: '',
        recipient_bank: '',
    });

    useEffect(() => {
        fetchBalance();
        fetchTransactions();
        fetchBanks();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await fetch(route('wallet.balance'));
            const data = await response.json();
            setBalance(data.balance);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await fetch(route('wallet.transactions'));
            const data = await response.json();
            setTransactions(data.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    const fetchBanks = async () => {
        // Mock bank data - in production, fetch from Paystack
        setBanks([
            { code: '058', name: 'GTBank' },
            { code: '044', name: 'Access Bank' },
            { code: '011', name: 'First Bank' },
            { code: '050', name: 'EcoBank' },
            { code: '070', name: 'Zenith Bank' },
        ]);
    };

    const handleFunding = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await post(route('wallet.funding.initialize'), {
                onSuccess: (page) => {
                    if (page.props.data.authorization_url) {
                        // Redirect to Paystack payment page
                        window.location.href = page.props.data.authorization_url;
                    }
                },
                onError: (errors) => {
                    console.error('Funding failed:', errors);
                }
            });
        } catch (error) {
            console.error('Funding error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await transferForm.post(route('wallet.transfer'), {
                onSuccess: (page) => {
                    fetchBalance();
                    fetchTransactions();
                    transferForm.reset();
                    setShowTransferForm(false);
                },
                onError: (errors) => {
                    console.error('Transfer failed:', errors);
                }
            });
        } catch (error) {
            console.error('Transfer error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Wallet Funding" />

            <div className="dashboard-layout">
                {/* Mobile Menu Overlay */}
                <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

                {/* Sidebar */}
                <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <a href='/' className="sidebar-logo">
                        <div className="logo-image">
                            <img src="/assets/svg/shield.svg" alt="" />
                        </div>
                        <span>IDENTIFYAM</span>
                    </a>

                    <nav className="sidebar-menu">
                        <Link href={route('dashboard')} className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
                            <i className="fas fa-home"></i>Dashboard
                        </Link>
                        <Link href="lagacy-nin" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
                            <i className="fas fa-id-card"></i> NIN Services
                        </Link>
                        <Link href={route('exam.cards')} className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
                            <i className="fas fa-credit-card"></i> Exam Cards
                        </Link>
                        <Link href={route('funding')} className="sidebar-link active" onClick={() => setMobileMenuOpen(false)}>
                            <i className="fas fa-wallet"></i>Wallet
                        </Link>
                        <Link href="history" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
                            <i className="fas fa-history"></i>History
                        </Link>
                        <Link href="settings" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
                            <i className="fas fa-cog"></i>Settings
                        </Link>
                    </nav>
                </aside>

                {/* Main Area */}
                <div className="dashboard-main">
                    {/* Topbar */}
                    <header className="topbar">
                        <div className="topbar-left">
                            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                            </button>
                            <h3>Wallet Funding</h3>
                        </div>

                        <div className="topbar-right">
                            <span className="notification"><i className="fas fa-bell"></i></span>
                            <div className="user-profile">
                                <img src="/assets/img/user_profile.png" alt="avatar" />
                                <span>{auth.user.name}</span>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="dashboard-content">
                        {/* Wallet Balance Card */}
                        <div className="wallet-card">
                            <div>
                                <h4>Wallet Balance</h4>
                                <h2 style={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <i
                                        className={`fas ${showBalance ? 'fa-eye-slash' : 'fa-eye'}`}
                                        onClick={() => setShowBalance(!showBalance)}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            color: '#fff'
                                        }}
                                    ></i>
                                    {showBalance ? `₦${Number(balance).toLocaleString()}` : '****'}
                                </h2>
                            </div>
                        </div>

                        {/* Funding Options */}
                        <div className="funding-options">
                            <div className="option-card">
                                <h3>Fund Wallet</h3>
                                <p>Add funds to your wallet using Paystack</p>

                                <form onSubmit={handleFunding} className="funding-form">
                                    <div className="form-group">
                                        <label>Amount (₦)</label>
                                        <input
                                            type="number"
                                            min="100"
                                            step="100"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            placeholder="Enter amount"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <PrimaryButton disabled={processing || loading} style={{ background: 'linear-gradient(135deg, #0B6B3A 0%, #10B981 70.71%)', color: '#fff', padding: '13px 30px', border: 'none', borderRadius: '8px', fontSize: '1.2rem' }}>
                                        {loading ? 'Processing...' : 'Fund Wallet'}
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="transaction-history">
                            <h3>Recent Transactions</h3>

                            <div className="transactions-list">
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 10).map(transaction => (
                                        <div key={transaction.id} className={`transaction-item ${transaction.status}`}>
                                            <div className="transaction-info">
                                                <h4>{transaction.description || transaction.type}</h4>
                                                <p>{new Date(transaction.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="transaction-amount">
                                                <span className={`amount ${transaction.type}`}>
                                                    {transaction.type === 'funding' ? '+' : '-'}₦{Number(transaction.amount).toLocaleString()}
                                                </span>
                                                <span className={`status ${transaction.status}`}>
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-transactions">No transactions yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}