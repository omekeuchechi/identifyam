import React, { useState, useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const LagacyNin = ({ auth }) => {
    const { props } = usePage();
    const [formData, setFormData] = useState({
        nin: '',
        search_type: 'nin search by nin',
        api_version: 'v1',
        surName: '',
        firstName: '',
        dateOfBirth: '',
        gender: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [pdfDownloading, setPdfDownloading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('slip');

    // Auto-download PDF when results are available
    useEffect(() => {
        if (result && result.data && !pdfDownloading) {
            setPdfDownloading(true);
            // Show alert that PDF download is starting
            alert('Generating and downloading your NIN verification PDF...');
            downloadPDF();
        }
    }, [result]);

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

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify(formData)
            });

            // Check if response is HTML (redirect to login)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                setError('Session expired. Please login again.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Search failed');
                return;
            }

            const data = await response.json();
            setResult(data.data);
            
        } catch (err) {
            setError(err.message || 'An error occurred during search');
        } finally {
            setLoading(false);
        }
    };

    const formatImageSrc = (imageData) => {
        if (!imageData) return '';
        
        // If it's already a data URL, return as is
        if (imageData.startsWith('data:')) {
            return imageData;
        }
        
        // If it's raw base64, convert to data URL
        if (typeof imageData === 'string') {
            return `data:image/jpeg;base64,${imageData}`;
        }
        
        return '';
    };

    const downloadImage = (imageData, filename) => {
        try {
            // Check if imageData is valid base64
            if (!imageData || typeof imageData !== 'string') {
                throw new Error('Invalid image data');
            }

            // Handle both data URLs and raw base64
            let base64Data = imageData;
            if (imageData.startsWith('data:')) {
                base64Data = imageData.split(',')[1];
            }

            // Validate base64 string
            if (!base64Data || base64Data.length === 0) {
                throw new Error('Empty base64 data');
            }

            // Clean base64 string and decode
            const cleanBase64 = base64Data.replace(/[^A-Za-z0-9+/=]/g, '');
            const byteCharacters = atob(cleanBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            
            // Create download link
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

            const response = await fetch('/api/lagacy-nin/pdf', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    nin: result.data.data?.nin || formData.nin,
                    api_version: formData.api_version,
                    search_type: formData.search_type,
                    template_type: selectedTemplate
                })
            });

            // Check if response is HTML (redirect to login)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                setError('Session expired. Please login again.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'PDF generation failed');
                return;
            }

            // Get the PDF blob
            const pdfBlob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            const templateName = selectedTemplate === 'card' ? 'NIN-Card' : 'NIN-Slip';
            link.download = `${templateName}-${result.data.data?.nin || formData.nin}-${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            // Show success notification
            alert('✅ ' + templateName + ' PDF downloaded successfully!');

        } catch (err) {
            setError(err.message || 'Failed to generate PDF');
            alert('❌ Failed to generate PDF: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const formatResultData = (data) => {
        if (!data) return null;
        
        // Handle error responses
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
                <h3>Verification Results</h3>
                {console.log(data)}
                
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
                            <span>{data.data?.nin || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Full Name:</label>
                            <span>{data.data?.fullName || `${data.data?.surName || data.data?.surname || ''} ${data.data?.firstName || data.data?.firstname || ''} ${data.data?.middleName || data.data?.middlename || ''}`.trim() || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Phone:</label>
                            <span>{data.data?.telephoneno || data.data?.phone || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Email:</label>
                            <span>{data.data?.email || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Date of Birth:</label>
                            <span>{data.data?.dateOfBirth || data.data?.birthdate || data.data?.birth_date || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Gender:</label>
                            <span>{data.data?.gender || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Marital Status:</label>
                            <span>{data.data?.maritalstatus || data.data?.marital_status || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Religion:</label>
                            <span>{data.data?.religion || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Title:</label>
                            <span>{data.data?.title || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Tracking Information */}
                <div className="result-section">
                    <h4>Tracking Information</h4>
                    <div className="result-grid">
                        <div className="result-item">
                            <label>Tracking ID:</label>
                            <span>{data.data?.trackingId || data.data?.tracking_id || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <label>Title:</label>
                            <span>{data.data?.title || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Birth Information */}
                {(data.data?.birthCountry || data.data?.birthState) && (
                    <div className="result-section">
                        <h4>Birth Information</h4>
                        <div className="result-grid">
                            <div className="result-item">
                                <label>Birth Country:</label>
                                <span>{data.data?.birthCountry || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Birth State:</label>
                                <span>{data.data?.birthState || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Residence Information */}
                {(data.data?.residenceState || data.data?.residenceTown) && (
                    <div className="result-section">
                        <h4>Residence Information</h4>
                        <div className="result-grid">
                            <div className="result-item">
                                <label>Residence State:</label>
                                <span>{data.data?.residenceState || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Residence Town:</label>
                                <span>{data.data?.residenceTown || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Residential Address:</label>
                                <span>{data.data?.residentialAddress || 'N/A'}</span>
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
                                <span>{`${data.data.nextOfKin?.firstName || ''} ${data.data.nextOfKin?.middleName || ''} ${data.data.nextOfKin?.lastName || ''}`.trim() || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Next of Kin Address:</label>
                                <span>{data.data.nextOfKin?.residentialAddress || 'N/A'}</span>
                            </div>
                            <div className="result-item">
                                <label>Next of Kin LGA:</label>
                                <span>{data.data.nextOfKin?.lga || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Photos/Signatures */}
                {(data.data?.photo || data.data?.image || data.data?.signature) && (
                    <div className="result-section">
                        <h4>Media</h4>
                        <div className="media-grid">
                            {data.data?.photo && (
                                <div className="media-item">
                                    <label>Photo:</label>
                                    <img src={formatImageSrc(data.data.photo)} alt="Passport Photo" className="result-image" />
                                    <button 
                                        onClick={() => downloadImage(data.data.photo, 'passport-photo')}
                                        className="btn btn-sm btn-primary mt-2"
                                    >
                                        <i className="fas fa-download"></i> Download Photo
                                    </button>
                                </div>
                            )}
                            {data.data?.image && (
                                <div className="media-item">
                                    <label>Image:</label>
                                    <img src={formatImageSrc(data.data.image)} alt="Image" className="result-image" />
                                    <button 
                                        onClick={() => downloadImage(data.data.image, 'image')}
                                        className="btn btn-sm btn-primary mt-2"
                                    >
                                        <i className="fas fa-download"></i> Download Image
                                    </button>
                                </div>
                            )}
                            {data.data?.signature && (
                                <div className="media-item">
                                    <label>Signature:</label>
                                    <img src={formatImageSrc(data.data.signature)} alt="Signature" className="result-image" />
                                    <button 
                                        onClick={() => downloadImage(data.data.signature, 'signature')}
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
                {data.data?.all_validation_passed !== undefined && (
                    <div className="result-section">
                        <h4>Validation Status</h4>
                        <div className="result-item">
                            <label>All Validation Passed:</label>
                            <span className={data.data?.all_validation_passed ? 'status-success' : 'status-error'}>
                                {data.data?.all_validation_passed ? 'Yes' : 'No'}
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
            
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Lagacy NIN Verification Service</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <form onSubmit={handleSubmit} className="nin-form">
                                            <div className="form-group">
                                                <label htmlFor="nin">NIN Number</label>
                                                <input
                                                    type="text"
                                                    id="nin"
                                                    name="nin"
                                                    value={formData.nin}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    placeholder="Enter NIN number"
                                                    disabled={formData.search_type === 'nin search by demographics'}
                                                    maxLength={11}
                                                />
                                                <small className="form-text text-muted">
                                                    Enter 11-digit NIN number (not required for demographic search)
                                                </small>
                                            </div>

                                            {/* Demographic Fields - Show only when demographic search is selected */}
                                            {formData.search_type === 'nin search by demographics' && (
                                                <div className="demographic-fields">
                                                    <div className="form-group">
                                                        <label htmlFor="surName">Surname</label>
                                                        <input
                                                            type="text"
                                                            id="surName"
                                                            name="surName"
                                                            value={formData.surName}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            placeholder="Enter surname"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="firstName">First Name</label>
                                                        <input
                                                            type="text"
                                                            id="firstName"
                                                            name="firstName"
                                                            value={formData.firstName}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            placeholder="Enter first name"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="dateOfBirth">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            id="dateOfBirth"
                                                            name="dateOfBirth"
                                                            value={formData.dateOfBirth}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="gender">Gender</label>
                                                        <select
                                                            id="gender"
                                                            name="gender"
                                                            value={formData.gender}
                                                            onChange={handleChange}
                                                            className="form-control"
                                                            required
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label htmlFor="search_type">Search Type</label>
                                                <select
                                                    id="search_type"
                                                    name="search_type"
                                                    value={formData.search_type}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    required
                                                >
                                                    <option value="nin search by nin">Basic Search</option>
                                                    <option value="nin search by phone">Phone</option>
                                                    <option value="nin search by demographic">Demographic Search</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="api_version">API Version</label>
                                                <select
                                                    id="api_version"
                                                    name="api_version"
                                                    value={formData.api_version}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    required
                                                >
                                                    <option value="v1">API v1</option>
                                                    <option value="v2">API v2</option>
                                                    <option value="v3">API v3</option>
                                                    <option value="v4">API v4</option>
                                                </select>
                                                <small className="form-text text-muted">
                                                    Try different versions if one is unavailable
                                                </small>
                                            </div>

                                            {error && (
                                                <div className="alert alert-danger">
                                                    {error}
                                                </div>
                                            )}

                                            <div className="form-actions">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary"
                                                    disabled={loading}
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
                                                    className="btn btn-secondary"
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
                                                    Clear
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="service-info">
                                            <h4>Service Information</h4>
                                            <ul>
                                                <li>Verify NIN details instantly</li>
                                                <li>Multiple search types available</li>
                                                <li>Secure and fast verification</li>
                                                <li>Comprehensive data retrieval</li>
                                            </ul>
                                            
                                            <div className="alert alert-info">
                                                <h5>Search Types:</h5>
                                                <ul className="mb-0">
                                                    <li><strong>Basic:</strong> Name, Phone, Email</li>
                                                    <li><strong>Detailed:</strong> Complete profile with photos</li>
                                                    <li><strong>Demographic:</strong> Demographic information only</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {result && (
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            {formatResultData(result)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .nin-form {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 8px;
                    display: block;
                }

                .form-control {
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    padding: 10px 15px;
                    font-size: 16px;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .form-control:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                    outline: 0;
                }

                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    transition: all 0.15s ease-in-out;
                }

                .btn-primary {
                    background-color: #007bff;
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background-color: #0056b3;
                }

                .btn-secondary {
                    background-color: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background-color: #545b62;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                    margin-right: 8px;
                }

                .service-info {
                    padding: 20px;
                    background: #e3f2fd;
                    border-radius: 8px;
                    border-left: 4px solid #2196f3;
                }

                .service-info h4 {
                    color: #1976d2;
                    margin-bottom: 15px;
                }

                .service-info ul {
                    margin-bottom: 20px;
                }

                .service-info li {
                    margin-bottom: 8px;
                }

                .result-container {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    margin-top: 20px;
                }

                .result-section {
                    margin-bottom: 30px;
                }

                .result-section h4 {
                    color: #495057;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 5px;
                }

                .template-selection {
                    background: #e8f4fd;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border: 1px solid #bee5eb;
                }

                .template-options {
                    display: flex;
                    gap: 20px;
                    margin-top: 10px;
                }

                .template-option {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    background: #fff;
                    transition: all 0.3s ease;
                    flex: 1;
                }

                .template-option:hover {
                    border-color: #007bff;
                    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
                }

                .template-option input[type="radio"] {
                    margin-right: 12px;
                }

                .template-option input[type="radio"]:checked + .template-preview {
                    color: #007bff;
                }

                .template-option input[type="radio"]:checked + .template-preview span {
                    font-weight: 600;
                }

                .template-preview {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .template-preview i {
                    font-size: 24px;
                    color: #6c757d;
                }

                .template-preview span {
                    font-size: 16px;
                    font-weight: 500;
                }

                .template-preview small {
                    display: block;
                    color: #6c757d;
                    font-size: 12px;
                    margin-top: 4px;
                    line-height: 1.3;
                }

                .result-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                }

                .result-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px;
                    background: white;
                    border-radius: 4px;
                    border: 1px solid #dee2e6;
                }

                .result-item label {
                    font-weight: 600;
                    color: #495057;
                }

                .result-item span {
                    color: #212529;
                }

                .media-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }

                .media-item {
                    text-align: center;
                }

                .media-item label {
                    display: block;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 10px;
                }

                .result-image {
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 4px;
                    border: 1px solid #dee2e6;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .status-success {
                    color: #28a745;
                    font-weight: 600;
                }

                .status-error {
                    color: #dc3545;
                    font-weight: 600;
                }

                .alert {
                    padding: 15px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                }

                .alert-danger {
                    background-color: #f8d7da;
                    border: 1px solid #f5c6cb;
                    color: #721c24;
                }

                .alert-info {
                    background-color: #d1ecf1;
                    border: 1px solid #bee5eb;
                    color: #0c5460;
                }

                .alert h5 {
                    margin-bottom: 10px;
                    color: inherit;
                }

                .demographic-fields {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border-left: 4px solid #007bff;
                }

                .demographic-fields .form-group {
                    margin-bottom: 15px;
                }

                .demographic-fields label {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 5px;
                    display: block;
                }
            `}</style>
        </>
    );
};

export default LagacyNin;
