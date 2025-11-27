import React from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';

const Reports = () => {
    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold mb-1">Reports</h1>
                    <p className="text-muted">Detailed financial reports and export options.</p>
                </div>
                <button className="btn btn-primary gap-2">
                    <Download size={18} />
                    <span>Export All</span>
                </button>
            </header>

            {/* Filters */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                <button className="btn btn-outline gap-2 active">
                    <Calendar size={16} />
                    <span>Last 30 Days</span>
                </button>
                <button className="btn btn-outline gap-2">
                    <Filter size={16} />
                    <span>All Categories</span>
                </button>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Monthly Spending Report', date: 'Oct 2023', size: '1.2 MB', type: 'PDF' },
                    { title: 'Annual Tax Summary', date: 'FY 2022-23', size: '2.4 MB', type: 'PDF' },
                    { title: 'Subscription Audit', date: 'Nov 15, 2023', size: '850 KB', type: 'CSV' },
                    { title: 'Category Breakdown', date: 'Q3 2023', size: '1.5 MB', type: 'PDF' },
                ].map((report, i) => (
                    <div key={i} className="card flex items-center gap-4 p-6 hover:bg-input transition-colors cursor-pointer group">
                        <div className="p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <FileText size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg">{report.title}</h4>
                            <p className="text-sm text-muted">{report.date} • {report.size}</p>
                        </div>
                        <div className="badge badge-inactive">{report.type}</div>
                        <button className="p-2 text-muted hover:text-primary">
                            <Download size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Generated Preview */}
            <div className="card bg-white text-black p-8 mt-4">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                    <h3 className="font-bold text-xl">Spending Summary Preview</h3>
                    <span className="text-gray-500">Generated on Nov 27, 2025</span>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium">Total Subscriptions</span>
                        <span className="font-bold">12 Active</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium">Monthly Recurring Cost</span>
                        <span className="font-bold">₹4,250.00</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium">Projected Annual Cost</span>
                        <span className="font-bold">₹51,000.00</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium">Highest Expense</span>
                        <span className="font-bold">Netflix Premium (₹649)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
