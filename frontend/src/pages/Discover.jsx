import React from 'react';
import { Search, Star, TrendingUp, Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Discover = () => {
    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Discover"
                description="Find new apps and services to subscribe to."
                action={
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
                        <input type="text" placeholder="Search services..." className="form-input pl-10 w-full md:w-80" />
                    </div>
                }
            />

            {/* Featured Banner */}
            <div className="card bg-gradient-to-r from-pink-600 to-orange-500 border-none text-white p-8 relative overflow-hidden flex items-center" style={{ minHeight: '200px' }}>
                <div className="relative z-10 max-w-2xl">
                    <div className="badge bg-white/20 text-white border-none mb-4">Trending Now</div>
                    <h2 className="text-4xl font-extrabold mb-4">MasterClass: Learn from the best</h2>
                    <p className="opacity-90 mb-6 text-lg">Unlock your potential with classes from world-renowned instructors.</p>
                    <button className="btn bg-white text-black hover:bg-gray-100">View Plans</button>
                </div>
            </div>

            {/* Popular Categories */}
            <section>
                <h3 className="font-bold text-xl mb-4">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {['Entertainment', 'Music', 'Productivity', 'Design', 'Education', 'Health'].map((cat, i) => (
                        <div key={i} className="card p-4 flex flex-col items-center justify-center gap-2 hover:bg-input cursor-pointer transition-all text-center h-32">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <Star size={20} />
                            </div>
                            <span className="font-bold text-sm">{cat}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Apps */}
            <section>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-secondary" />
                    Top Rated Apps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: 'Notion', cat: 'Productivity', rating: 4.9, price: 'Free / $8', color: '#000000' },
                        { name: 'Figma', cat: 'Design', rating: 4.8, price: 'Free / $12', color: '#F24E1E' },
                        { name: 'Headspace', cat: 'Health', rating: 4.7, price: '$12.99', color: '#F49E26' },
                        { name: 'Disney+', cat: 'Entertainment', rating: 4.6, price: '$7.99', color: '#113CCF' },
                        { name: 'Duolingo', cat: 'Education', rating: 4.8, price: 'Free / $6.99', color: '#58CC02' },
                        { name: 'Slack', cat: 'Business', rating: 4.5, price: 'Free / $8', color: '#4A154B' },
                    ].map((app, i) => (
                        <div key={i} className="card flex items-center gap-4 p-4 hover:border-primary/50 transition-all group">
                            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                {app.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold">{app.name}</h4>
                                <p className="text-xs text-muted">{app.cat} • ⭐ {app.rating}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">{app.price}</p>
                                <button className="p-2 rounded-full bg-input hover:bg-primary hover:text-white transition-colors mt-1">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Discover;
