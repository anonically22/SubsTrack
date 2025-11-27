import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubscriptions } from '../context/SubscriptionContext';
import { ArrowLeft } from 'lucide-react';

const AddEditSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { subscriptions, addSubscription, updateSubscription } = useSubscriptions();
    const isEditMode = !!id;

    const initialFormState = {
        name: '',
        category: 'OTT',
        monthlyCost: '',
        billingCycle: 'Monthly',
        renewalDate: '',
        color: '#2563EB',
        notes: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isEditMode) {
            const subToEdit = subscriptions.find(s => s.id === id);
            if (subToEdit) {
                setFormData(subToEdit);
            } else {
                navigate('/subscriptions');
            }
        }
    }, [id, isEditMode, subscriptions, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            updateSubscription(id, formData);
        } else {
            addSubscription(formData);
        }
        navigate('/subscriptions');
    };

    const categories = ['OTT', 'Telecom', 'Music', 'Cloud', 'EdTech', 'Food', 'Finance', 'Utilities', 'Other'];
    const billingCycles = ['Monthly', 'Quarterly', 'Yearly'];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-muted hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl md:text-2xl font-bold">{isEditMode ? 'Edit Subscription' : 'Add Subscription'}</h2>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6 md:gap-8">

                        {/* Service Details Section */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Service Details</h3>
                            <div className="form-group">
                                <label className="form-label">Service Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Netflix, Spotify"
                                />
                            </div>
                            <div className="grid-responsive" style={{ marginBottom: '0' }}>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label className="form-label">Category</label>
                                    <select
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label className="form-label">Color Tag</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            name="color"
                                            style={{ height: '42px', width: '100%', padding: '2px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'var(--bg-input)', cursor: 'pointer' }}
                                            value={formData.color}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Billing Details Section */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Billing Details</h3>
                            <div className="grid-responsive" style={{ marginBottom: '1.5rem' }}>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label className="form-label">Cost (₹)</label>
                                    <input
                                        type="number"
                                        name="monthlyCost"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.monthlyCost}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '0' }}>
                                    <label className="form-label">Billing Cycle</label>
                                    <select
                                        name="billingCycle"
                                        className="form-select"
                                        value={formData.billingCycle}
                                        onChange={handleChange}
                                    >
                                        {billingCycles.map(cycle => (
                                            <option key={cycle} value={cycle}>{cycle}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Next Renewal Date</label>
                                <input
                                    type="date"
                                    name="renewalDate"
                                    required
                                    className="form-input"
                                    value={formData.renewalDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">Additional Info</h3>
                            <div className="form-group">
                                <label className="form-label">Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    className="form-textarea"
                                    style={{ height: '120px', resize: 'none' }}
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Plan details, account info, etc."
                                />
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-border mt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {isEditMode ? 'Save Changes' : 'Add Subscription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditSubscription;
