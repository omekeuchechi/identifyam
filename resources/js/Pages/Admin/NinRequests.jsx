import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';

const AdminNinRequests = ({ requests }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRequests, setFilteredRequests] = useState(requests?.data || []);

    useEffect(() => {
        if (requests?.data) {
            setFilteredRequests(requests.data);
        }
    }, [requests]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = requests.data.filter(req => 
                req.nin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRequests(filtered);
        } else {
            setFilteredRequests(requests.data || []);
        }
    }, [searchTerm, requests]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <>
            <Head title="NIN Requests - Admin" />

            <div className="admin-page">
                <div className="admin-header">
                    <h2>NIN Verification Requests</h2>
                    <div className="admin-actions">
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <Link href={route('admin.nin.requests', {}, false)} className="btn btn-primary">
                            <i className="fas fa-refresh"></i> Refresh
                        </Link>
                    </div>
                </div>

                <div className="requests-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NIN</th>
                                <th>User</th>
                                <th>API Version</th>
                                <th>Search Type</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(request => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.nin || 'N/A'}</td>
                                    <td>{request.user?.name || 'N/A'}</td>
                                    <td>{request.api_version || 'N/A'}</td>
                                    <td>{request.search_type || 'N/A'}</td>
                                    <td>{formatDate(request.created_at)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn btn-sm btn-primary">
                                                <i className="fas fa-eye"></i>
                                                View
                                            </button>
                                            <button className="btn btn-sm btn-secondary">
                                                <i className="fas fa-download"></i>
                                                Download
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {requests?.links && (
                        <div className="pagination">
                            {requests.links.map((link, index) => (
                                <Link 
                                    key={index}
                                    href={link.url || '#'}
                                    className={link.active ? 'pagination-link active' : 'pagination-link'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
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

                .requests-table-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
                    color: #374151;
                    border-bottom: 2px solid #e5e7eb;
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f3f4f6;
                }

                .admin-table tr:hover {
                    background: #f9fafb;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }

                .pagination-link {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    text-decoration: none;
                    color: #374151;
                }

                .pagination-link.active {
                    background: #10b981;
                    color: white;
                }

                .pagination-link:hover {
                    background: #f3f4f6;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .btn-sm {
                    padding: 6px 12px;
                    font-size: 12px;
                }

                .btn-secondary {
                    background: #6b7280;
                    color: white;
                }

                .btn-primary {
                    background: #059669;
                    color: white;
                }
            `}</style>
        </>
    );
};

export default AdminNinRequests;
