import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, CreditCard, PieChart, FileText, Settings, User, Bell, Layers, Wallet, Zap } from 'lucide-react';
import { useSubscriptions } from '../context/SubscriptionContext';

const Layout = ({ children }) => {
    const { getAlerts } = useSubscriptions();
    const alerts = getAlerts();
    const urgentCount = alerts.filter(a => a.type === 'urgent' || a.type === 'expired').length;
    const location = useLocation();

    // Neo-Card Sidebar Items
    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/discover', icon: Compass, label: 'Discover' }, // Placeholder
        { path: '/subscriptions', icon: Layers, label: 'My Subs' },
        { path: '/wallet', icon: Wallet, label: 'Cards' }, // New Wallet Page
        { path: '/analytics', icon: PieChart, label: 'Insights' },
        { path: '/reports', icon: FileText, label: 'Reports' }, // Placeholder
        { path: '/settings', icon: Settings, label: 'Settings' }, // Placeholder or Profile
    ];

    return (
        <div className="app-container">
            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="flex items-center gap-3">
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'var(--primary-gradient)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--primary-glow)'
                        }}>
                            <Zap size={24} color="white" fill="white" />
                        </div>
                        <span className="logo-text">SubsTrack</span>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-4 px-4">Menu</p>
                    <nav className="sidebar-nav">
                        {navItems.slice(0, 4).map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-4 px-4">General</p>
                    <nav className="sidebar-nav">
                        {navItems.slice(4).map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-main">User Name</span>
                            <span className="text-xs text-muted">View Profile</span>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="mobile-header">
                <div className="flex items-center gap-3">
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: 'var(--primary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Zap size={18} color="white" fill="white" />
                    </div>
                    <span className="logo-text" style={{ fontSize: '1.2rem' }}>SubsTrack</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/profile" style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'var(--glass-border)'
                    }}>
                        <User size={20} className="text-main" />
                    </Link>
                    <div style={{ position: 'relative' }}>
                        <Bell size={24} className="text-muted" />
                        {urgentCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#F43F5E',
                                border: '2px solid var(--bg-body)'
                            }} />
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="bottom-nav">
                <Link to="/dashboard" className={`bottom-nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>Home</span>
                </Link>
                <Link to="/subscriptions" className={`bottom-nav-item ${location.pathname === '/subscriptions' ? 'active' : ''}`}>
                    <Layers size={24} />
                    <span>Subs</span>
                </Link>
                <Link to="/add" className="bottom-nav-item">
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'var(--primary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: 'var(--primary-glow)',
                        marginBottom: '20px'
                    }}>
                        <Zap size={24} fill="white" />
                    </div>
                </Link>
                <Link to="/wallet" className={`bottom-nav-item ${location.pathname === '/wallet' ? 'active' : ''}`}>
                    <Wallet size={24} />
                    <span>Cards</span>
                </Link>
                <Link to="/analytics" className={`bottom-nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
                    <PieChart size={24} />
                    <span>Insights</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;
