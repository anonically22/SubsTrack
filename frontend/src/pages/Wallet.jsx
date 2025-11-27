import React from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, CreditCard, DollarSign, PieChart } from 'lucide-react';

const Wallet = () => {
    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-extrabold mb-1">Wallet</h1>
                <p className="text-muted">Manage your payment methods and track spending.</p>
            </header>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-gradient-to-br from-gray-900 to-black border-none text-white relative overflow-hidden p-8 h-64 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <WalletIcon size={120} />
                    </div>
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <p className="text-sm opacity-70 mb-1">Total Balance</p>
                            <h2 className="text-4xl font-bold">₹24,500.00</h2>
                        </div>
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                            <CreditCard size={24} />
                        </div>
                    </div>
                    <div className="flex gap-4 z-10">
                        <button className="btn btn-primary flex-1">Top Up</button>
                        <button className="btn btn-outline border-white/20 text-white hover:bg-white/10 flex-1">Transfer</button>
                    </div>
                </div>

                <div className="card p-8 h-64 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Monthly Savings</h3>
                        <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-secondary">₹1,250</h2>
                        <p className="text-muted text-sm mt-1">Saved this month via offers</p>
                    </div>
                    <div className="w-full bg-input rounded-full h-2 mt-4 overflow-hidden">
                        <div className="bg-secondary h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-xs text-muted mt-2">65% of goal reached</p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Recent Transactions</h3>
                    <button className="btn btn-outline text-xs py-2 px-4">View All</button>
                </div>
                <div className="flex flex-col gap-4">
                    {[
                        { name: 'Netflix Premium', date: 'Today, 10:30 AM', amount: -649, icon: 'N', color: '#E50914' },
                        { name: 'Spotify Duo', date: 'Yesterday, 4:15 PM', amount: -149, icon: 'S', color: '#1DB954' },
                        { name: 'Salary Credit', date: 'Oct 28, 9:00 AM', amount: 45000, icon: '₹', color: '#10B981', type: 'credit' },
                        { name: 'Swiggy One', date: 'Oct 25, 8:20 PM', amount: -75, icon: 'S', color: '#FC8019' },
                    ].map((tx, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-input rounded-xl transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: tx.color, color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '1.2rem'
                                }}>
                                    {tx.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold">{tx.name}</h4>
                                    <p className="text-xs text-muted">{tx.date}</p>
                                </div>
                            </div>
                            <div className={`font-bold ${tx.type === 'credit' ? 'text-secondary' : ''}`}>
                                {tx.type === 'credit' ? '+' : '-'}₹{Math.abs(tx.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
