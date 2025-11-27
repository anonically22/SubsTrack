import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const Subscriptions = () => {
    const { subscriptions, deleteSubscription } = useSubscriptions();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const categories = ['All', ...new Set(subscriptions.map(sub => sub.category))];

    const filteredSubs = subscriptions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || sub.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Subscriptions</h2>
                <Link to="/add" className="btn btn-primary">+ Add New</Link>
            </div>

            <div className="card" style={{ padding: '0' }}>
                {/* Filters Toolbar */}
                <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-4 flex-1">
                        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                            <Search className="text-muted" size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search subscriptions..."
                                className="form-input"
                                style={{ paddingLeft: '2.75rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Filter className="text-muted" size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <select
                                className="form-select"
                                style={{ paddingLeft: '2.75rem' }}
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="table-container" style={{ border: 'none', borderRadius: '0 0 8px 8px' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Plan</th>
                                <th>Status</th>
                                <th>Billing Cycle</th>
                                <th>Next Renewal</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubs.length > 0 ? (
                                filteredSubs.map((sub) => (
                                    <tr key={sub.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                                    {sub.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{sub.name}</div>
                                                    <div className="text-xs text-muted">{sub.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-muted">{sub.notes || 'Standard'}</td>
                                        <td><span className="badge badge-active">Active</span></td>
                                        <td className="text-muted">{sub.billingCycle}</td>
                                        <td>{format(parseISO(sub.renewalDate), 'MMM d, yyyy')}</td>
                                        <td className="font-bold">₹{sub.monthlyCost}</td>
                                        <td>
                                            <Link to={`/edit/${sub.id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <p className="text-muted">No subscriptions found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
