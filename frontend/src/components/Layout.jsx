import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, CreditCard as CardIcon, BarChart2, FileText, Settings, User, Bell } from 'lucide-react';
import { useSubscriptions } from '../context/SubscriptionContext';

const Layout = ({ children }) => {
    const { getAlerts } = useSubscriptions();
    const alerts = getAlerts();
    const urgentCount = alerts.filter(a => a.type === 'urgent' || a.type === 'expired').length;
    const location = useLocation();

    // Cleaned up nav items
    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/subscriptions', icon: CardIcon, label: 'My Subs' },
        { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    ];

    return (
        <div className="app-container">
            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="flex items-center gap-2">
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4B6BFB, #8B5CF6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white' }}></div>
                        </div>
                        <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: '800' }}>waly</span>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-4 px-4">Menu</p>
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

                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="mobile-header">
                <div className="flex items-center gap-3">
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4B6BFB, #8B5CF6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white' }}></div>
                    </div>
                    <span className="logo-text">waly</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/profile" style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border)'
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
                                backgroundColor: 'var(--error)'
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
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <item.icon size={24} />
                        <span style={{ fontSize: '0.6rem', marginTop: '4px' }}>{item.label}</span>
                    </Link>
                ))}
                <Link to="/profile" className={`bottom-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                    <User size={24} />
                    <span style={{ fontSize: '0.6rem', marginTop: '4px' }}>Profile</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;
