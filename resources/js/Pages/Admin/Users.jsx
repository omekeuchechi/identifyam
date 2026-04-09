import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';

const AdminUsers = ({ users }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users?.data || []);

    useEffect(() => {
        if (users?.data) {
            setFilteredUsers(users.data);
        }
    }, [users]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = users.data.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users.data || []);
        }
    }, [searchTerm, users]);

    return (
        <>
            <Head title="Manage Users - Admin" />

            <div className="admin-page">
                <div className="admin-header">
                    <h2>Manage Users</h2>
                    <div className="admin-actions">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <Link href={route('admin.users', {}, false)} className="btn btn-primary">
                            <i className="fas fa-refresh"></i> Refresh
                        </Link>
                    </div>
                </div>

                <div className="users-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Roled</th>
                                <th>Wallet</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={user.isAdmin ? 'role-badge admin' : 'role-badge user'}>
                                            {user.isAdmin ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td>
                                        ₦ {user.walletAmount}
                                    </td>
                                    <td>{user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn btn-sm btn-secondary">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn btn-sm btn-danger">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users?.links && (
                        <div className="pagination">
                            {users.links.map((link, index) => (
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

                .users-table-container {
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

                .role-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .role-badge.admin {
                    background: #dc2626;
                    color: white;
                }

                .role-badge.user {
                    background: #10b981;
                    color: white;
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

                .btn-danger {
                    background: #dc2626;
                    color: white;
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
            `}</style>
        </>
    );
};

export default AdminUsers;
