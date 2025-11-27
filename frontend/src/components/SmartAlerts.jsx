import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const SmartAlerts = ({ alerts }) => {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="card flex items-center gap-4 p-4">
                <div className="p-3 rounded-full bg-secondary-gradient text-white">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <h3 className="font-bold">All Good!</h3>
                    <p className="text-sm text-muted">No upcoming renewals in the next 7 days.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
                <div key={alert.id} className="card flex items-center justify-between p-4" style={{
                    borderLeft: alert.type === 'urgent' ? '4px solid var(--accent)' : '4px solid var(--primary)',
                    background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.05) 0%, rgba(255,255,255,0) 100%)'
                }}>
                    <div className="flex items-center gap-4">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: alert.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            {alert.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">{alert.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted">
                                <Clock size={14} />
                                <span>Renewing in {alert.daysLeft} days</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="font-bold text-lg">₹{alert.monthlyCost}</div>
                        <button className="text-xs text-primary font-bold hover:underline">Review</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SmartAlerts;
