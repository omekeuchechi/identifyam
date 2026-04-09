import React, { useState } from 'react';
import { usePage, Head } from '@inertiajs/react';

const AdminSystemLogs = ({ logs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLogs, setFilteredLogs] = useState(logs || []);

    useState(() => {
        if (logs) {
            setFilteredLogs(logs);
        }
    }, [logs]);

    useState(() => {
        if (searchTerm) {
            const filtered = logs.filter(log => 
                log.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredLogs(filtered);
        } else {
            setFilteredLogs(logs || []);
        }
    }, [searchTerm, logs]);

    const getLogLevel = (logLine) => {
        if (logLine.includes('ERROR')) return 'error';
        if (logLine.includes('WARNING')) return 'warning';
        if (logLine.includes('INFO')) return 'info';
        return 'info';
    };

    const formatLogLine = (logLine, index) => {
        const logLevel = getLogLevel(logLine);
        const timestamp = logLine.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/)?.[1] || '';
        const message = logLine.replace(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] .*?:? (.*)/, '$1') || logLine;

        return (
            <tr key={index} className={`log-row ${logLevel}`}>
                <td className="log-timestamp">{timestamp}</td>
                <td className="log-level">
                    <span className={`level-badge ${logLevel}`}>{logLevel.toUpperCase()}</span>
                </td>
                <td className="log-message">{message}</td>
            </tr>
        );
    };

    return (
        <>
            <Head title="System Logs - Admin" />

            <div className="admin-page">
                <div className="admin-header">
                    <h2>System Logs</h2>
                    <div className="admin-actions">
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button className="btn btn-secondary">
                            <i className="fas fa-download"></i>
                            Download Logs
                        </button>
                    </div>
                </div>

                <div className="logs-container">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Level</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((logLine, index) => formatLogLine(logLine, index))}
                        </tbody>
                    </table>
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

                .admin-actions {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .search-input {
                    padding: 10px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    width: 300px;
                }

                .search-input:focus {
                    border-color: #10b981;
                    outline: none;
                }

                .logs-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .logs-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                }

                .logs-table th {
                    background: #f8fafc;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 2px solid #e5e7eb;
                }

                .logs-table td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #f3f4f6;
                    vertical-align: top;
                    line-height: 1.4;
                }

                .log-row:hover {
                    background: #f9fafb;
                }

                .log-timestamp {
                    color: #6b7280;
                    font-weight: 500;
                    white-space: nowrap;
                    width: 150px;
                }

                .log-level {
                    width: 80px;
                    text-align: center;
                }

                .level-badge {
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .level-badge.error {
                    background: #dc2626;
                    color: white;
                }

                .level-badge.warning {
                    background: #f59e0b;
                    color: white;
                }

                .level-badge.info {
                    background: #10b981;
                    color: white;
                }

                .log-message {
                    font-family: 'Courier New', monospace;
                    word-break: break-word;
                }
            `}</style>
        </>
    );
};

export default AdminSystemLogs;
