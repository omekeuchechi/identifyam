import React, { useState } from 'react';
import { usePage, Head } from '@inertiajs/react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'IDENTIFYAM',
        siteDescription: 'NIN Verification System',
        maintenanceMode: false,
        emailNotifications: true,
        smsNotifications: false,
        maxDailyVerifications: 100,
        sessionTimeout: 120
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? value === 'on' : value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings');
            }
        } catch (err) {
            alert('Error saving settings: ' + err.message);
        }
    };

    return (
        <>
            <Head title="System Settings - Admin" />

            <div className="admin-page">
                <div className="admin-header">
                    <h2>System Settings</h2>
                    <button onClick={handleSave} className="btn btn-primary">
                        <i className="fas fa-save"></i>
                        Save Settings
                    </button>
                </div>

                <div className="settings-container">
                    <div className="settings-section">
                        <h3>General Settings</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Site Name</label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Site Description</label>
                                <textarea
                                    name="siteDescription"
                                    value={settings.siteDescription}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>System Configuration</h3>
                        <div className="form-grid">
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="maintenanceMode"
                                        checked={settings.maintenanceMode}
                                        onChange={handleChange}
                                    />
                                    <span>Maintenance Mode</span>
                                </label>
                                <small>Enable maintenance mode to disable user access</small>
                            </div>
                            <div className="form-group">
                                <label>Max Daily Verifications</label>
                                <input
                                    type="number"
                                    name="maxDailyVerifications"
                                    value={settings.maxDailyVerifications}
                                    onChange={handleChange}
                                    className="form-input"
                                    min="1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Session Timeout (minutes)</label>
                                <input
                                    type="number"
                                    name="sessionTimeout"
                                    value={settings.sessionTimeout}
                                    onChange={handleChange}
                                    className="form-input"
                                    min="5"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>Notification Settings</h3>
                        <div className="form-grid">
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="emailNotifications"
                                        checked={settings.emailNotifications}
                                        onChange={handleChange}
                                    />
                                    <span>Email Notifications</span>
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="smsNotifications"
                                        checked={settings.smsNotifications}
                                        onChange={handleChange}
                                    />
                                    <span>SMS Notifications</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .admin-page {
                    padding: 20px;
                }

                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .admin-header h2 {
                    margin: 0;
                    color: #1f2937;
                }

                .settings-container {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 25px;
                }

                .settings-section {
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .settings-section h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 18px;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 10px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #374151;
                    font-size: 14px;
                }

                .form-input, .form-textarea {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .form-input:focus, .form-textarea:focus {
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                    outline: 0;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }

                .checkbox-label input[type="checkbox"] {
                    margin: 0;
                }

                .checkbox-label small {
                    display: block;
                    color: #6b7280;
                    font-size: 12px;
                    margin-top: 4px;
                }

                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminSettings;
