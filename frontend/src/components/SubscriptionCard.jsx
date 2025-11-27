import React from 'react';
import { Calendar, CreditCard } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const SubscriptionCard = ({ subscription, onEdit, onDelete }) => {
    const { name, monthlyCost, category, renewalDate, color, billingCycle, notes } = subscription;

    return (
        <div className="card sub-card">
            <div
                className="sub-color-strip"
                style={{ backgroundColor: color }}
            />
            <div style={{ paddingLeft: '0.75rem' }}>
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="text-lg font-bold">{name}</h3>
                        <span className="badge badge-expired" style={{ marginTop: '0.25rem' }}>
                            {category}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p className="text-xl font-bold">₹{monthlyCost}</p>
                        <p className="text-xs text-muted">/{billingCycle === 'Monthly' ? 'mo' : billingCycle === 'Yearly' ? 'yr' : 'qtr'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted" style={{ marginTop: '0.75rem' }}>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{format(parseISO(renewalDate), 'MMM d, yyyy')}</span>
                    </div>
                    {notes && (
                        <div className="flex items-center gap-2" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <span title={notes}>{notes}</span>
                        </div>
                    )}
                </div>

                {(onEdit || onDelete) && (
                    <div className="flex gap-2 justify-end" style={{ marginTop: '1rem' }}>
                        {onEdit && (
                            <button
                                onClick={() => onEdit(subscription)}
                                className="btn btn-outline"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(subscription.id)}
                                className="btn btn-danger"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionCard;
