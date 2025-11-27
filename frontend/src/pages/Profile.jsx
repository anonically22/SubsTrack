import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { User, Download, Settings, Moon, Globe, CreditCard } from 'lucide-react';

const Profile = () => {
    const { subscriptions, theme, toggleTheme } = useSubscriptions();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Profile & Settings</h2>
                <button className="btn btn-outline flex items-center gap-2">
                    <Download size={20} />
                    Export Data
                </button>
            </div>

            <div className="card mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-container-high)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid var(--bg-card)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <User size={64} className="text-main" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold mb-1">User Name</h4>
                        <p className="text-muted mb-4">user@example.com</p>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Edit Profile</button>
                    </div>
                </div>
            </div>

            <div className="card mb-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Settings size={24} className="text-primary" />
                    Preferences
                </h3>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-secondary-container text-on-secondary-container">
                                <Moon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Dark Mode</h4>
                                <p className="text-sm text-muted">Toggle application theme</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            style={{
                                width: '52px',
                                height: '32px',
                                borderRadius: '9999px',
                                padding: '4px',
                                transition: 'background-color 0.2s',
                                backgroundColor: theme === 'dark' ? 'var(--primary)' : 'var(--outline)',
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                transition: 'transform 0.2s',
                                transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)'
                            }} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-tertiary-container text-on-tertiary-container">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Language</h4>
                                <p className="text-sm text-muted">English (India)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-error-container text-on-error-container">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Currency</h4>
                                <p className="text-sm text-muted">INR (₹)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
