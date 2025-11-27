import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bell, Wallet, TrendingUp, Plus, ArrowRight, Zap } from 'lucide-react';
import RotatingCard from '../components/RotatingCard';
import SmartAlerts from '../components/SmartAlerts';
import SummaryCard from '../components/SummaryCard';
import PageHeader from '../components/PageHeader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { subscriptions, getAnalytics, getAlerts } = useSubscriptions();
    const { totalMonthlySpend } = getAnalytics();
    const alerts = getAlerts();

    const barData = {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
            {
                label: 'Spending',
                data: [1200, 1500, 1100, 1800, totalMonthlySpend],
                backgroundColor: (context) => {
                    return context.dataIndex === 4 ? '#6366F1' : 'rgba(99, 102, 241, 0.3)';
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
                ticks: { color: '#A1A1AA', font: { family: 'Inter' } }
            },
            y: { display: false },
        },
    };

    const topSubscription = [...subscriptions].sort((a, b) => b.monthlyCost - a.monthlyCost)[0];

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's your subscription overview."
                action={
                    <Link to="/add" className="btn btn-primary gap-2">
                        <Plus size={18} />
                        <span>Add Subscription</span>
                    </Link>
                }
            />

            {/* Summary Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card flex flex-col" style={{ minHeight: '320px' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Spending Analytics</h3>
                        <select className="form-select w-auto py-2 px-3 text-sm">
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="flex-1 relative">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Top Subscription</h3>
                        <Link to="/subscriptions" className="text-primary text-sm font-bold hover:underline">View All</Link>
                    </div>
                    {topSubscription ? (
                        <RotatingCard subscription={topSubscription} />
                    ) : (
                        <div className="card p-8 text-center text-muted">No subscriptions yet</div>
                    )}
                </div>
            </div>

            {/* Smart Alerts */}
            {alerts.length > 0 && (
                <div>
                    <h3 className="font-bold text-lg mb-4">Smart Alerts</h3>
                    <SmartAlerts alerts={alerts} />
                </div>
            )}

            {/* Recent Activity */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Recent Activity</h3>
                    <Link to="/subscriptions" className="btn btn-outline text-xs py-2 px-4">View All</Link>
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
    );
};

export default Dashboard;
