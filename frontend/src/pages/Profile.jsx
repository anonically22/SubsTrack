import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { User, Settings, Moon, Sun, LogOut, CreditCard, Bell, Shield, HelpCircle, Download } from 'lucide-react';

const Profile = () => {
    const { theme, toggleTheme, subscriptions } = useSubscriptions();

    const exportData = () => {
        const dataStr = JSON.stringify(subscriptions, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'substrack_data.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <header>
                <h1 className="text-3xl font-extrabold mb-1">Profile & Settings</h1>
                <p className="text-muted">Manage your account preferences and app settings.</p>
            </header>

            {/* Profile Card */}
            <div className="card flex flex-col md:flex-row items-center gap-6 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-accent opacity-20"></div>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '4px solid var(--bg-body)',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <User size={48} className="text-primary" />
                </div>
                <div className="text-center md:text-left relative z-10 pt-4 md:pt-0">
                    <h2 className="text-2xl font-bold">User Name</h2>
                    <p className="text-muted">user@example.com</p>
                    <div className="flex gap-2 mt-4 justify-center md:justify-start">
                        <span className="badge badge-active">Pro Member</span>
                        <span className="badge badge-inactive">India</span>
                    </div>
                </div>
                <div className="ml-auto relative z-10">
                    <button className="btn btn-outline gap-2">
                        <Settings size={18} />
                        <span>Edit Profile</span>
                    </button>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* App Settings */}
                <div className="card">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Settings size={20} className="text-primary" />
                        App Settings
                    </h3>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between p-3 hover:bg-input rounded-lg transition-colors cursor-pointer" onClick={toggleTheme}>
                            <div className="flex items-center gap-3">
                                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                <span>Dark Mode</span>
                            </div>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-4' : ''}`}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-input rounded-lg transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Bell size={20} />
                                <span>Notifications</span>
                            </div>
                            <span className="text-sm text-muted">On</span>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-input rounded-lg transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} />
                                <span>Currency</span>
                            </div>
                            <span className="text-sm text-muted">INR (₹)</span>
                        </div>
                    </div>
                </div>

                {/* Data & Privacy */}
                <div className="card">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-secondary" />
                        Data & Privacy
                    </h3>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between p-3 hover:bg-input rounded-lg transition-colors cursor-pointer" onClick={exportData}>
                            <div className="flex items-center gap-3">
                                <Download size={20} />
                                <span>Export Data</span>
                            </div>
                            <span className="text-sm text-muted">JSON</span>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-input rounded-lg transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <HelpCircle size={20} />
                                <span>Help & Support</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-input rounded-lg transition-colors cursor-pointer text-accent">
                            <div className="flex items-center gap-3">
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-muted mt-8">
                <p>SubsTrack v1.0.0 • Made with ❤️ for India</p>
                <p className="mt-2 text-xs opacity-50">Local storage enabled. Your data stays on your device.</p>
            </div>
        </div>
    );
};

export default Profile;
