import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function ExamCards({ auth }) {
    const [availableCards, setAvailableCards] = useState([]);
    const [userPurchases, setUserPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('available');
    const [purchaseForm, setPurchaseForm] = useState({
        card_type_id: '',
        quantity: 1
    });
    const [purchaseLoading, setPurchaseLoading] = useState(false);

    // Fetch available cards on component mount
    useEffect(() => {
        fetchAvailableCards();
        if (auth.user) {
            fetchUserPurchases();
            // Test authentication endpoint
            fetch('/api/exam-cards/auth-test', {
                credentials: 'include',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            }).then(res => res.json()).then(data => {
                console.log('Auth test result:', data);
            }).catch(err => {
                console.error('Auth test failed:', err);
            });
        }
    }, []);

    const fetchAvailableCards = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/exam-cards/available', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
            if (!response.ok) {
                console.error('Failed to fetch available cards:', response.status, response.statusText);
                setError('Failed to fetch available cards');
                return;
            }
            const data = await response.json();
            setAvailableCards(data.data || []);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPurchases = async () => {
        console.log('Current user:', auth.user);
        console.log('User authenticated:', !!auth.user);
        
        try {
            const response = await fetch('/api/exam-cards/purchases', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            // Check if response is HTML (redirect to login)
            const contentType = response.headers.get('content-type');
            console.log('Content type:', contentType); 
            
            if (!response.ok) {
                console.error('Failed to fetch purchases:', response.status, response.statusText);
                return;
            }
            const data = await response.json();
            setUserPurchases(data.data || []);
        } catch (err) {
            console.error('Failed to fetch purchases:', err);
            
            // If it's a JSON parsing error, log the response text
            if (err.message && err.message.includes('Unexpected token')) {
                const responseText = await response.clone().text();
                console.error('Response text (should be JSON but got HTML):', responseText);
            }
        }
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        
        // if (!auth.user) {
        //     setError('Please login to purchase exam cards');
        //     window.location.href = '/login';
        //     return;
        // }

        try {
            setPurchaseLoading(true);
            setError('');

            const response = await fetch('/api/exam-cards/purchase', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    card_type_id: purchaseForm.card_type_id.toString(), // Convert to string
                    quantity: purchaseForm.quantity
                })
            });

           

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Purchase failed');
                return;
            }

            const data = await response.json();
            console.log(data);

            // Check if purchase was actually successful based on API response
            if (data.status === 200 && !data.error) {
                // Refresh purchases
                fetchUserPurchases();
                // Reset form
                setPurchaseForm({
                    card_type_id: '',
                    quantity: 1
                });
                alert('Purchase successful!');
            } else {
                // Purchase failed - show the actual error from API
                const errorMessage = data.error || data.message || 'Purchase failed';
                setError(errorMessage);
                console.error('Purchase failed:', data);
            }
        } catch (err) {
            setError(err.message || 'An error occurred during purchase');
        } finally {
            setPurchaseLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPurchaseForm(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value) || 1 : value
        }));
    };

    const refreshCards = () => {
        fetchAvailableCards();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    const handleDownloadPDF = async (purchase) => {
        try {
            // Create a new window or use a library like jsPDF
            const response = await fetch(`/api/exam-cards/download/${purchase.reference}`, {
                credentials: 'include',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `exam-card-${purchase.reference}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to download PDF');
            }
        } catch (err) {
            console.error('Download error:', err);
            alert('Error downloading PDF');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <>
            <Head title="Exam Cards" />

            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <a href='/' className="sidebar-logo">
                        <div className="logo-image">
                            <img src="/assets/svg/shield.svg" alt="" />
                        </div>
                        <span>IDENTIFYAM</span>
                    </a>

                    <nav className="sidebar-menu">
                        <Link href={route('dashboard')} className="sidebar-link">
                            <i className="fas fa-home"></i>Dashboard
                        </Link>
                        <Link href="lagacy-nin" className="sidebar-link">
                            <i className="fas fa-id-card"></i> NIN Services
                        </Link>
                        <Link href={route('exam.cards')} className="sidebar-link active">
                            <i className="fas fa-credit-card"></i> Exam Cards
                        </Link>
                        <Link href={route('funding')} className="sidebar-link">
                            <i className="fas fa-wallet"></i>Wallet
                        </Link>
                        <Link href="history" className="sidebar-link">
                            <i className="fas fa-history"></i>History
                        </Link>
                        <Link href="settings" className="sidebar-link">
                            <i className="fas fa-cog"></i>Settings
                        </Link>
                    </nav>
                </aside>

                {/* Main Area */}
                <div className="dashboard-main">
                    {/* Topbar */}
                    <header className="topbar">
                        <h3>Exam Cards</h3>

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
            <style jsx>{`
                .download-btn {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.3s;
                }
                .download-btn:hover {
                    background: #218838;
                }
                .download-btn i {
                    margin-right: 5px;
                }
            `}</style>
                        {/* Available Cards Section */}
                        <div className="exam-cards-container">
                            <div className="section-header">
                                <h4>Available Exam Cards</h4>
                                <button 
                                    className="refresh-btn"
                                    onClick={refreshCards}
                                    disabled={loading}
                                >
                                    <i className="fas fa-sync-alt"></i> Refresh
                                </button>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <i className="fas fa-exclamation-circle"></i>
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="loading-spinner">
                                    <i className="fas fa-spinner fa-spin"></i> Loading available cards...
                                </div>
                            ) : (
                                <div className="cards-grid">
                                    {availableCards.map((card) => (
                                        <div key={card.card_type_id} className="card-item">
                                            <div className="card-header">
                                                <h5>{card.card_name}</h5>
                                                <span className={`availability ${card.availability === 'In Stock' ? 'in-stock' : 'out-stock'}`}>
                                                    {card.availability}
                                                </span>
                                            </div>
                                            <div className="card-body">
                                                <div className="price">
                                                    {formatCurrency(card.unit_amount + 500)}
                                                </div>
                                                <div className="card-type-id">
                                                    ID: {card.card_type_id}
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <button 
                                                    className="purchase-btn"
                                                    onClick={() => {
                                                        setPurchaseForm({
                                                        card_type_id: card.card_type_id,
                                                        quantity: 1
                                                    })

                                                    window.location.href = "#E-card";
                                                }}
                                                    disabled={card.availability !== 'In Stock'}
                                                >
                                                    Purchase
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Purchase Form */}
                        {purchaseForm.card_type_id && (
                            <div className="purchase-form-container">
                                <h4>Purchase Exam Cards</h4>
                                <form onSubmit={handlePurchase} className="purchase-form">
                                    <div className="form-group" id='E-card'>
                                        <label>Card Type</label>
                                        <input
                                            type="text"
                                            name="card_type_id"
                                            value={availableCards.find(c => c.card_type_id === purchaseForm.card_type_id)?.card_name || ''}
                                            readOnly
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={purchaseForm.quantity}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="100"
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            className="submit-btn"
                                            disabled={purchaseLoading}
                                        >
                                            {purchaseLoading ? 'Processing...' : 'Purchase Now'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="cancel-btn"
                                            onClick={() => setPurchaseForm({ card_type_id: '', quantity: 1 })}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Purchase History */}
                        {auth.user && userPurchases.length > 0 && (
                            <div className="purchase-history">
                                <h4>Purchase History</h4>
                                <div className="history-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Card Name</th>
                                                <th>Quantity</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Reference</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userPurchases.map((purchase) => (
                                                <tr key={purchase.id}>
                                                    <td>{purchase.card_name}</td>
                                                    <td>{purchase.quantity}</td>
                                                    <td>{formatCurrency(purchase.amount)}</td>
                                                    <td>
                                                        <span className={`status-badge ${purchase.status}`}>
                                                            {purchase.status}
                                                        </span>
                                                    </td>
                                                    <td>{purchase.reference}</td>
                                                    <td>{formatDate(purchase.created_at)}</td>
                                                    <td>
                                                        {purchase.status === 'success' && (
                                                            <button 
                                                                className="download-btn"
                                                                onClick={() => handleDownloadPDF(purchase)}
                                                                title="Download PDF"
                                                            >
                                                                <i className="fas fa-download"></i> Download
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
