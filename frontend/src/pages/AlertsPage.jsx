import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useSubscriptions } from '../context/SubscriptionContext';

const AlertsPage = () => {
    const { getAlerts } = useSubscriptions();
    const alerts = getAlerts();

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold mb-1">Alerts Center</h1>
                    <p className="text-muted">Stay on top of your renewals and notifications.</p>
                </div>
                <button className="btn btn-outline text-sm">Mark all as read</button>
            </header>

            {/* Urgent Alerts */}
            {alerts.length > 0 && (
                <section>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-accent">
                        <AlertTriangle size={20} />
                        Urgent Attention Needed
                    </h3>
                    <div className="flex flex-col gap-4">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="card border-l-4 border-l-accent flex flex-col md:flex-row justify-between items-center gap-4 p-6">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: alert.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                        {alert.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl">{alert.name}</h4>
                                        <p className="text-muted">Renewing in {alert.daysLeft} days • ₹{alert.monthlyCost}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button className="btn btn-outline flex-1 md:flex-none">Snooze</button>
                                    <button className="btn btn-primary flex-1 md:flex-none">Pay Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Notifications */}
            <section>
                <h3 className="font-bold text-lg mb-4">Recent Notifications</h3>
                <div className="card p-0 overflow-hidden">
                    {[
                        { title: 'Payment Successful', desc: 'Netflix Premium was renewed successfully.', time: '2 hours ago', icon: CheckCircle, color: 'text-secondary' },
                        { title: 'Price Hike Alert', desc: 'Spotify is increasing prices by 10% next month.', time: 'Yesterday', icon: AlertTriangle, color: 'text-yellow-500' },
                        { title: 'New Login', desc: 'New login detected from Mac OS X.', time: '2 days ago', icon: Bell, color: 'text-primary' },
                        { title: 'Subscription Added', desc: 'Adobe Creative Cloud was added manually.', time: '3 days ago', icon: Calendar, color: 'text-muted' },
                    ].map((notif, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 border-b border-white/5 last:border-none hover:bg-input transition-colors">
                            <div className={`mt-1 ${notif.color}`}>
                                <notif.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">{notif.title}</h4>
                                <p className="text-sm text-muted">{notif.desc}</p>
                            </div>
                            <span className="text-xs text-dim whitespace-nowrap">{notif.time}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AlertsPage;
