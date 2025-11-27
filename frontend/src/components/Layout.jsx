import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, CreditCard, PieChart, FileText, Settings, User, Bell, Plus, Wallet, Zap } from 'lucide-react';
import { useSubscriptions } from '../context/SubscriptionContext';

const Layout = ({ children }) => {
    const { getAlerts } = useSubscriptions();
    const alerts = getAlerts();
    const urgentCount = alerts.filter(a => a.type === 'urgent' || a.type === 'expired').length;
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/discover', icon: Compass, label: 'Discover' },
        { path: '/subscriptions', icon: CreditCard, label: 'My Subs' },
        { path: '/wallet', icon: Wallet, label: 'Wallet' },
        { path: '/analytics', icon: PieChart, label: 'Analytics' },
        { path: '/reports', icon: FileText, label: 'Reports' },
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

                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-4" style={{ paddingLeft: 'var(--space-4)' }}>Menu</p>
                    <nav className="sidebar-nav">
                        {navItems.map((item, index) => (
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

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)' }}>
                    <Link to="/profile" className={`nav-item ${location.pathname === '/profile' || location.pathname === '/settings' ? 'active' : ''}`}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-main">Settings</span>
                            <span className="text-xs text-muted">Profile & Preferences</span>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="mobile-header">
                <div className="flex items-center gap-3">
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--primary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--primary-glow)'
                    }}>
                        <Zap size={20} color="white" fill="white" />
                    </div>
                    <span className="logo-text" style={{ fontSize: '1.25rem' }}>SubsTrack</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/profile" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'var(--glass-border)'
                    }}>
                        <User size={20} className="text-main" />
                    </Link>
                    <Link to="/alerts" style={{ position: 'relative' }}>
                        <Bell size={24} className="text-muted" />
                        {urgentCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                minWidth: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#EF4444',
                                border: '2px solid var(--bg-body)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                color: 'white',
                                padding: '0 4px'
                            }}>{urgentCount}</span>
                        )}
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Mobile Bottom Nav with FAB */}
            <nav className="bottom-nav">
                <Link to="/dashboard" className={`bottom-nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <Home size={22} />
                    <span>Home</span>
                </Link>
                <Link to="/subscriptions" className={`bottom-nav-item ${location.pathname === '/subscriptions' ? 'active' : ''}`}>
                    <CreditCard size={22} />
                    <span>Subs</span>
                </Link>

                {/* FAB - Add New Subscription */}
                <Link to="/add" className="bottom-nav-item fab">
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'var(--primary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: 'var(--primary-glow), 0 8px 16px rgba(0,0,0,0.2)',
                        border: '4px solid var(--bg-body)'
                    }}>
                        <Plus size={28} strokeWidth={3} />
                    </div>
                </Link>

                <Link to="/wallet" className={`bottom-nav-item ${location.pathname === '/wallet' ? 'active' : ''}`}>
                    <Wallet size={22} />
                    <span>Wallet</span>
                </Link>
                <Link to="/analytics" className={`bottom-nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
                    <PieChart size={22} />
                    <span>Stats</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;
