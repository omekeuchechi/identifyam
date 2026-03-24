import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Funding({ auth }) {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTransferForm, setShowTransferForm] = useState(false);
    const [banks, setBanks] = useState([]);

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
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-image">
                            <img src="/assets/svg/shield.svg" alt="" />
                        </div>
                        <span>IDENTIFYAM</span>
                    </div>

                    <nav className="sidebar-menu">
                        <Link href={route('dashboard')} className="sidebar-link">
                            <i className="fas fa-home"></i>Dashboard
                        </Link>
                        <Link href={route('nin.service')} className="sidebar-link">
                            <i className="fas fa-id-card"></i> NIN Services
                        </Link>
                        <Link href={route('exam.cards')} className="sidebar-link">
                            <i className="fas fa-credit-card"></i> Exam Cards
                        </Link>
                        <Link href={route('funding')} className="sidebar-link active">
                            <i className="fas fa-wallet"></i>Wallet
                        </Link>
                        <Link href="#" className="sidebar-link">
                            <i className="fas fa-history"></i>History
                        </Link>
                        <Link href="#" className="sidebar-link">
                            <i className="fas fa-cog"></i>Settings
                        </Link>
                    </nav>
                </aside>

                {/* Main Area */}
                <div className="dashboard-main">
                    {/* Topbar */}
                    <header className="topbar">
                        <h3>Wallet Funding</h3>

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
                                <p>Account: 2087654321 | GTBank</p>
                                <h2>₦{Number(balance).toLocaleString()}</h2>
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

                            <div className="option-card">
                                <h3>Transfer Funds</h3>
                                <p>Transfer funds to bank account</p>
                                
                                {!showTransferForm ? (
                                    <button 
                                        className="transfer-btn"
                                        onClick={() => setShowTransferForm(true)}
                                    >
                                        Make Transfer
                                    </button>
                                ) : (
                                    <form onSubmit={handleTransfer} className="transfer-form">
                                        <div className="form-group">
                                            <label>Amount (₦)</label>
                                            <input
                                                type="number"
                                                min="100"
                                                step="100"
                                                value={transferForm.data.amount}
                                                onChange={(e) => transferForm.setData('amount', e.target.value)}
                                                placeholder="Enter amount"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Recipient Name</label>
                                            <input
                                                type="text"
                                                value={transferForm.data.recipient_name}
                                                onChange={(e) => transferForm.setData('recipient_name', e.target.value)}
                                                placeholder="Enter recipient name"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Account Number</label>
                                            <input
                                                type="text"
                                                maxLength="10"
                                                value={transferForm.data.recipient_account}
                                                onChange={(e) => transferForm.setData('recipient_account', e.target.value)}
                                                placeholder="10-digit account number"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Bank</label>
                                            <select
                                                value={transferForm.data.recipient_bank}
                                                onChange={(e) => transferForm.setData('recipient_bank', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Bank</option>
                                                {banks.map(bank => (
                                                    <option key={bank.code} value={bank.code}>
                                                        {bank.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-actions">
                                            <PrimaryButton disabled={transferForm.processing || loading} style={{ background: 'linear-gradient(135deg, #0B6B3A 0%, #10B981 70.71%)', color: '#fff', padding: '13px 30px', border: 'none', borderRadius: '8px' }}>
                                                {loading ? 'Processing...' : 'Transfer'}
                                            </PrimaryButton>
                                            <button 
                                                type="button"
                                                className="cancel-btn"
                                                onClick={() => {
                                                    setShowTransferForm(false);
                                                    transferForm.reset();
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="transaction-history">
                            <h3>Recent Transactions</h3>
                            
                            <div className="transactions-list">
                                {transactions.length > 0 ? (
                                    transactions.map(transaction => (
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