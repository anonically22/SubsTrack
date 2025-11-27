import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Link } from 'react-router-dom';
import { format, parseISO, addMonths } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ArrowRight, CreditCard, MoreHorizontal, Bell, Zap, Wallet, TrendingUp } from 'lucide-react';
import RotatingCard from '../components/RotatingCard';
import SmartAlerts from '../components/SmartAlerts';
import SummaryCard from '../components/SummaryCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { subscriptions, getAnalytics, getAlerts } = useSubscriptions();
    const { totalMonthlySpend } = getAnalytics();
    const alerts = getAlerts();

    // Mock data for the "Spending" bar chart
    const barData = {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
            {
                label: 'Spending',
                data: [1200, 1500, 1100, 1800, totalMonthlySpend],
                backgroundColor: (context) => {
                    return context.dataIndex === 4 ? '#4B6BFB' : 'rgba(255, 255, 255, 0.1)';
                },
                borderRadius: 8,
                barThickness: 24,
                borderSkipped: false,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#A1A1AA', font: { family: 'Outfit' } }
            },
            y: { display: false },
        },
    };

    // Top Subscription for Rotating Card (Highest Cost)
    const topSubscription = [...subscriptions].sort((a, b) => b.monthlyCost - a.monthlyCost)[0];

    return (
        <div className="dashboard-container">
            {/* Main Dashboard Area */}
            <div className="dashboard-main">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold mb-1">Dashboard</h1>
                        <p className="text-muted">Welcome back to your financial command center.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-outline gap-2">
                            <Bell size={18} />
                            <span>Notifications</span>
                        </button>
                    </div>
                </header>

                {/* Summary Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <SummaryCard
                        title="Total Monthly Spend"
                        value={`₹${totalMonthlySpend}`}
                        icon={Wallet}
                        trend={12.5}
                        color="primary"
                    />
                    <SummaryCard
                        title="Active Subscriptions"
                        value={subscriptions.length}
                        icon={Zap}
                        subtitle="3 renewing soon"
                        color="secondary"
                    />
                    <SummaryCard
                        title="Projected Yearly"
                        value={`₹${totalMonthlySpend * 12}`}
                        icon={TrendingUp}
                        trend={-2.4}
                        color="accent"
                    />
                </div>

                <div className="charts-grid">
                    {/* Spending Chart Card */}
                    <div className="card flex flex-col h-[320px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Spending Analytics</h3>
                            <select className="form-select w-auto py-1 px-3 text-sm">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="flex-1 relative">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    {/* Rotating Card Widget */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">Top Subscription</h3>
                            <button className="text-primary text-sm font-bold">View All</button>
                        </div>
                        {topSubscription ? (
                            <RotatingCard subscription={topSubscription} />
                        ) : (
                            <div className="card p-8 text-center text-muted">No subscriptions yet</div>
                        )}
                    </div>
                </div>

                {/* Smart Alerts Section */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Smart Alerts</h3>
                    <SmartAlerts alerts={alerts} />
                </div>

                {/* Recent Subscriptions List */}
                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Recent Activity</h3>
                        <button className="btn btn-outline text-xs py-2 px-4">View History</button>
                    </div>
                    <div className="table-container border-none shadow-none bg-transparent">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Category</th>
                                    <th>Cost</th>
                                    <th>Status</th>
                                    <th>Renewal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.slice(0, 5).map(sub => (
                                    <tr key={sub.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                                    {sub.name.charAt(0)}
                                                </div>
                                                <span className="font-bold">{sub.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="text-sm text-muted">{sub.category}</span></td>
                                        <td className="font-bold">₹{sub.monthlyCost}</td>
                                        <td><span className="badge badge-active">Active</span></td>
                                        <td className="text-sm text-muted">{format(parseISO(sub.renewalDate), 'MMM d, yyyy')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Sidebar (Details Panel) */}
            <div className="dashboard-sidebar">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold">Quick Actions</h3>
                    <button className="p-2 hover:bg-input rounded-full transition-colors">
                        <MoreHorizontal size={20} className="text-muted" />
                    </button>
                </div>

                {/* Mini Wallet Card */}
                <div className="card p-6 mb-6 bg-gradient-to-br from-gray-900 to-black border-none text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Wallet size={64} />
                    </div>
                    <p className="text-sm opacity-70 mb-1">Total Balance</p>
                    <h3 className="text-2xl font-bold mb-4">₹24,500.00</h3>
                    <div className="flex gap-2">
                        <button className="btn btn-primary text-xs py-2 px-4 w-full">Top Up</button>
                        <button className="btn btn-outline text-xs py-2 px-4 w-full border-white/20 hover:bg-white/10 text-white">Send</button>
                    </div>
                </div>

                <h3 className="text-sm text-muted font-bold uppercase tracking-wider mb-4">Upcoming Renewals</h3>
                <div className="flex flex-col gap-3">
                    {subscriptions
                        .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
                        .slice(0, 4)
                        .map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-input transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                        {sub.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{sub.name}</h4>
                                        <p className="text-xs text-muted">{Math.ceil((new Date(sub.renewalDate) - new Date()) / (1000 * 60 * 60 * 24))} days left</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm">₹{sub.monthlyCost}</div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="mt-auto pt-6">
                    <div className="card bg-primary-gradient border-none text-white p-6 text-center">
                        <Zap size={32} className="mx-auto mb-3 opacity-90" />
                        <h4 className="font-bold mb-1">Upgrade to Pro</h4>
                        <p className="text-xs opacity-80 mb-4">Unlock unlimited tracking and AI insights.</p>
                        <button className="btn bg-white text-primary w-full py-2 text-sm hover:bg-gray-100">Get Started</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
