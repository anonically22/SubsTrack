import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Wallet,
  Home,
  LayoutGrid,
  History,
  User,
  Settings,
  LogOut,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  ChevronRight,
  Zap,
  Quote,
  Eye,
  ShieldCheck,
  BarChart3,
  TrendingDown,
  Lock,
  ArrowRight,
  ExternalLink,
  Globe
} from 'lucide-react';
import { supabase } from './lib/supabase';

/**
 * SubsTrack Core Application
 * Aesthetic: Institutional, Calm, Analytical, Precise.
 * Features: Multi-section narrative landing page (Qualytics-inspired)
 */

// --- Utilities ---
const BRANDFETCH_CLIENT_ID = import.meta.env.VITE_BRANDFETCH_CLIENT_ID || 'your_client_id_here';

const getBrandLogo = (domain) => {
  if (!domain) return null;
  return `https://cdn.brandfetch.io/${domain}?c=${BRANDFETCH_CLIENT_ID}`;
};

// --- Mock Data ---
const INITIAL_SUBSCRIPTIONS = [
  { id: '1', name: "Netflix Premium", domain: "netflix.com", cost: 499, cycle: "Monthly", next: "12 Mar", category: "Streaming" },
  { id: '2', name: "GitHub Copilot", domain: "github.com", cost: 1000, cycle: "Monthly", next: "28 Mar", category: "Software" },
  { id: '3', name: "DigitalOcean", domain: "digitalocean.com", cost: 1240, cycle: "Monthly", next: "01 Apr", category: "Cloud" },
  { id: '4', name: "Disney Plus", domain: "disneyplus.com", cost: 149, cycle: "Monthly", next: "15 Mar", category: "Streaming" },
  { id: '5', name: "AWS Server 01", domain: "aws.amazon.com", cost: 850, cycle: "Usage", next: "30 Mar", category: "Cloud", highlight: true },
  { id: '6', name: "Figma Pro", domain: "figma.com", cost: 990, cycle: "Monthly", next: "10 Apr", category: "Software" },
  { id: '7', name: "Notion", domain: "notion.so", cost: 400, cycle: "Annual", next: "Jan 2025", category: "Software" },
  { id: '8', name: "ChatGPT Plus", domain: "openai.com", cost: 1650, cycle: "Monthly", next: "20 Mar", category: "Software" },
  { id: '9', name: "Spotify Premium", domain: "spotify.com", cost: 119, cycle: "Monthly", next: "19 Mar", category: "Streaming" },
];

const INITIAL_TRANSACTIONS = [
  { id: 't1', amount: 45000, type: 'income', category: 'Salary Node', date: '01 Mar' },
  { id: 't2', amount: 15600, type: 'expense', category: 'Operational Rent', date: '02 Mar' },
  { id: 't3', amount: 499, type: 'subscription', category: 'Netflix Premium', date: '12 Feb' },
  { id: 't4', amount: 1000, type: 'subscription', category: 'GitHub Copilot', date: '28 Feb' },
  { id: 't5', amount: 2400, type: 'expense', category: 'Logistics / Travel', date: '03 Mar' },
];

const INITIAL_ADMIN_METRICS = {
  totalUsers: 1248,
  activeSessions: 84,
  apiCallsToday: 15402,
  totalSubscriptions: 8642,
  totalTransactions: 32401
};

const MOCK_API_LOGS = [
  { id: 1, endpoint: '/api/v1/auth/login', requests: 124, avgTime: '42ms', lastCall: '2s ago', status: 200 },
  { id: 2, endpoint: '/api/v1/subs/list', requests: 842, avgTime: '118ms', lastCall: '5s ago', status: 200 },
  { id: 3, endpoint: '/api/v1/flow/summary', requests: 312, avgTime: '86ms', lastCall: '12s ago', status: 200 },
  { id: 4, endpoint: '/api/v1/admin/metrics', requests: 45, avgTime: '210ms', lastCall: '1m ago', status: 200 },
];

function AnimatedNumber({ value, prefix = "₹", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    const duration = 2000;
    let startTime = null;

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4); // Stronger ease out
      const current = start + (end - start) * easeProgress;
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="font-mono">
      {prefix}{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(Math.floor(displayValue))}
      {suffix}
    </span>
  );
}

function SectionReveal({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState('landing'); // landing, auth, dashboard, subs, flow, admin
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Central State
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState({ totalUsers: 0, activeFleet: 0, systemHealth: '--' });

  // Modal State
  const [modal, setModal] = useState({ type: null, isOpen: false });

  // Supabase Auth and Data Fetching
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
        fetchUserData(session.user.id);
      } else {
        setLoadingInitial(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
        fetchUserData(session.user.id);
      } else {
        setIsAdmin(false);
        setSubscriptions([]);
        setTransactions([]);
        if (view !== 'landing' && view !== 'auth') {
          setView('landing');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId) => {
    try {
      const { data } = await supabase.from('master_admins').select('id').eq('user_id', userId).single();
      setIsAdmin(!!data);
    } catch (e) {
      setIsAdmin(false);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const { data: subs } = await supabase.from('subscriptions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (subs) setSubscriptions(subs);

      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false });
      if (txs) setTransactions(txs);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoadingInitial(false);
    }
  };

  const navigateTo = (newView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

  const handleAddSubscription = async (newSub) => {
    if (!user) return;
    try {
      const dbSub = {
        user_id: user.id,
        name: newSub.name,
        domain: newSub.domain,
        cost: newSub.cost,
        cycle: newSub.cycle,
        category: newSub.category || 'Software',
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Dummy 30 days from now
      };
      const { data, error } = await supabase.from('subscriptions').insert([dbSub]).select();
      if (error) throw error;
      if (data && data[0]) {
        setSubscriptions([data[0], ...subscriptions]);
        setApiLogs([{ id: Date.now(), endpoint: '/api/v1/subs/create', requests: 1, avgTime: '145ms', lastCall: 'Just now', status: 201 }, ...apiLogs]);
      }
    } catch (e) {
      console.error("Error adding subscription:", e);
    } finally {
      setModal({ type: null, isOpen: false });
    }
  };

  const handleAddTransaction = async (newTx) => {
    if (!user) return;
    try {
      const dbTx = {
        user_id: user.id,
        type: newTx.type,
        category: newTx.category,
        amount: newTx.amount,
        date: new Date().toISOString().split('T')[0]
      };
      const { data, error } = await supabase.from('transactions').insert([dbTx]).select();
      if (error) throw error;
      if (data && data[0]) {
        setTransactions([data[0], ...transactions]);
        setApiLogs([{ id: Date.now(), endpoint: '/api/v1/flow/transaction', requests: 1, avgTime: '92ms', lastCall: 'Just now', status: 201 }, ...apiLogs]);
      }
    } catch (e) {
      console.error("Error adding transaction:", e);
    } finally {
      setModal({ type: null, isOpen: false });
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-sans selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingView key="landing" onStart={() => navigateTo('auth')} />
        )}

        {view === 'auth' && (
          <AuthScreen key="auth" onLogin={() => {
            // State listener handles user setting, just navigate
            navigateTo('dashboard');
          }} />
        )}

        {(view === 'dashboard' || view === 'subs' || view === 'flow' || view === 'admin') && (
          <AppShell key="app" activeView={view} onViewChange={navigateTo} user={user}>
            {view === 'dashboard' && (
              <Dashboard
                subscriptions={subscriptions}
                transactions={transactions}
                onAddSub={() => setModal({ type: 'subscription', isOpen: true })}
                onAddFlow={() => setModal({ type: 'transaction', isOpen: true })}
              />
            )}
            {view === 'subs' && (
              <SubscriptionManager
                subscriptions={subscriptions}
                setSubscriptions={setSubscriptions}
                onOpenAdd={() => setModal({ type: 'subscription', isOpen: true })}
              />
            )}
            {view === 'flow' && (
              <MoneyFlow
                transactions={transactions}
                setTransactions={setTransactions}
                onOpenAdd={() => setModal({ type: 'transaction', isOpen: true })}
              />
            )}
            {view === 'admin' && (
              <AdminDashboard
                metrics={adminMetrics}
                apiLogs={apiLogs}
              />
            )}
          </AppShell>
        )}

        {/* Modals Container */}
        <AnimatePresence>
          {modal.isOpen && (
            <Modal
              onClose={() => setModal({ ...modal, isOpen: false })}
              title={modal.type === 'subscription' ? 'Register New Subscription' : 'New Transaction Node'}
            >
              {modal.type === 'subscription' && (
                <SubscriptionForm onSubmit={handleAddSubscription} onCancel={() => setModal({ ...modal, isOpen: false })} />
              )}
              {modal.type === 'transaction' && (
                <TransactionForm onSubmit={handleAddTransaction} onCancel={() => setModal({ ...modal, isOpen: false })} />
              )}
            </Modal>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}

// --- Generic Modal Component ---

function Modal({ onClose, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-[#0c0c0c] border border-white/10 shadow-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors">
            <Plus className="w-5 h-5 rotate-45 text-slate-500" />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Subscription Form ---

function SubscriptionForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ name: '', domain: '', cost: '', cycle: 'Monthly', category: 'Software' });

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="mono-label !text-[9px]">Resource_Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Netflix"
            className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="mono-label !text-[9px]">Domain_Authority</label>
          <input
            type="text"
            placeholder="netflix.com"
            className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none"
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="mono-label !text-[9px]">Monthly_Cost</label>
          <input
            type="number"
            required
            className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="mono-label !text-[9px]">Billing_Cycle</label>
          <select
            className="w-full bg-black border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none appearance-none"
            value={formData.cycle}
            onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
          >
            <option>Monthly</option>
            <option>Annual</option>
            <option>Usage</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors">
          Establish Subscription
        </button>
        <button type="button" onClick={onCancel} className="px-8 py-4 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// --- Transaction Form ---

function TransactionForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ category: '', amount: '', type: 'expense' });

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="space-y-2">
        <label className="mono-label !text-[9px]">Transaction_Category</label>
        <input
          type="text"
          required
          placeholder="e.g. Rent / Salary"
          className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="mono-label !text-[9px]">Value_Amount</label>
          <input
            type="number"
            required
            className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="mono-label !text-[9px]">Flow_Direction</label>
          <div className="flex border border-white/10 h-[54px]">
            <button
              type="button"
              className={`flex-1 font-mono text-[10px] uppercase font-bold tracking-widest transition-colors ${formData.type === 'income' ? 'bg-primary text-black' : 'hover:bg-white/5 text-slate-400'}`}
              onClick={() => setFormData({ ...formData, type: 'income' })}
            >
              Income
            </button>
            <button
              type="button"
              className={`flex-1 font-mono text-[10px] uppercase font-bold tracking-widest transition-colors ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'hover:bg-white/5 text-slate-400'}`}
              onClick={() => setFormData({ ...formData, type: 'expense' })}
            >
              Expense
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors">
          Record Transaction
        </button>
        <button type="button" onClick={onCancel} className="px-8 py-4 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-colors">
          Abort
        </button>
      </div>
    </form>
  );
}

// --- Narrative Landing View ---

function LandingView({ onStart }) {
  return (
    <div className="bg-background-dark w-full overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="text-primary w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">SubsTrack</span>
        </div>
        <button
          onClick={onStart}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
        >
          Access Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-20 relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 h-full w-px bg-white/20"></div>
          <div className="absolute top-0 right-1/4 h-full w-px bg-white/20"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/10"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center py-24">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="serif-display text-7xl md:text-9xl mb-10 leading-[0.9] tracking-tighter"
            >
              Your money is<br />quietly leaving.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="space-y-6"
            >
              <p className="max-w-xl text-white text-lg md:text-xl font-medium tracking-tight">
                Subscriptions are designed to disappear into the background.<br />
                SubsTrack brings them back into focus.
              </p>
              <p className="max-w-xl text-slate-300 text-sm leading-relaxed mx-auto font-medium">
                Track recurring payments, understand their real cost, and regain control over what runs automatically.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex flex-col md:flex-row gap-4 mt-16"
            >
              <button
                onClick={onStart}
                className="px-12 py-5 bg-white text-black text-xs font-bold uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
              >
                Start Tracking
              </button>
              <button
                onClick={() => document.getElementById('awareness-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-5 border border-white/30 text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95"
              >
                See How It Works
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Awareness Section */}
      <section id="awareness-section" className="py-48 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-4xl mx-auto space-y-16">
          <SectionReveal className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
              Recurring spending is easy to ignore.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4 opacity-60 group hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 relative">
                  <img
                    src={getBrandLogo('netflix.com')}
                    alt="Streaming"
                    className="w-7 h-7 object-contain transition-all relative z-10"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="hidden absolute inset-0 items-center justify-center">
                    <Globe className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
                <div>
                  <p className="mono-label">Asset_01</p>
                  <p className="text-slate-300 font-bold">Streaming Platforms</p>
                </div>
              </div>
              <div className="space-y-4 opacity-60 group hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 relative">
                  <img
                    src={getBrandLogo('github.com')}
                    alt="Software"
                    className="w-7 h-7 object-contain transition-all relative z-10"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="hidden absolute inset-0 items-center justify-center">
                    <Globe className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
                <div>
                  <p className="mono-label">Asset_02</p>
                  <p className="text-slate-300 font-bold">Software Tools</p>
                </div>
              </div>
              <div className="space-y-4 opacity-60 group hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 relative">
                  <img
                    src={getBrandLogo('aws.amazon.com')}
                    alt="Cloud"
                    className="w-7 h-7 object-contain transition-all relative z-10"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  <div className="hidden absolute inset-0 items-center justify-center">
                    <Globe className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
                <div>
                  <p className="mono-label">Asset_03</p>
                  <p className="text-slate-300 font-bold">Cloud Services</p>
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="space-y-6 max-w-2xl">
            <p className="text-slate-200 text-xl font-medium leading-relaxed">
              Small payments that renew automatically. Individually they feel insignificant. Together they shape your financial habits.
            </p>
            <p className="serif-display text-2xl text-primary font-bold">
              SubsTrack helps you see the full picture — clearly and instantly.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-48 px-6 relative">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-24 items-center">
          <div className="flex-1 space-y-12">
            <SectionReveal className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white leading-[1.1]">
                Most people don’t know what their subscriptions cost them.
              </h2>
              <div className="space-y-6 text-slate-200 text-lg leading-relaxed">
                <p>Recurring payments are designed to be frictionless.</p>
                <p>That convenience comes with a trade-off: they slowly accumulate without being noticed.</p>
              </div>
            </SectionReveal>

            <SectionReveal className="space-y-4">
              <p className="mono-label">Awareness_Protocol</p>
              <ul className="space-y-4">
                <ProblemListItem text="Your real monthly spending" />
                <ProblemListItem text="Your projected yearly cost" />
                <ProblemListItem text="Upcoming renewals before they happen" />
              </ul>
            </SectionReveal>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <SectionReveal className="p-12 border border-white/5 bg-black/40 relative">
              <div className="absolute top-4 right-4 flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <div className="w-1 h-1 rounded-full bg-primary/40"></div>
              </div>
              <div className="space-y-8">
                <div className="space-y-1">
                  <p className="mono-label">Composite_Leak</p>
                  <p className="text-5xl font-mono text-primary leading-none">
                    <AnimatedNumber value={14994} />
                  </p>
                  <p className="mono-label !text-slate-400 mt-2">/ Yearly Projected loss</p>
                </div>
                <div className="h-px w-full bg-white/10"></div>
                <p className="serif-display text-2xl italic leading-relaxed text-white">
                  “Awareness is the first step toward control.”
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-48 px-6 bg-white/[0.01]">
        <div className="max-w-[1400px] mx-auto">
          <SectionReveal className="mb-24 text-center">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-6">How SubsTrack Works</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 overflow-hidden">
            <ProcessStep
              number="1"
              title="Add Your Subscriptions"
              description="Enter the services you use — streaming platforms, software, memberships, or tools. SubsTrack organizes them automatically."
            />
            <ProcessStep
              number="2"
              title="Track Renewals"
              description="See upcoming payments before they happen. Renewal timelines help you stay ahead of charges instead of reacting after they occur."
            />
            <ProcessStep
              number="3"
              title="Understand the Cost"
              description="Instantly see monthly recurring spend, yearly projections, and financial impact across categories. Clear data leads to better decisions."
            />
          </div>
        </div>
      </section>

      {/* Insight Section */}
      <section className="py-48 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">
          <SectionReveal>
            <Quote className="text-primary/40 w-12 h-12 mb-8 mx-auto" strokeWidth={1} />
            <h2 className="serif-display text-5xl md:text-7xl italic leading-tight text-white mb-12">
              “Small payments create large patterns.”
            </h2>
            <div className="space-y-6 text-slate-200 text-xl font-medium max-w-2xl mx-auto">
              <p>Subscriptions are rarely expensive on their own.</p>
              <p>But recurring systems compound over time.</p>
              <p className="text-primary font-bold">SubsTrack reveals those patterns so you can decide which subscriptions truly matter.</p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Psychological Insight Section */}
      <section className="py-48 px-6 bg-black relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <SectionReveal className="space-y-10">
            <h2 className="serif-display text-5xl md:text-6xl text-white italic underline underline-offset-8 decoration-primary/40">Visibility changes behavior.</h2>
            <div className="space-y-6 text-slate-200 text-lg leading-relaxed max-w-lg">
              <p>When spending becomes visible, habits change naturally.</p>
              <p>SubsTrack doesn’t try to force financial decisions. It simply shows the truth about recurring spending.</p>
              <p className="text-white font-bold text-xl mb-2">The rest is up to you.</p>
            </div>
          </SectionReveal>
          <SectionReveal className="p-12 border border-white/10 bg-white/[0.02]">
            <p className="mono-label mb-8">Empirical_Finding</p>
            <div className="space-y-6">
              <p className="text-slate-300 text-2xl font-medium leading-relaxed">
                “The average user underestimates their subscription spending by <span className="text-white font-mono font-black italic">30–50%</span>.”
              </p>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="h-px flex-1 bg-white/5"></div>
                <span className="text-[10px] font-mono">many users discover...</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-48 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto space-y-24">
          <SectionReveal className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">Everything in one place.</h2>
            <p className="text-slate-400 text-lg">A clean, focused overview designed for clarity.</p>
          </SectionReveal>

          <SectionReveal className="border border-white/10 shadow-3xl bg-[#0a0a0a] rounded overflow-hidden">
            <div className="h-8 border-b border-white/10 flex items-center px-4 gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
            </div>
            <div className="p-10 space-y-12 pointer-events-none opacity-50 brightness-150">
              <div className="grid grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-28 border border-white/10 bg-white/[0.03] p-5 flex flex-col justify-between">
                    <div className="w-12 h-1.5 bg-white/20"></div>
                    <div className="w-24 h-6 bg-white/10"></div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="h-2 w-24 bg-white/10"></div>
                <div className="flex gap-4 overflow-hidden h-32 items-end">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 bg-white/[0.05] border border-white/10 relative shrink-0" style={{ height: `${Math.random() * 80 + 20}%` }}>
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary/60"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="h-2 w-32 bg-white/20"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex justify-between items-center p-4 border border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-white/10"></div>
                          <div className="w-24 h-2 bg-white/20"></div>
                        </div>
                        <div className="w-16 h-2 bg-white/20"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="h-2 w-32 bg-white/20"></div>
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="p-6 border border-white/5 bg-white/[0.02] space-y-4">
                        <div className="w-full h-4 bg-white/20"></div>
                        <div className="w-2/3 h-4 bg-white/10"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-48 px-6 bg-primary text-black text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <SectionReveal className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
              Take control of recurring spending.
            </h2>
            <p className="text-black/60 text-xl font-bold max-w-xl mx-auto">
              Subscriptions should work for you — not the other way around. SubsTrack gives you a clear view of where your money goes, every month.
            </p>
          </SectionReveal>

          <SectionReveal>
            <button
              onClick={onStart}
              className="group px-16 py-6 bg-black text-white text-sm font-bold uppercase tracking-[0.4em] hover:bg-slate-900 transition-all flex items-center gap-4 mx-auto"
            >
              Start Tracking Your Subscriptions
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </SectionReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 max-w-[1400px] mx-auto">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Wallet className="text-primary w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest text-white">SubsTrack</span>
          </div>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Understand recurring spending.</p>
        </div>

        <div className="flex gap-12">
          <FooterLink label="Privacy" />
          <FooterLink label="Terms" />
          <FooterLink label="Contact" />
        </div>

        <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">© 2024 SubsTrack Institutional</p>
      </footer>
    </div>
  );
}

function ProblemListItem({ text }) {
  return (
    <li className="flex items-center gap-4 group">
      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
      <span className="text-slate-200 text-lg">{text}</span>
    </li>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <SectionReveal className="p-12 hover:bg-white/[0.02] transition-colors h-full flex flex-col gap-6">
      <span className="font-mono text-primary text-xl font-bold opacity-40">0{number}</span>
      <h3 className="text-xl font-bold uppercase tracking-tight text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </SectionReveal>
  );
}

function FooterLink({ label }) {
  return (
    <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
      {label}
    </a>
  );
}

// --- Auth Screen ---

function AuthScreen({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      }
      onLogin(); // Will be handled by session listener in App in a robust setup, but we'll keep the prop call for now
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen w-full flex-col md:flex-row"
    >
      {/* Left Side: Statement */}
      <div className="flex-1 bg-black/40 p-12 md:p-24 flex flex-col justify-center border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 h-full w-px bg-white/20"></div>
          <div className="absolute top-0 left-3/4 h-full w-px bg-white/20"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          <h2 className="serif-display text-5xl md:text-7xl mb-8 leading-tight italic">
            "Financial awareness starts with visibility."
          </h2>
          <p className="text-slate-300 max-w-md text-[10px] uppercase tracking-[0.3em] font-bold font-mono">
            SubsTrack Institutional Framework v4.2
          </p>
        </motion.div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 p-12 md:p-24 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight uppercase">{isSignup ? 'Initialize Account' : 'Secure Login'}</h3>
            <p className="text-slate-300 text-sm font-medium tracking-wide">Access the institutional liquidity dashboard.</p>
          </div>

          <form className="space-y-6" onSubmit={handleAuth}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}
            {isSignup && (
              <div className="space-y-2">
                <label className="mono-label !text-[9px]">Full_Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono"
                  placeholder="ALEX_R"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="mono-label !text-[9px]">Email_Protocol</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono"
                placeholder="alex@protocol.net"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="mono-label !text-[9px]">Security_Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isSignup ? 'Establish Access' : 'Authenticate')}
            </button>
          </form>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-slate-400 hover:text-white text-[10px] uppercase font-bold tracking-[0.2em] transition-colors"
            >
              {isSignup ? 'Login to existing node' : 'Create new account'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- App Shell ---

function AppShell({ children, activeView, onViewChange, user }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark relative">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md z-40">
        <div className="flex items-center gap-4">
          <Wallet className="text-primary w-6 h-6" />
          <h1 className="text-sm font-bold uppercase tracking-widest">SubsTrack</h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary transition-colors bg-white/5 overflow-hidden"
          >
            <User className="w-5 h-5 text-white" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-4 w-56 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl z-50 p-2"
              >
                <div className="p-4 border-b border-white/5">
                  <p className="text-[10px] mono-label mb-1">Authenticated_As</p>
                  <p className="font-bold text-sm tracking-tight">{user?.name || 'Authorized User'}</p>
                </div>
                <div className="p-2 space-y-1">
                  <DropdownItem icon={<User className="w-4 h-4" />} label="Profile" />
                  <DropdownItem icon={<BarChart3 className="w-4 h-4 text-primary" />} label="Admin Monitor" onClick={() => { onViewChange('admin'); setProfileOpen(false); }} />
                  <DropdownItem icon={<Settings className="w-4 h-4" />} label="Settings" />
                  <div className="h-px bg-white/5 mx-2 my-1"></div>
                  <DropdownItem icon={<LogOut className="w-4 h-4 text-red-100/40" />} label="Logout" onClick={() => window.location.reload()} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-32">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-8 md:left-1/2 md:-translate-x-1/2 z-50 px-4 pb-4 md:pb-0">
        <nav className="flex items-center justify-around md:justify-start bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-full p-2 gap-2 shadow-2xl max-w-md mx-auto md:mx-0">
          <NavButton
            active={activeView === 'dashboard'}
            onClick={() => onViewChange('dashboard')}
            icon={<Home className="w-5 h-5" />}
            label="Home"
          />
          <NavButton
            active={activeView === 'subs'}
            onClick={() => onViewChange('subs')}
            icon={<LayoutGrid className="w-5 h-5" />}
            label="Subs"
          />
          <NavButton
            active={activeView === 'flow'}
            onClick={() => onViewChange('flow')}
            icon={<History className="w-5 h-5" />}
            label="Flow"
          />
        </nav>
      </div>
    </div>
  );
}

function DropdownItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-200 hover:text-white hover:bg-white/5 transition-all"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all text-xs font-bold uppercase tracking-widest
        ${active ? 'bg-white text-black shrink-0' : 'text-slate-400 hover:text-white hover:bg-white/5'}
      `}
    >
      {icon}
      {active && <span>{label}</span>}
    </button>
  );
}

// --- Dashboard View ---

function Dashboard({ subscriptions, transactions, onAddSub, onAddFlow }) {
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const subTotal = subscriptions.reduce((acc, s) => acc + s.cost, 0);
  const remaining = monthlyIncome - monthlyExpenses - subTotal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 md:p-12 space-y-16 max-w-[1400px] mx-auto"
    >
      {/* Top Section: Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <OverviewCard label="Monthly_Income" value={monthlyIncome} color="text-slate-200" />
        <OverviewCard label="Monthly_Expenses" value={monthlyExpenses} color="text-slate-200" />
        <OverviewCard label="Subscriptions_Cost" value={subTotal} color="text-primary" />
        <OverviewCard label="Remaining_Balance" value={remaining} color="text-white" highlight />
      </div>

      {/* Upcoming Renewals */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="mono-label">Timeline</p>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Upcoming Renewals</h3>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View Calendar</button>
        </div>

        <div className="flex flex-nowrap gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {subscriptions.slice(0, 4).map(sub => (
            <RenewalCard key={sub.id} name={sub.name} domain={sub.domain} days={Math.floor(Math.random() * 30)} cost={sub.cost} />
          ))}
        </div>
      </section>

      {/* Insights and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-1">
            <p className="mono-label">Behavioral_Clarity</p>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Quick Insights</h3>
          </div>
          <div className="space-y-4">
            <InsightItem text={`“You spent ₹${subTotal} on subscriptions this month.”`} />
            <InsightItem text={`“Subscriptions account for ${Math.round((subTotal / monthlyIncome) * 100)}% of your monthly spending.”`} />
            <InsightItem text={`“Your largest recurring expense is ${subscriptions.sort((a, b) => b.cost - a.cost)[0]?.name}.”`} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-1">
            <p className="mono-label">Control_Center</p>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionButton
              icon={<Plus className="w-5 h-5" />}
              label="Add Subscription"
              color="bg-primary/20 hover:bg-primary/30 border-primary/20"
              onClick={onAddSub}
            />
            <ActionButton
              icon={<Zap className="w-5 h-5" />}
              label="Add Transaction"
              color="bg-white/5 hover:bg-white/10 border-white/5"
              onClick={onAddFlow}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OverviewCard({ label, value, color, highlight }) {
  return (
    <div className={`p-8 border border-white/5 bg-black/20 ${highlight ? 'ring-1 ring-white/10' : ''}`}>
      <p className="mono-label mb-4 text-[9px]">{label}</p>
      <div className={`text-3xl md:text-4xl font-mono tracking-tighter ${color}`}>
        <AnimatedNumber value={value} />
      </div>
    </div>
  );
}

function RenewalCard({ name, domain, days, cost, highlight }) {
  const logoUrl = getBrandLogo(domain);
  return (
    <div className="group min-w-[280px] p-6 border border-white/5 bg-black/20 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden">
      <div className="flex justify-between items-start mb-10">
        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className="w-6 h-6 object-contain transition-all"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div className={`${logoUrl ? 'hidden' : 'flex'} items-center justify-center`}>
            <Globe className="w-5 h-5 text-slate-600" />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="mono-label !text-primary !normal-case tracking-tight font-black">-{days} days</p>
          <p className="text-[10px] font-bold font-mono text-slate-300 mt-1">₹{cost}</p>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold tracking-tight lowercase">{name}</h4>
        <p className="text-[10px] text-slate-300 font-mono mt-1 font-medium">Institutional_Billed</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/20 group-hover:bg-primary transition-all"></div>
    </div>
  );
}

function InsightItem({ text }) {
  return (
    <div className="p-6 border-l-2 border-primary/30 bg-primary/5">
      <p className="serif-display text-xl text-slate-200 leading-relaxed italic">{text}</p>
    </div>
  );
}

function ActionButton({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-6 border transition-all text-xs font-bold uppercase tracking-widest text-white group ${color}`}
    >
      <div className="p-2 border border-white/10 group-hover:border-white/40 transition-colors">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

// --- Subscription Manager ---

// --- Subscription Manager View ---

function SubscriptionManager({ subscriptions, setSubscriptions, onOpenAdd }) {
  const [search, setSearch] = useState('');

  const filteredSubs = subscriptions.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.category && s.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 space-y-12 max-w-[1400px] mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-1">
          <p className="mono-label">Fleet_Status</p>
          <h2 className="text-4xl font-bold uppercase tracking-tight">Subscriptions</h2>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter nodes..."
              className="w-full bg-black/40 border border-white/5 p-4 pl-12 text-sm focus:border-white/20 outline-none transition-all font-mono"
            />
          </div>
          <button
            onClick={onOpenAdd}
            className="h-full px-6 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-slate-200 shrink-0"
          >
            + New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/5 border border-white/5 font-display transition-all">
        {filteredSubs.map(sub => (
          <SubscriptionTableCard
            key={sub.id}
            name={sub.name}
            domain={sub.domain}
            cost={sub.cost}
            cycle={sub.cycle}
            next={sub.next}
            highlight={sub.highlight}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SubscriptionTableCard({ name, domain, cost, cycle, next, highlight }) {
  const logoUrl = getBrandLogo(domain);
  return (
    <div className={`p-8 bg-background-dark hover:bg-white/[0.03] transition-all group flex flex-col gap-8 relative overflow-hidden ${highlight ? 'bg-primary/5' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="w-6 h-6 object-contain transition-all"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <div className={`${logoUrl ? 'hidden' : 'flex'} items-center justify-center`}>
              <Globe className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <h3 className="font-bold text-lg tracking-tight lowercase">{name}</h3>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Settings className="w-4 h-4 text-slate-500 hover:text-white" />
        </button>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-mono font-bold"><AnimatedNumber value={cost} /></div>
        <div className="flex items-center gap-2">
          <span className="mono-label !text-[8px]">{cycle}</span>
          <span className="h-px w-4 bg-white/10"></span>
          <span className="mono-label !text-[8px] !text-slate-400">Next: {next}</span>
        </div>
      </div>

      <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors group-hover:translate-x-1 transition-transform">
        Modify_Protocol <ChevronRight className="w-3 h-3" />
      </button>

      {highlight && <div className="absolute top-0 right-0 w-12 h-12 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>}
    </div>
  );
}

// --- Money Flow View ---

function MoneyFlow({ transactions, setTransactions, onOpenAdd }) {
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'subscription')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = monthlyIncome - monthlyExpenses;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 space-y-12 max-w-[1400px] mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-1">
          <p className="mono-label">Ledger_Sync</p>
          <h2 className="text-4xl font-bold uppercase tracking-tight">Money Flow</h2>
        </div>
        <button
          onClick={onOpenAdd}
          className="px-6 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors shrink-0"
        >
          + Add Transaction
        </button>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
        <SummaryBlock label="Total_Income" value={monthlyIncome} color="text-green-400" />
        <SummaryBlock label="Total_Expenses" value={monthlyExpenses} color="text-red-400" />
        <SummaryBlock label="Net_Balance" value={netBalance} highlight />
        <SummaryBlock label="Liquidity_Status" value="Operational" isStatus />
      </div>

      {/* Transaction List */}
      <div className="space-y-1">
        <div className="flex px-6 py-3 border-b border-white/5 text-[9px] mono-label text-slate-500 uppercase">
          <span className="flex-1">Direction / Category</span>
          <span className="w-24 text-right">Date</span>
          <span className="w-32 text-right">Amount</span>
        </div>
        <div className="divide-y divide-white/5 border border-white/5 bg-black/20">
          {transactions.map(t => (
            <div key={t.id} className="flex items-center px-6 py-5 hover:bg-white/[0.02] transition-colors group">
              <div className="flex-1 flex items-center gap-4">
                <div className={`p-2 rounded ${t.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-slate-400'}`}>
                  {t.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight uppercase">{t.category}</p>
                  <p className="text-[10px] mono-label !text-slate-500">{t.type.toUpperCase()}</p>
                </div>
              </div>
              <p className="w-24 text-right font-mono text-[11px] text-slate-400">{t.date}</p>
              <p className={`w-32 text-right font-mono font-bold ${t.type === 'income' ? 'text-green-400' : 'text-slate-200'}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SummaryBlock({ label, value, color, highlight, isStatus }) {
  return (
    <div className={`p-6 bg-black/40 ${highlight ? 'ring-1 ring-primary/20 bg-primary/5' : ''}`}>
      <p className="mono-label !text-[8px] mb-2">{label}</p>
      {isStatus ? (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xl font-bold uppercase tracking-tight tracking-widest">{value}</span>
        </div>
      ) : (
        <div className={`text-2xl font-mono font-black ${color || 'text-white'}`}>
          {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
        </div>
      )}
    </div>
  );
}

// --- Admin Dashboard View ---

function AdminDashboard({ metrics, apiLogs }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 space-y-16 max-w-[1400px] mx-auto"
    >
      <div className="space-y-1">
        <p className="mono-label">System_Access: MASTER_ADMIN</p>
        <h2 className="text-4xl font-bold uppercase tracking-tight text-white">Architecture Monitor</h2>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-white/5 border border-white/5">
        <AdminMetric label="Total_Users" value={metrics.totalUsers} />
        <AdminMetric label="Active_Sessions" value={metrics.activeSessions} />
        <AdminMetric label="API_Calls_24h" value={metrics.apiCallsToday} />
        <AdminMetric label="Total_Subs" value={metrics.totalSubscriptions} />
        <AdminMetric label="Ledger_Entries" value={metrics.totalTransactions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* API Monitoring */}
        <div className="space-y-6">
          <h3 className="mono-label !text-primary">API_Protocol_Monitoring</h3>
          <div className="border border-white/5 bg-black/40 overflow-hidden">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-white/5 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-normal">Endpoint</th>
                  <th className="px-4 py-3 font-normal text-right">Calls</th>
                  <th className="px-4 py-3 font-normal text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {apiLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-slate-300">{log.endpoint}</td>
                    <td className="px-4 py-3 text-right">{log.requests}</td>
                    <td className="px-4 py-3 text-right text-primary">{log.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testing Controls */}
        <div className="space-y-6">
          <h3 className="mono-label !text-primary">Simulated_Controls</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ControlToggle label="Test_Mode" active />
            <ControlToggle label="High_Traffic_Sim" />
            <ControlToggle label="Reset_Demo_Buffer" />
            <ControlToggle label="Verbose_Logging" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AdminMetric({ label, value }) {
  return (
    <div className="p-6 bg-black/40">
      <p className="mono-label !text-[8px] mb-2">{label}</p>
      <p className="text-2xl font-mono font-bold text-white tracking-tighter">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function ControlToggle({ label, active }) {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] hover:border-white/20 transition-all">
      <span className="mono-label !text-[10px]">{label}</span>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`w-10 h-5 rounded-full relative transition-colors ${isOn ? 'bg-primary' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isOn ? 'right-1' : 'left-1'}`}></div>
      </button>
    </div>
  );
}
