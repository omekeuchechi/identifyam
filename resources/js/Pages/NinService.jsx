import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function NinService({ auth }) {
    const [searchType, setSearchType] = useState('nin');
    const [apiVersion, setApiVersion] = useState('search1');
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [showResults, setShowResults] = useState(false);
    
    // Demographic form fields
    const [surname, setSurname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');

    const apiEndpoints = {
        search1: {
            nin: '/api/nin/search1',
            phone: '/api/nin/search-by-phone1'
        },
        search2: {
            nin: '/api/nin/search2',
            phone: '/api/nin/search-by-phone2'
        },
        search3: {
            nin: '/api/nin/search3',
            phone: '/api/nin/search-by-phone3'
        },
        search4: {
            nin: '/api/nin/search4',
            phone: '/api/nin/search-by-phone4'
        },
        demographic: {
            nin: '/api/nin/search-demographic',
            phone: null
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const endpoint = apiEndpoints[apiVersion][searchType];
            
            if (!endpoint) {
                throw new Error('Invalid search configuration');
            }

            let payload;
            if (apiVersion === 'demographic') {
                payload = {
                    surname: surname,
                    first_name: firstName,
                    birth_date: birthDate,
                    gender: gender
                };
            } else {
                payload = searchType === 'nin' 
                    ? { nin: inputValue }
                    : { phone: inputValue };
            }

            console.log('Sending payload:', payload); // Debug log

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            console.log('API Response:', data); // Debug log

            if (response.ok) {
                setResult(data);
                setShowResults(true);
            } else {
                // Handle different error types
                let errorMessage = 'Search failed';
                
                if (data.error) {
                    errorMessage = data.error;
                } else if (data.message) {
                    errorMessage = data.message;
                }
                
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Search error:', err); // Debug log
            setError(err.message || 'An error occurred during search');
        } finally {
            setLoading(false);
        }
    };

    const formatResultData = (data, version) => {
        if (!data) return null;

        switch (version) {
            case 'search1':
                return {
                    nin: data.nin,
                    surname: data.surname,
                    firstName: data.firstname,
                    phone: data.telephoneno,
                    birthDate: data.birthdate,
                    gender: data.gender,
                    email: data.email,
                    religion: data.religion,
                    title: data.title,
                    maritalStatus: data.maritalstatus,
                    trackingId: data.trackingId,
                    photo: data.photo,
                    signature: data.signature
                };

            case 'search2':
                return {
                    nin: data.idNumber,
                    surname: data.lastName,
                    firstName: data.firstName,
                    middleName: data.middleName,
                    phone: data.mobile,
                    birthDate: data.dateOfBirth,
                    gender: data.gender,
                    email: data.email,
                    religion: data.religion,
                    country: data.country,
                    validationPassed: data.allValidationPassed,
                    trackingId: data.id,
                    photo: data.image,
                    signature: data.signature
                };

            case 'search3':
                return {
                    nin: data.nin,
                    surname: data.surname,
                    firstName: data.firstname,
                    phone: data.telephoneno,
                    birthDate: data.birthdate,
                    gender: data.gender,
                    email: data.email,
                    religion: data.religion,
                    title: data.title,
                    maritalStatus: data.maritalstatus,
                    trackingId: data.trackingId,
                    photo: data.photo,
                    signature: data.signature
                };

            case 'search4':
                return {
                    nin: data.idNumber,
                    surname: data.lastName,
                    firstName: data.firstName,
                    phone: data.mobile,
                    birthDate: data.dateOfBirth,
                    gender: data.gender,
                    religion: data.religion,
                    title: data.title,
                    maritalStatus: data.maritalstatus,
                    trackingId: data.trackingId,
                    lga: data.address?.lga,
                    photo: data.photo,
                    signature: data.signature
                };

            case 'demographic':
                console.log('Demographic API data:', data); // Debug log
                if (data.surname && data.first_name) {
                    return {
                        nin: data.nin || 'N/A',
                        surname: data.surname,
                        firstName: data.first_name,
                        middleName: data.middlename || data.middle_name || '',
                        phone: data.phone || data.telephoneno || 'N/A',
                        birthDate: data.birth_date || data.birthdate || 'N/A',
                        gender: data.gender || 'N/A',
                        email: data.email || 'N/A',
                        religion: data.religion || 'N/A',
                        title: data.title || 'N/A',
                        maritalStatus: data.marital_status || data.maritalstatus || 'N/A',
                        trackingId: data.trackingId || data.trackingid || 'N/A',
                        photo: data.photo || null,
                        signature: data.signature || null,
                        // Add null placeholders for demographic fields that aren't returned
                        batchId: null,
                        birthCountry: null,
                        birthLGA: null,
                        birthState: null,
                        cardStatus: null,
                        centralID: null,
                        educationLevel: null,
                        employmentStatus: null,
                        height: null,
                        residenceAddress: null,
                        residenceTown: null,
                        residenceLGA: null,
                        residenceState: null,
                        residenceStatus: null,
                        nextOfKin: null,
                        parents: null,
                        languages: null
                    };
                }
                // Fallback to original structure if full demographic data is returned
                return {
                    nin: data.nin || 'N/A',
                    surname: data.surname || 'N/A',
                    firstName: data.firstname || data.first_name || 'N/A',
                    middleName: data.middlename || '',
                    phone: data.telephoneno || 'N/A',
                    birthDate: data.birthdate || data.birth_date || 'N/A',
                    gender: data.gender || 'N/A',
                    email: data.email || 'N/A',
                    religion: data.religion || 'N/A',
                    title: data.title || 'N/A',
                    maritalStatus: data.maritalstatus || 'N/A',
                    trackingId: data.trackingId || 'N/A',
                    photo: data.photo || null,
                    signature: data.signature || null,
                    batchId: data.batchid || null,
                    birthCountry: data.birthcountry || null,
                    birthLGA: data.birthlga || null,
                    birthState: data.birthstate || null,
                    cardStatus: data.cardstatus || null,
                    centralID: data.centralID || null,
                    educationLevel: data.educationallevel || null,
                    employmentStatus: data.emplymentstatus || null,
                    height: data.heigth || null,
                    residenceAddress: data.residence_AdressLine1 || null,
                    residenceTown: data.residence_Town || null,
                    residenceLGA: data.residence_lga || null,
                    residenceState: data.residence_state || null,
                    residenceStatus: data.residencestatus || null,
                    nextOfKin: {
                        firstName: data.nok_firstname || null,
                        surname: data.nok_surname || null,
                        address: data.nok_address1 || null,
                        lga: data.nok_lga || null,
                        state: data.nok_state || null,
                        town: data.nok_town || null
                    },
                    parents: {
                        firstName: data.pfirstname || null,
                        middleName: data.pmiddlename || null,
                        surname: data.psurname || null
                    },
                    languages: {
                        native: data.nspokenlang || null,
                        other: data.ospokenlang || null
                    }
                };

            default:
                return data;
        }
    };

    const getResultData = () => {
        if (!result || !result.data) return null;
        
        const data = result.data.data || result.data;
        console.log('Raw API Response:', result); // Debug log
        console.log('Processed Data:', data); // Debug log
        return formatResultData(data, apiVersion);
    };

    const resetForm = () => {
        setInputValue('');
        setSurname('');
        setFirstName('');
        setBirthDate('');
        setGender('');
        setResult(null);
        setError('');
        setShowResults(false);
    };

    return (
        <>
            <Head title="NIN Services" />

            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-image">
                    </div>
                    <span>IDENTIFYAM</span>
                </div>

                <nav className="sidebar-menu">
                    <Link href={route('dashboard')} className="sidebar-link">
                        <i className="fas fa-home"></i>Dashboard
                    </Link>
                    <Link href={route('nin.service')} className="sidebar-link active">
                        <i className="fas fa-id-card"></i> NIN Services
                    </Link>
                    <Link href={route('exam.cards')} className="sidebar-link">
                        <i className="fas fa-credit-card"></i> Exam Cards
                    </Link>
                    <Link href={route('funding')} className="sidebar-link">
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
                        <h3>NIN Services</h3>

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
                            <h3>National Identity Number Verification</h3>
                            <p>Verify NIN details using multiple search methods and API versions</p>

                            <form onSubmit={handleSearch} className="nin-search-form">
                                <div className="search-options">
                                    <div className="option-group">
                                        <label>Search Type</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    value="nin"
                                                    checked={searchType === 'nin'}
                                                    onChange={(e) => setSearchType(e.target.value)}
                                                />
                                                <span>NIN Number</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    value="phone"
                                                    checked={searchType === 'phone'}
                                                    onChange={(e) => setSearchType(e.target.value)}
                                                />
                                                <span>Phone Number</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="option-group">
                                        <label>API Version</label>
                                        <select
                                            value={apiVersion}
                                            onChange={(e) => setApiVersion(e.target.value)}
                                            className="api-select"
                                        >
                                            <option value="search1">Search API 1</option>
                                            <option value="search2">Search API 2</option>
                                            <option value="search3">Search API 3</option>
                                            <option value="search4">Search API 4</option>
                                            <option value="demographic">Demographic Search</option>
                                        </select>
                                    </div>
                                </div>

                                {apiVersion === 'demographic' ? (
                                    <div className="demographic-inputs">
                                        <div className="input-row">
                                            <div className="input-group">
                                                <label>Surname</label>
                                                <input
                                                    type="text"
                                                    value={surname}
                                                    onChange={(e) => setSurname(e.target.value)}
                                                    placeholder="Enter surname"
                                                    required
                                                    className="search-input"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>First Name</label>
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
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
                                                    value={birthDate}
                                                    onChange={(e) => setBirthDate(e.target.value)}
                                                    required
                                                    className="search-input"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Gender</label>
                                                <select
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                    required
                                                    className="search-input"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="m">Male</option>
                                                    <option value="f">Female</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="input-group">
                                        <label>
                                            {searchType === 'nin' ? 'Enter NIN Number' : 'Enter Phone Number'}
                                        </label>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={searchType === 'nin' ? 'Enter 11-digit NIN' : 'Enter phone number'}
                                            pattern={searchType === 'nin' ? '[0-9]{11}' : '[0-9]{11}'}
                                            maxLength={searchType === 'nin' ? 11 : 11}
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
                                    <PrimaryButton 
                                        type="submit" 
                                        disabled={loading}
                                        style={{ 
                                            background: 'linear-gradient(135deg, #0B6B3A 0%, #10B981 70.71%)', 
                                            color: '#fff', 
                                            padding: '13px 30px', 
                                            border: 'none', 
                                            borderRadius: '8px' 
                                        }}
                                    >
                                        {loading ? 'Searching...' : 'Search NIN'}
                                    </PrimaryButton>
                                    
                                    {showResults && (
                                        <button 
                                            type="button" 
                                            className="reset-btn"
                                            onClick={resetForm}
                                        >
                                            Clear Results
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Results Display */}
                        {showResults && result && (
                            <div className="nin-results-card">
                                <h3>Verification Results</h3>
                                
                                {result.data ? (
                                    <div className="results-content">
                                        {(() => {
                                            const data = getResultData();
                                            if (!data) return <p>No data available</p>;

                                            return (
                                                <div className="result-grid">
                                                    {/* Basic Information */}
                                                    <div className="result-section">
                                                        <h4>Basic Information</h4>
                                                        <p>{data.nin}</p>
                                                        <div className="info-grid">
                                                            <div className="info-item">
                                                                <label>NIN:</label>
                                                                <span>{data.nin || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Full Name:</label>
                                                                <span>{data.firstName} {data.middleName || ''} {data.surname}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Phone:</label>
                                                                <span>{data.phone || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Email:</label>
                                                                <span>{data.email || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Date of Birth:</label>
                                                                <span>{data.birthDate || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Gender:</label>
                                                                <span>{data.gender || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Marital Status:</label>
                                                                <span>{data.maritalStatus || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Religion:</label>
                                                                <span>{data.religion || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Title:</label>
                                                                <span>{data.title || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Additional Information */}
                                                    {(apiVersion === 'search2' || apiVersion === 'demographic') && (
                                                        <div className="result-section">
                                                            <h4>Additional Information</h4>
                                                            <div className="info-grid">
                                                                {data.country && (
                                                                    <div className="info-item">
                                                                        <label>Country:</label>
                                                                        <span>{data.country}</span>
                                                                    </div>
                                                                )}
                                                                {data.validationPassed !== undefined && (
                                                                    <div className="info-item">
                                                                        <label>Validation Status:</label>
                                                                        <span className={`status-badge ${data.validationPassed ? 'success' : 'failed'}`}>
                                                                            {data.validationPassed ? 'Passed' : 'Failed'}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {data.lga && (
                                                                    <div className="info-item">
                                                                        <label>LGA:</label>
                                                                        <span>{data.lga}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Demographic Information */}
                                                    {apiVersion === 'demographic' && data && (
                                                        <div className="result-section">
                                                            <h4>Demographic Information</h4>
                                                            <div className="info-grid">
                                                                {data.batchId && (
                                                                    <div className="info-item">
                                                                        <label>Batch ID:</label>
                                                                        <span>{data.batchId}</span>
                                                                    </div>
                                                                )}
                                                                {data.birthCountry && (
                                                                    <div className="info-item">
                                                                        <label>Birth Country:</label>
                                                                        <span>{data.birthCountry}</span>
                                                                    </div>
                                                                )}
                                                                {data.birthLGA && (
                                                                    <div className="info-item">
                                                                        <label>Birth LGA:</label>
                                                                        <span>{data.birthLGA}</span>
                                                                    </div>
                                                                )}
                                                                {data.birthState && (
                                                                    <div className="info-item">
                                                                        <label>Birth State:</label>
                                                                        <span>{data.birthState}</span>
                                                                    </div>
                                                                )}
                                                                {data.cardStatus && (
                                                                    <div className="info-item">
                                                                        <label>Card Status:</label>
                                                                        <span>{data.cardStatus}</span>
                                                                    </div>
                                                                )}
                                                                {data.centralID && (
                                                                    <div className="info-item">
                                                                        <label>Central ID:</label>
                                                                        <span>{data.centralID}</span>
                                                                    </div>
                                                                )}
                                                                {data.educationLevel && (
                                                                    <div className="info-item">
                                                                        <label>Education Level:</label>
                                                                        <span>{data.educationLevel}</span>
                                                                    </div>
                                                                )}
                                                                {data.employmentStatus && (
                                                                    <div className="info-item">
                                                                        <label>Employment Status:</label>
                                                                        <span>{data.employmentStatus}</span>
                                                                    </div>
                                                                )}
                                                                {data.height && (
                                                                    <div className="info-item">
                                                                        <label>Height:</label>
                                                                        <span>{data.height}</span>
                                                                    </div>
                                                                )}
                                                                {data.residenceAddress && (
                                                                    <div className="info-item full-width">
                                                                        <label>Residence Address:</label>
                                                                        <span>{data.residenceAddress}</span>
                                                                    </div>
                                                                )}
                                                                {data.residenceTown && (
                                                                    <div className="info-item">
                                                                        <label>Residence Town:</label>
                                                                        <span>{data.residenceTown}</span>
                                                                    </div>
                                                                )}
                                                                {data.residenceLGA && (
                                                                    <div className="info-item">
                                                                        <label>Residence LGA:</label>
                                                                        <span>{data.residenceLGA}</span>
                                                                    </div>
                                                                )}
                                                                {data.residenceState && (
                                                                    <div className="info-item">
                                                                        <label>Residence State:</label>
                                                                        <span>{data.residenceState}</span>
                                                                    </div>
                                                                )}
                                                                {data.residenceStatus && (
                                                                    <div className="info-item">
                                                                        <label>Residence Status:</label>
                                                                        <span>{data.residenceStatus}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Next of Kin */}
                                                    {apiVersion === 'demographic' && data.nextOfKin && (
                                                        <div className="result-section">
                                                            <h4>Next of Kin</h4>
                                                            <div className="info-grid">
                                                                <div className="info-item">
                                                                    <label>Name:</label>
                                                                    <span>{data.nextOfKin.firstName} {data.nextOfKin.surname}</span>
                                                                </div>
                                                                {data.nextOfKin.address && (
                                                                    <div className="info-item full-width">
                                                                        <label>Address:</label>
                                                                        <span>{data.nextOfKin.address}</span>
                                                                    </div>
                                                                )}
                                                                {data.nextOfKin.town && (
                                                                    <div className="info-item">
                                                                        <label>Town:</label>
                                                                        <span>{data.nextOfKin.town}</span>
                                                                    </div>
                                                                )}
                                                                {data.nextOfKin.lga && (
                                                                    <div className="info-item">
                                                                        <label>LGA:</label>
                                                                        <span>{data.nextOfKin.lga}</span>
                                                                    </div>
                                                                )}
                                                                {data.nextOfKin.state && (
                                                                    <div className="info-item">
                                                                        <label>State:</label>
                                                                        <span>{data.nextOfKin.state}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Parents Information */}
                                                    {apiVersion === 'demographic' && data.parents && (
                                                        <div className="result-section">
                                                            <h4>Parents Information</h4>
                                                            <div className="info-grid">
                                                                <div className="info-item">
                                                                    <label>Father's Name:</label>
                                                                    <span>{data.parents.firstName} {data.parents.middleName || ''} {data.parents.surname}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Languages */}
                                                    {apiVersion === 'demographic' && data.languages && (
                                                        <div className="result-section">
                                                            <h4>Languages</h4>
                                                            <div className="info-grid">
                                                                {data.languages.native && (
                                                                    <div className="info-item">
                                                                        <label>Native Language:</label>
                                                                        <span>{data.languages.native}</span>
                                                                    </div>
                                                                )}
                                                                {data.languages.other && (
                                                                    <div className="info-item">
                                                                        <label>Other Language:</label>
                                                                        <span>{data.languages.other}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Images */}
                                                    {(data.photo || data.signature) && (
                                                        <div className="result-section">
                                                            <h4>Images</h4>
                                                            <div className="images-grid">
                                                                {data.photo && (
                                                                    <div className="image-item">
                                                                        <label>Photograph</label>
                                                                        <img src={data.photo} alt="NIN Photograph" className="nin-image" />
                                                                    </div>
                                                                )}
                                                                {data.signature && (
                                                                    <div className="image-item">
                                                                        <label>Signature</label>
                                                                        <img src={data.signature} alt="Signature" className="nin-image" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Tracking Information */}
                                                    <div className="result-section">
                                                        <h4>Tracking Information</h4>
                                                        <div className="info-grid">
                                                            <div className="info-item">
                                                                <label>Tracking ID:</label>
                                                                <span>{data.trackingId || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Search Status:</label>
                                                                <span className={`status-badge success`}>
                                                                    Success
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
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
        </>
    );
}