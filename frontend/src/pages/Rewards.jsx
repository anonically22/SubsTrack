import React from 'react';
import { Gift, Tag, Zap, ArrowRight } from 'lucide-react';

const Rewards = () => {
    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-extrabold mb-1">Rewards</h1>
                <p className="text-muted">Exclusive offers and cashback on your subscriptions.</p>
            </header>

            {/* Featured Offer */}
            <div className="card bg-gradient-to-r from-purple-600 to-blue-600 border-none text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12">
                    <Gift size={150} />
                </div>
                <div className="relative z-10 max-w-lg">
                    <div className="badge bg-white/20 text-white border-none mb-4">Limited Time</div>
                    <h2 className="text-4xl font-extrabold mb-4">Get 20% Cashback on Annual Plans</h2>
                    <p className="opacity-90 mb-8 text-lg">Upgrade any monthly subscription to an annual plan and get instant cashback to your wallet.</p>
                    <button className="btn bg-white text-primary hover:bg-gray-100">Claim Offer</button>
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="font-bold text-xl mb-4">Browse by Category</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {['All', 'Entertainment', 'Music', 'Productivity', 'Food', 'Utilities'].map((cat, i) => (
                        <button key={i} className={`px-6 py-2 rounded-full border transition-colors whitespace-nowrap ${i === 0 ? 'bg-white text-black border-white' : 'border-white/10 hover:bg-white/5'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: 'Spotify Premium', desc: '3 months free trial', code: 'SPOT3FREE', color: '#1DB954' },
                    { title: 'Youtube Premium', desc: '₹50 cashback on renewal', code: 'YT50CB', color: '#FF0000' },
                    { title: 'Swiggy One', desc: 'Flat 15% off on annual plan', code: 'SWIGGY15', color: '#FC8019' },
                    { title: 'Adobe CC', desc: 'Student discount + 10% off', code: 'ADOBE10', color: '#FF0000' },
                    { title: 'Amazon Prime', desc: '₹100 cashback on wallet pay', code: 'PRIME100', color: '#00A8E1' },
                    { title: 'Zomato Gold', desc: 'Buy 1 Get 1 on Gold', code: 'ZOMATO', color: '#CB202D' },
                ].map((offer, i) => (
                    <div key={i} className="card group hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: offer.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {offer.title.charAt(0)}
                            </div>
                            <div className="p-2 bg-input rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{offer.title}</h3>
                        <p className="text-sm text-muted mb-4">{offer.desc}</p>
                        <div className="flex justify-between items-center bg-input p-3 rounded-lg border border-white/5">
                            <span className="font-mono text-sm font-bold tracking-wider">{offer.code}</span>
                            <Tag size={16} className="text-muted" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rewards;
