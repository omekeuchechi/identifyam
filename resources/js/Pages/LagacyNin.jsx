import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';

const LagacyNin = ({ auth }) => {
    const { props } = usePage();
    const [formData, setFormData] = useState({
        nin: '',
        search_type: 'nin search by nin',
        api_version: 'v1',
        surName: '',
        firstName: '',
        dateOfBirth: '',
        gender: '',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [pdfDownloading, setPdfDownloading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('slip');

    // Keep session alive every 5 minutes
    useEffect(() => {
        const keepAliveInterval = setInterval(async () => {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                await fetch('/api/lagacy-nin/keep-alive', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
            } catch (err) {
                console.log('Session keep-alive failed:', err);
            }
        }, 5 * 60 * 1000); // 5 minutes
        
        return () => clearInterval(keepAliveInterval);
    }, []);

    // Remove auto-download - let user choose template first

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setResult(null);
        setPdfDownloading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!auth.user) {
            setError('Please login to use this service');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Determine API endpoint based on version
            let apiEndpoint = '/api/lagacy-nin/search';
            if (formData.api_version === 'v2') {
                apiEndpoint = '/api/lagacy-nin/v2/search';
            } else if (formData.api_version === 'v3') {
                apiEndpoint = '/api/lagacy-nin/v3/search';
            } else if (formData.api_version === 'v4') {
                apiEndpoint = '/api/lagacy-nin/v4/search';
            }

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(formData)
            });

            // Check if response is HTML (redirect to login)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                setError('Session expired. Please refresh the page and login again.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Search failed');
                return;
            }

            const data = await response.json();
            
            // Check if response is successful
            if (response.ok && data) {
                setResult(data);
            } else if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Search failed');
            } else {
                setError('Invalid response format received from server');
            }
            
        } catch (err) {
            setError(err.message || 'An error occurred during search');
        } finally {
            setLoading(false);
        }
    };

    const formatImageSrc = (imageData) => {
        if (!imageData) return '';
        
        if (imageData.startsWith('data:')) {
            return imageData;
        }
        
        if (typeof imageData === 'string') {
            return `data:image/jpeg;base64,${imageData}`;
        }
        
        return '';
    };

    const downloadImage = (imageData, filename) => {
        try {
            if (!imageData || typeof imageData !== 'string') {
                throw new Error('Invalid image data');
            }

            let base64Data = imageData;
            if (imageData.startsWith('data:')) {
                base64Data = imageData.split(',')[1];
            }

            if (!base64Data || base64Data.length === 0) {
                throw new Error('Empty base64 data');
            }

            const cleanBase64 = base64Data.replace(/[^A-Za-z0-9+/=]/g, '');
            const byteCharacters = atob(cleanBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
            alert('Failed to download image: ' + error.message);
        }
    };

    const downloadPDF = async () => {
    if (!result || !result.data) {
        setError('No verification results available for PDF generation');
        return;
    }

    try {
        setLoading(true);
        setError('');

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        const response = await fetch('/api/lagacy-nin/pdf', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json, application/pdf'
            },
            body: JSON.stringify({
                data: result.data,
                nin: result.data.data?.nin || formData.nin,
                api_version: formData.api_version,
                search_type: formData.search_type,
                template_type: selectedTemplate
            })
        });

        // Check if response is HTML (redirect to login)
        const contentType = response.headers.get('content-type');
        
        if (response.status === 401) {
            setError('Session expired. Please refresh the page and login again.');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return;
        }
        
        if (contentType && contentType.includes('text/html')) {
            setError('Session expired. Please refresh the page and login again.');
            return;
        }

        if (contentType && contentType.includes('application/json') && !response.ok) {
            const errorData = await response.json();
            setError(errorData.error || 'PDF generation failed');
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Get the response blob
        const responseBlob = await response.blob();
        
        // Determine file type and extension based on content type
        const responseContentType = responseBlob.type;
        const isPDF = responseContentType === 'application/pdf';
        const isHTML = responseContentType === 'text/html';
        
        // Check blob size
        if (responseBlob.size < 100) {
            throw new Error('Generated file is too small (possibly corrupted)');
        }
        
        // Create download link
        const url = window.URL.createObjectURL(responseBlob);
        const link = document.createElement('a');
        link.href = url;
        const templateName = selectedTemplate === 'card' ? 'NIN-Card' : 'NIN-Slip';
        const ninNumber = result.data.data?.nin || formData.nin;
        
        // Set appropriate filename and extension
        const fileExtension = isPDF ? '.pdf' : '.html';
        link.download = `${templateName}-${ninNumber}-${Date.now()}${fileExtension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL after a delay
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);

        // Show appropriate success message
        const fileType = isPDF ? 'PDF' : 'HTML';
        const additionalMessage = isHTML ? ' (PDF generation failed, HTML fallback provided)' : '';
        alert('✅ ' + templateName + ' ' + fileType + ' downloaded successfully!' + additionalMessage);
        setPdfDownloading(false);

    } catch (err) {
        console.error('PDF generation error:', err);
        setError(err.message || 'Failed to generate PDF');
        alert('❌ Failed to generate PDF: ' + (err.message || 'Unknown error'));
    } finally {
        setLoading(false);
    }
};

    const formatResultData = (data) => {
        if (!data) return null;
        
        if (data.status === 'failed' || data.status === 'error') {
            return (
                <div className="result-container">
                    <h3>API Response</h3>
                    <div className="alert alert-danger">
                        <h4>Error: {data.status}</h4>
                        <p>{data.message || 'An error occurred'}</p>
                    </div>
                </div>
            );
        }
        
        return (
            <div className="result-container">
                
                {/* PDF Template Selection */}
                <div className="result-section">
                    <h4>PDF Template Selection</h4>
                    <div className="template-selection">
                        <div className="form-group">
                            <label>Select PDF Template:</label>
                            <div className="template-options">
                                <label className="template-option">
                                    <input
                                        type="radio"
                                        name="template"
                                        value="slip"
                                        checked={selectedTemplate === 'slip'}
                                        onChange={(e) => setSelectedTemplate(e.target.value)}
                                    />
                                    <div className="template-preview">
                                        <i className="fas fa-file-alt"></i>
                                        <span>NIN Slip</span>
                                        <small>Traditional NIN slip format with official layout</small>
                                    </div>
                                </label>
                                <label className="template-option">
                                    <input
                                        type="radio"
                                        name="template"
                                        value="card"
                                        checked={selectedTemplate === 'card'}
                                        onChange={(e) => setSelectedTemplate(e.target.value)}
                                    />
                                    <div className="template-preview">
                                        <i className="fas fa-id-card"></i>
                                        <span>NIN Card</span>
                                        <small>Plastic card style with photo and details</small>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <button 
                            onClick={downloadPDF}
                            className="btn btn-success btn-lg"
                            disabled={loading}
                        >
                            <i className="fas fa-download"></i>
                            Download {selectedTemplate === 'card' ? 'NIN Card' : 'NIN Slip'} PDF
                        </button>
                    </div>
                </div>
                
                {/* Basic Information */}
                <div className="result-section">
                    <h4>Basic Information</h4>
                    <div className="result-grid">
                        <div className="result-item">
                            <label>NIN:</label>
                            <span>{data.data.data.nin || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Full Name:</label>
                            <span>{data.data.data.fullName || `${data.data.data.surName || data.data.data.surname || ''} ${data.data.data.firstName || data.data.data.firstname || ''} ${data.data.data.middleName || data.data.data.middlename || ''}`.trim() || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Phone:</label>
                            <span>{data.data.data.telephoneno || data.data.data.phone || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Email:</label>
                            <span>{data.data.data.email || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Date of Birth:</label>
                            <span>{data.data.data.dateOfBirth || data.data.data.birthdate || data.data.data.birth_date || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Gender:</label>
                            <span>{data.data.data.gender || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Marital Status:</label>
                            <span>{data.data.data.maritalstatus || data.data.data.marital_status || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Religion:</label>
                            <span>{data.data.data.religion || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Title:</label>
                            <span>{data.data.data.title || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Tracking Information */}
                <div className="result-section">
                    <h4>Tracking Information</h4>
                    <div className="result-grid">
                        <div className="result-item">
                            <label>Tracking ID:</label>
                            <span>{data.data.data.trackingId || data.data.data.tracking_id || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Title:</label>
                            <span>{data.data.data.title || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Birth Information */}
                {(data.data.data.birthCountry || data.data.data.birthState) && (
                    <div className="result-section">
                        <h4>Birth Information</h4>
                        <div className="result-grid">
                            <div className="result-item">
                                <label>Birth Country:</label>
                                <span>{data.data.data.birthCountry || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Birth State:</label>
                                <span>{data.data.data.birthState || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Residence Information */}
                {(data.data.residenceState || data.data.data.residenceTown) && (
                    <div className="result-section">
                        <h4>Residence Information</h4>
                        <div className="result-grid">
                            <div className="result-item">
                                <label>Residence State:</label>
                                <span>{data.data.data.residenceState || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Residence Town:</label>
                                <span>{data.data.data.residenceTown || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Residential Address:</label>
                                <span>{data.data.data.residentialAddress || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Next of Kin Information */}
                {data.data.nextOfKin && (
                    <div className="result-section">
                        <h4>Next of Kin Information</h4>
                        <div className="result-grid">
                            <div className="result-item">
                                <label>Next of Kin Name:</label>
                                <span>{`${data.data.data.nextOfKin?.firstName || ''} ${data.data.data.nextOfKin?.middleName || ''} ${data.data.data.nextOfKin?.lastName || ''}`.trim() || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Next of Kin Address:</label>
                                <span>{data.data.data.nextOfKin?.residentialAddress || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Next of Kin LGA:</label>
                                <span>{data.data.data.nextOfKin?.lga || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Photos/Signatures */}
                {(data.data.data.photo || data.data.data.image || data.data.data.signature) && (
                    <div className="result-section">
                        <h4>Media</h4>
                        <div className="media-grid">
                            {data.data.data.photo && (
                                <div className="media-item">
                                    <label>Photo:</label>
                                    <img src={formatImageSrc(data.data.data.photo)} alt="Passport Photo" className="result-image" />
                                    <button 
                                        onClick={() => downloadImage(data.data.data.photo, 'passport-photo')}
                                        className="btn btn-sm btn-primary mt-2"
                                    >
                                        <i className="fas fa-download"></i> Download Photo
                                    </button>
                                </div>
                            )}
                            {data.data.data.image && (
                                <div className="media-item">
                                    <label>Image:</label>
                                    <img src={formatImageSrc(data.data.data.image)} alt="Image" className="result-image" />
                                    <button 
                                        onClick={() => downloadImage(data.data.data.image, 'image')}
                                        className="btn btn-sm btn-primary mt-2"
                                    >
                                        <i className="fas fa-download"></i> Download Image
                                    </button>
                                </div>
                            )}
                            {data.data.data.signature && (
                                <div className="media-item">
                                    <label>Signature:</label>
                                    <img src={formatImageSrc(data.data.data.signature)} alt="Signature" className="result-image" />
                                    <button 
                                        onClick={() => downloadImage(data.data.data.signature, 'signature')}
                                        className="btn btn-sm btn-primary mt-2"
                                    >
                                        <i className="fas fa-download"></i> Download Signature
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {data.data.data.all_validation_passed !== undefined && (
                    <div className="result-section">
                        <h4>Validation Status</h4>
                        <div className="result-item">
                            <label>All Validation Passed:</label>
                            <span className={data.data.data.all_validation_passed ? 'status-success' : 'status-error'}>
                                {data.data.data.all_validation_passed ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title="Lagacy NIN Verification" />

            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <a href='/' className="sidebar-logo">
                        <div className="logo-image">
                        </div>
                        <span>IDENTIFYAM</span>
                    </a>

                    <nav className="sidebar-menu">
                        <Link href={route('dashboard')} className="sidebar-link">
                            <i className="fas fa-home"></i>Dashboard
                        </Link>
                        <Link href="/lagacy-nin" className="sidebar-link active">
                            <i className="fas fa-history"></i>NIN Service
                        </Link>
                        <Link href={route('exam.cards')} className="sidebar-link">
                            <i className="fas fa-credit-card"></i> Exam Cards
                        </Link>
                        <Link href={route('funding')} className="sidebar-link">
                            <i className="fas fa-wallet"></i>Wallet
                        </Link>
                        <Link href="history" className="sidebar-link">
                            <i className="fas fa-history"></i>History
                        </Link>
                        <Link href={route('settings')} className="sidebar-link">
                            <i className="fas fa-cog"></i>Settings
                        </Link>
                    </nav>
                </aside>

                {/* Main Area */}
                <div className="dashboard-main">
                    {/* Topbar */}
                    <header className="topbar">
                        <h3>Lagacy NIN Verification</h3>

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
                        {/* Search Form */}
                        <div className="nin-search-card">
                            <h3>Lagacy NIN Verification Service</h3>
                            <p>Verify NIN details using multiple search methods and API versions</p>

                            <form onSubmit={handleSubmit} className="nin-search-form">
                                <div className="search-options">
                                    <div className="option-group">
                                        <label>Search Type</label>
                                        <select
                                            value={formData.search_type}
                                            onChange={handleChange}
                                            name="search_type"
                                            className="api-select"
                                        >
                                            <option value="nin search by nin">Basic Search</option>
                                            <option value="nin search by phone">Phone</option>
                                            <option value="nin search by demographic">Demographic Search</option>
                                        </select>
                                    </div>

                                    <div className="option-group">
                                        <label>API Version</label>
                                        <select
                                            value={formData.api_version}
                                            onChange={handleChange}
                                            name="api_version"
                                            className="api-select"
                                        >
                                            <option value="v1">API v1</option>
                                            <option value="v2">API v2</option>
                                            <option value="v3">API v3</option>
                                            <option value="v4">API v4</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Demographic Fields - Show only when demographic search is selected */}
                                {formData.search_type === 'nin search by demographic' && (
                                    <div className="demographic-inputs">
                                        <div className="input-row">
                                            <div className="input-group">
                                                <label>Surname</label>
                                                <input
                                                    type="text"
                                                    value={formData.surName}
                                                    onChange={handleChange}
                                                    name="surName"
                                                    placeholder="Enter surname"
                                                    required
                                                    className="search-input"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>First Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    name="firstName"
                                                    placeholder="Enter first name"
                                                    required
                                                    className="search-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="input-row">
                                            <div className="input-group">
                                                <label>Birth Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    name="dateOfBirth"
                                                    required
                                                    className="search-input"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Gender</label>
                                                <select
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    name="gender"
                                                    required
                                                    className="search-input"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {formData.search_type !== 'nin search by demographic' && (
                                    <div className="input-group">
                                        <label>Enter NIN Number</label>
                                        <input
                                            type="text"
                                            value={formData.nin}
                                            onChange={handleChange}
                                            name="nin"
                                            placeholder="Enter 11-digit NIN"
                                            pattern="[0-9]{11}"
                                            maxLength={11}
                                            required
                                            className="search-input"
                                        />
                                    </div>
                                )}

                                {error && (
                                    <div className="error-message">
                                        <i className="fas fa-exclamation-circle"></i>
                                        {error}
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                        style={{ 
                                            background: 'linear-gradient(135deg, #0B6B3A 0%, #10B981 70.71%)', 
                                            color: '#fff', 
                                            padding: '13px 30px', 
                                            border: 'none', 
                                            borderRadius: '8px' 
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-search"></i>
                                                Search NIN
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        className="reset-btn"
                                        onClick={() => {
                                            setFormData({ 
                                                nin: '', 
                                                search_type: 'nin search by nin',
                                                api_version: 'v1',
                                                surName: '',
                                                firstName: '',
                                                dateOfBirth: '',
                                                gender: ''
                                            });
                                            setResult(null);
                                            setError('');
                                            setPdfDownloading(false);
                                        }}
                                    >
                                        Clear Results
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Results Display */}
                        {result && (
                            <div className="nin-results-card">
                                <h3>Verification Results</h3>
                                
                                {result.data ? (
                                    <div className="results-content">
                                        {formatResultData(result)}
                                    </div>
                                ) : (
                                    <div className="no-results">
                                        <i className="fas fa-search"></i>
                                        <p>No results found for the provided information</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .nin-search-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    margin-bottom: 25px;
                }

                .nin-search-card h3 {
                    color: #1f2937;
                    margin-bottom: 8px;
                    font-size: 24px;
                }

                .nin-search-card p {
                    color: #6b7280;
                    margin-bottom: 25px;
                }

                .nin-search-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .search-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .option-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #374151;
                }

                .api-select, .search-input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .api-select:focus, .search-input:focus {
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                    outline: 0;
                }

                .demographic-inputs {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .input-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #374151;
                    font-size: 14px;
                }

                .error-message {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                    padding: 12px 15px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .form-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 10px;
                }

                .reset-btn {
                    background: #6b7280;
                    color: white;
                    padding: 13px 25px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: background-color 0.15s ease-in-out;
                }

                .reset-btn:hover {
                    background: #4b5563;
                }

                .nin-results-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nin-results-card h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 24px;
                }

                .result-container {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                .result-section {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .result-section h4 {
                    color: #1f2937;
                    margin-bottom: 15px;
                    font-size: 18px;
                    font-weight: 600;
                    border-bottom: 2px solid #10b981;
                    padding-bottom: 8px;
                }

                .template-selection {
                    background: #ecfdf5;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #d1fae5;
                }

                .template-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin: 15px 0;
                }

                .template-option {
                    display: flex;
                    align-items: flex-start;
                    padding: 15px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .template-option:hover {
                    border-color: #10b981;
                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
                }

                .template-option input[type="radio"] {
                    margin-right: 12px;
                    margin-top: 2px;
                }

                .template-preview {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .template-preview i {
                    font-size: 24px;
                    color: #6b7280;
                }

                .template-preview span {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                }

                .template-preview small {
                    color: #6b7280;
                    font-size: 12px;
                    line-height: 1.4;
                }

                .result-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 15px;
                }

                .result-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 15px;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                }

                .result-item label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }

                .result-item span {
                    color: #1f2937;
                    font-size: 14px;
                    text-align: right;
                }

                .media-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }

                .media-item {
                    text-align: center;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .media-item label {
                    display: block;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 10px;
                }

                .result-image {
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .no-results {
                    text-align: center;
                    padding: 40px;
                    color: #6b7280;
                }

                .no-results i {
                    font-size: 48px;
                    margin-bottom: 15px;
                    color: #d1d5db;
                }

                .status-success {
                    color: #059669;
                    font-weight: 600;
                }

                .status-error {
                    color: #dc2626;
                    font-weight: 600;
                }

                .btn {
                    padding: 13px 25px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.15s ease-in-out;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-success {
                    background: #059669;
                    color: white;
                }

                .btn-success:hover:not(:disabled) {
                    background: #047857;
                }

                .btn-primary {
                    background: #059669;
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background: #047857;
                }

                .btn-sm {
                    padding: 8px 15px;
                    font-size: 12px;
                }

                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .search-options {
                        grid-template-columns: 1fr;
                    }
                    
                    .input-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .template-options {
                        grid-template-columns: 1fr;
                    }
                    
                    .result-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    );
};

export default LagacyNin;