import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Analytics = () => {
    const { getAnalytics, subscriptions } = useSubscriptions();
    const { categorySpend, totalMonthlySpend } = getAnalytics();

    const pieData = {
        labels: Object.keys(categorySpend),
        datasets: [
            {
                data: Object.values(categorySpend),
                backgroundColor: [
                    '#4B6BFB', '#FFB703', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'
                ],
                borderWidth: 1,
            },
        ],
    };

    // Mock trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const lineData = {
        labels: months,
        datasets: [
            {
                label: 'Monthly Spend (₹)',
                data: months.map(() => totalMonthlySpend + (Math.random() * 500 - 250)),
                borderColor: '#4B6BFB',
                backgroundColor: 'rgba(75, 107, 251, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div>
            <h2 className="text-2xl mb-6">Spending Analytics</h2>

            <div className="dashboard-grid">
                <div className="card">
                    <h3 className="font-bold mb-4" style={{ textAlign: 'center' }}>Spend by Category</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        {Object.keys(categorySpend).length > 0 ? (
                            <Pie data={pieData} options={options} />
                        ) : (
                            <p className="text-muted flex items-center">No data available</p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 className="font-bold mb-4" style={{ textAlign: 'center' }}>Monthly Trend (Projected)</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Line data={lineData} options={options} />
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="font-bold mb-4">Insights</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                    <li className="mb-4">Your highest spending category is <span className="font-bold text-primary">{Object.keys(categorySpend).reduce((a, b) => categorySpend[a] > categorySpend[b] ? a : b, 'None')}</span>.</li>
                    <li>You are spending approximately <span className="font-bold text-primary">₹{totalMonthlySpend * 12}</span> annually on subscriptions.</li>
                </ul>
            </div>
        </div>
    );
};

export default Analytics;
