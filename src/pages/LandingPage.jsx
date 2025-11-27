import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Shield, Zap, PieChart } from 'lucide-react';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="flex items-center gap-2">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Layers size={24} />
                    </div>
                    <span className="font-bold text-xl">SubsTrack</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="btn btn-outline">Log In</Link>
                    <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1', maxWidth: '800px' }}>
                    Manage all your <span style={{ color: 'var(--primary)' }}>Subscriptions</span> in one place.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
                    Track your spending, get renewal alerts, and never pay for an unused subscription again.
                </p>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '9999px' }}>
                    Get Started <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                </Link>

                {/* Abstract Art / Hero Image Placeholder */}
                <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', opacity: '0.8' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#E11D48' }}></div>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#2563EB' }}></div>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#10B981' }}></div>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#F59E0B' }}></div>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(75, 107, 251, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Instant Alerts</h3>
                        <p className="text-muted">Get notified before your subscriptions renew so you can cancel if needed.</p>
                    </div>
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <PieChart size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Spending Analytics</h3>
                        <p className="text-muted">Visualize your monthly and yearly spending habits with detailed charts.</p>
                    </div>
                    <div className="card" style={{ padding: '2rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Secure & Local</h3>
                        <p className="text-muted">Your data is stored locally on your device. We don't track your personal info.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                <p>&copy; 2024 SubsTrack. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
