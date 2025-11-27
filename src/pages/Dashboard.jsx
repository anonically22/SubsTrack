import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Link } from 'react-router-dom';
import { format, parseISO, addMonths } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ArrowRight, CreditCard, MoreHorizontal, Bell } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { subscriptions, getAnalytics } = useSubscriptions();
    const { totalMonthlySpend } = getAnalytics();

    // Mock data for the "Spending" bar chart
    const barData = {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
            {
                label: 'Spending',
                data: [1200, 1500, 1100, 1800, totalMonthlySpend],
                backgroundColor: (context) => {
                    return context.dataIndex === 4 ? '#4B6BFB' : '#10B981';
                },
                borderRadius: 4,
                barThickness: 12,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#6B7280' } },
            y: { display: false },
        },
    };

    // Upcoming Renewals
    const upcomingRenewals = [...subscriptions]
        .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
        .slice(0, 3);

    // Recent Subscriptions (Mock list)
    const recentSubs = subscriptions.slice(0, 3);

    return (
        <div className="dashboard-container">
            {/* Main Dashboard Area */}
            <div className="dashboard-main">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Spending</h2>
                    <MoreHorizontal className="text-muted" />
                </div>

                {/* Top Row: Spending Chart & My Subscription Summary */}
                <div className="charts-grid">
                    {/* Spending Chart Card */}
                    <div className="card" style={{ height: '280px', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-3xl font-bold">₹{totalMonthlySpend}</h3>
                                <p className="text-muted text-sm">Total Monthly Spend</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-xs text-muted">w</span>
                                <span className="text-xs text-main font-bold">m</span>
                                <span className="text-xs text-muted">y</span>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    {/* My Subscription Summary */}
                    <div className="card" style={{ height: '280px' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">My Subscription</h3>
                            <MoreHorizontal size={16} className="text-muted" />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted">Active</span>
                                <span className="font-bold">{subscriptions.length}</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: '60%', backgroundColor: '#4B6BFB' }}></div>
                                <div style={{ width: '25%', backgroundColor: '#10B981' }}></div>
                                <div style={{ width: '15%', backgroundColor: '#F59E0B' }}></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-muted">
                                <div className="flex items-center gap-1"><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4B6BFB' }}></div>Productivity</div>
                                <div className="flex items-center gap-1"><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></div>Social</div>
                                <div className="flex items-center gap-1"><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }}></div>Ent.</div>
                            </div>
                        </div>

                        {/* Mock Credit Card Mini */}
                        <div style={{ background: 'linear-gradient(135deg, #1F2937, #111827)', padding: '1rem', borderRadius: '12px', color: 'white' }}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-muted">HDFC Bank</span>
                                <CreditCard size={16} />
                            </div>
                            <div className="text-lg font-mono mb-1">**** **** **** 4242</div>
                            <div className="flex justify-between text-xs text-muted">
                                <span>User Name</span>
                                <span>12/25</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Payment Section */}
                <h3 className="text-lg font-bold mb-4">Next Payment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {upcomingRenewals.map(sub => (
                        <div key={sub.id} className="card" style={{ padding: '1.25rem' }}>
                            <div className="flex justify-between items-start mb-4">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                    {sub.name.charAt(0)}
                                </div>
                                <ArrowRight size={16} className="text-muted" />
                            </div>
                            <h4 className="font-bold text-lg mb-1">{sub.name}</h4>
                            <p className="text-xs text-muted mb-4">{sub.category} Plan</p>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">₹{sub.monthlyCost}</span>
                                <div className="badge badge-active" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                                    {Math.ceil((new Date(sub.renewalDate) - new Date()) / (1000 * 60 * 60 * 24))} Days Left
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Subscriptions List */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Recent Subscription</h3>
                        <MoreHorizontal size={16} className="text-muted" />
                    </div>
                    <div className="flex flex-col gap-4">
                        {recentSubs.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-input transition-colors">
                                <div className="flex items-center gap-4">
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                        {sub.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{sub.name}</h4>
                                        <p className="text-xs text-muted">Until {format(addMonths(parseISO(sub.renewalDate), 1), 'd MMM yyyy')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">₹{sub.monthlyCost}</div>
                                    <div className="text-xs text-muted">{sub.billingCycle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar (Details Panel) - Hidden on mobile via CSS */}
            <div className="dashboard-sidebar">
                <div className="flex justify-between items-center mb-8">
                    <Bell className="text-muted" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">User Name</span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#374151' }}></div>
                    </div>
                </div>

                <h3 className="text-muted text-sm font-bold mb-4 uppercase tracking-wider">Details</h3>

                {/* Selected Subscription Detail (Mocking Spotify) */}
                <div style={{ background: 'linear-gradient(135deg, #1DB954, #191414)', borderRadius: '20px', padding: '1.5rem', color: 'white', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="flex justify-between items-center mb-6">
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="font-bold text-xl">S</span>
                            </div>
                            <ArrowRight />
                        </div>
                        <h2 className="text-2xl font-bold mb-1">Spotify</h2>
                        <p className="text-sm opacity-80">Music Player</p>
                    </div>
                    {/* Abstract circles */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: '150px', height: '150px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm text-muted mb-2">Details Plan</h4>
                    <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-body)', border: 'none' }}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">Family Plan</span>
                            <button className="text-xs text-primary font-bold bg-primary-light px-2 py-1 rounded">CHANGE</button>
                        </div>
                        <p className="text-xs text-muted">6 premium accounts</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-body)', border: 'none' }}>
                        <p className="text-xs text-muted mb-1">Active</p>
                        <p className="font-bold text-sm">Started at</p>
                        <p className="text-xs text-muted">Oct 24, 2021</p>
                    </div>
                    <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-body)', border: 'none' }}>
                        <p className="text-xs text-muted mb-1">12 days left</p>
                        <p className="font-bold text-sm">Ended at</p>
                        <p className="text-xs text-muted">Nov 24, 2021</p>
                    </div>
                </div>

                <div className="mt-auto">
                    <button className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }}>Renew Subscription</button>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
