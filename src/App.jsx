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
  // Fallback to clearbit for reliable logos without API keys
  return `https://logo.clearbit.com/${domain}`;
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
      {typeof value === 'number' ? (
        <>
          {prefix}{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(Math.floor(displayValue))}
          {suffix}
        </>
      ) : (
        <span>{value}</span>
      )}
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
  const [flows, setFlows] = useState([]);
  const [activeFlowId, setActiveFlowId] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('subs-theme') || 'dark');

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('subs-theme', theme);
  }, [theme]);
  const [apiLogs, setApiLogs] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState({ totalUsers: 0, activeSessions: 0, apiCallsToday: 0, totalSubscriptions: 0, totalTransactions: 0 });

  // Modal State { type: string, isOpen: boolean, data?: any }
  const [modal, setModal] = useState({ type: null, isOpen: false, data: null });

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
        if (window.location.pathname === '/masteradmin') {
          setView('admin');
        } else if (view === 'landing' || view === 'auth') {
          setView('dashboard');
        }
      } else {
        setIsAdmin(false);
        setSubscriptions([]);
        setTransactions([]);
        if (view !== 'landing' && view !== 'auth') {
          setView('landing');
          window.history.pushState({ view: 'landing' }, '', '/');
        }
      }
    });

    const handlePopState = (e) => {
      if (e.state && e.state.view) {
        setView(e.state.view);
      } else {
        // Fallback based on URL
        if (window.location.pathname === '/masteradmin') setView('admin');
        else if (window.location.pathname === '/') setView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const checkAdminStatus = async (userId) => {
    try {
      const { data } = await supabase.from('master_admins').select('id').eq('user_id', userId).single();
      setIsAdmin(!!data);
      if (!!data) {
        fetchAdminMetrics();
      }
    } catch (e) {
      setIsAdmin(false);
    }
  };

  const fetchAdminMetrics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_metrics');
      if (data) {
        setAdminMetrics(data);
      }
    } catch (e) {
      console.error("Error fetching admin metrics:", e);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const { data: subs } = await supabase.from('subscriptions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (subs) setSubscriptions(subs);

      const { data: userFlows } = await supabase.from('money_flows').select('*').eq('user_id', userId).order('created_at', { ascending: true });
      let currentFlowId = null;
      if (userFlows && userFlows.length > 0) {
        setFlows(userFlows);
        currentFlowId = userFlows[0].id;
        setActiveFlowId(currentFlowId);
      } else {
        const { data: newFlow } = await supabase.from('money_flows').insert([{ user_id: userId, name: 'Main Ledger' }]).select();
        if (newFlow && newFlow[0]) {
          setFlows([newFlow[0]]);
          currentFlowId = newFlow[0].id;
          setActiveFlowId(currentFlowId);
        }
      }

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
    if (newView === 'admin') {
      window.history.pushState({ view: newView }, '', '/masteradmin');
    } else {
      window.history.pushState({ view: newView }, '', '/');
    }
  };

  const handleAddSubscription = async (subData) => {
    if (!user) return;
    try {
      const dbSub = {
        name: subData.name,
        domain: subData.domain,
        cost: subData.cost,
        cycle: subData.cycle,
        category: subData.category || 'Software',
        hide_cost: subData.hide_cost || false,
        flow_id: subData.flow_id || null,
        is_free_trial: subData.is_free_trial || false,
        trial_end_date: subData.trial_end_date || null
      };

      if (subData.id) {
        // Edit existing
        const { error } = await supabase.from('subscriptions').update(dbSub).eq('id', subData.id);
        if (error) throw error;
        setSubscriptions(prev => prev.map(s => s.id === subData.id ? { ...s, ...dbSub } : s));
      } else {
        // Create new
        dbSub.user_id = user.id;
        dbSub.next_billing_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Dummy 30 days
        const { data, error } = await supabase.from('subscriptions').insert([dbSub]).select();
        if (error) throw error;
        if (data && data[0]) {
          setSubscriptions([data[0], ...subscriptions]);
        }
      }
    } catch (e) {
      console.error("Error saving subscription:", e);
    } finally {
      setModal({ type: null, isOpen: false, data: null });
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (!window.confirm("Are you sure you want to terminate this subscription node?")) return;
    try {
      const { error } = await supabase.from('subscriptions').delete().eq('id', id);
      if (error) throw error;
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      setModal({ type: null, isOpen: false, data: null });
    } catch (e) {
      console.error("Error deleting subscription:", e);
    }
  };

  const handleAddTransaction = async (newTx) => {
    if (!user) return;
    try {
      const dbTx = {
        user_id: user.id,
        flow_id: activeFlowId,
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

        {(view === 'dashboard' || view === 'subs' || view === 'flow' || view === 'admin' || view === 'profile' || view === 'settings') && (
          <AppShell key="app" activeView={view} onViewChange={navigateTo} user={user}>
            {view === 'dashboard' && (
              <Dashboard
                subscriptions={subscriptions}
                transactions={transactions}
                onAddSub={() => setModal({ type: 'subscription', isOpen: true })}
                onAddFlow={() => setModal({ type: 'transaction', isOpen: true })}
                onViewChange={navigateTo}
              />
            )}
            {view === 'subs' && (
              <SubscriptionManager
                subscriptions={subscriptions}
                setSubscriptions={setSubscriptions}
                onOpenAdd={() => setModal({ type: 'subscription', isOpen: true, data: null })}
                onEditSub={(sub) => setModal({ type: 'subscription', isOpen: true, data: sub })}
              />
            )}
            {view === 'flow' && (
              <MoneyFlow
                flows={flows}
                setFlows={setFlows}
                activeFlowId={activeFlowId || 'all'}
                setActiveFlowId={setActiveFlowId}
                transactions={transactions}
                setTransactions={setTransactions}
                onOpenAdd={() => setModal({ type: 'transaction', isOpen: true })}
                user={user}
              />
            )}
            {view === 'admin' && (
              isAdmin ? (
                <AdminDashboard
                  metrics={adminMetrics}
                  apiLogs={apiLogs}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <p className="mono-label text-slate-500 animate-pulse">Checking Authorization Clearance...</p>
                  <p className="text-xs font-mono text-slate-600">If this persists, ensure your User ID is registered in the master_admins table.</p>
                </div>
              )
            )}
            {view === 'profile' && (
              <ProfileView
                user={user}
                subscriptions={subscriptions}
                transactions={transactions}
                flows={flows}
              />
            )}
            {view === 'settings' && (
              <SettingsView
                user={user}
                flows={flows}
                setFlows={setFlows}
                activeFlowId={activeFlowId}
                setActiveFlowId={setActiveFlowId}
                setTransactions={setTransactions}
                theme={theme}
                setTheme={setTheme}
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
                <SubscriptionForm
                  onSubmit={handleAddSubscription}
                  onDelete={handleDeleteSubscription}
                  onCancel={() => setModal({ type: null, isOpen: false, data: null })}
                  initialData={modal.data}
                  flows={flows}
                  activeFlowId={activeFlowId}
                />
              )}
              {modal.type === 'transaction' && (
                <TransactionForm
                  onSubmit={handleAddTransaction}
                  onCancel={() => setModal({ ...modal, isOpen: false })}
                  flows={flows}
                  activeFlowId={activeFlowId}
                />
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

function SubscriptionForm({ onSubmit, onCancel, initialData, flows = [], activeFlowId }) {
  const [formData, setFormData] = useState(initialData || {
    name: '', domain: '', cost: '', cycle: 'Monthly', category: 'Software',
    hide_cost: false, flow_id: activeFlowId || (flows.length > 0 ? flows[0].id : null),
    is_free_trial: false, trial_end_date: ''
  });

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
            className="w-full bg-black border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none appearance-none cursor-pointer"
            value={formData.cycle}
            onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
          >
            <option className="bg-[#0a0a0a] text-slate-200">Monthly</option>
            <option className="bg-[#0a0a0a] text-slate-200">Annual</option>
            <option className="bg-[#0a0a0a] text-slate-200">Usage</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hide_cost"
              checked={formData.hide_cost}
              onChange={(e) => setFormData({ ...formData, hide_cost: e.target.checked })}
              className="accent-primary"
            />
            <label htmlFor="hide_cost" className="mono-label !text-[9px] cursor-pointer">Hide_Cost_On_Dashboard</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_free_trial"
              checked={formData.is_free_trial}
              onChange={(e) => setFormData({ ...formData, is_free_trial: e.target.checked })}
              className="accent-primary"
            />
            <label htmlFor="is_free_trial" className="mono-label !text-[9px] cursor-pointer">Active_Free_Trial</label>
          </div>
        </div>

        {formData.is_free_trial && (
          <div className="space-y-2">
            <label className="mono-label !text-[9px]">Trial_End_Date</label>
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none"
              value={formData.trial_end_date || ''}
              onChange={(e) => setFormData({ ...formData, trial_end_date: e.target.value })}
            />
          </div>
        )}
      </div>

      {flows.length > 0 && (
        <div className="space-y-2">
          <label className="mono-label !text-[9px]">Source_Ledger (Flow)</label>
          <select
            className="w-full bg-black border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none appearance-none cursor-pointer"
            value={formData.flow_id || ''}
            onChange={(e) => setFormData({ ...formData, flow_id: e.target.value })}
          >
            {flows.map(f => (
              <option key={f.id} value={f.id} className="bg-[#0a0a0a] text-slate-200">{f.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button type="submit" className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors">
          {formData.id ? 'Save Changes' : 'Establish Subscription'}
        </button>
        {formData.id && (
          <button
            type="button"
            onClick={() => onDelete(formData.id)}
            className="px-6 py-4 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10 transition-colors"
          >
            Delete
          </button>
        )}
        <button type="button" onClick={onCancel} className="px-8 py-4 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// --- Transaction Form ---

function TransactionForm({ onSubmit, onCancel, flows = [], activeFlowId }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    type: 'expense',
    flow_id: activeFlowId || (flows.length > 0 ? flows[0].id : null)
  });

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

      {flows.length > 0 && (
        <div className="space-y-2">
          <label className="mono-label !text-[9px]">Target_Ledger (Flow)</label>
          <select
            className="w-full bg-black border border-white/10 p-4 font-mono text-sm focus:border-primary outline-none appearance-none cursor-pointer"
            value={formData.flow_id || ''}
            onChange={(e) => setFormData({ ...formData, flow_id: e.target.value })}
          >
            {flows.map(f => (
              <option key={f.id} value={f.id} className="bg-[#0a0a0a] text-slate-200">{f.name}</option>
            ))}
          </select>
        </div>
      )}

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
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md relative z-50">
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
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setProfileOpen(false)}></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-4 w-56 bg-[#0a0a0a] border border-white/10 shadow-2xl z-50 p-2"
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="text-[10px] mono-label mb-1">Authenticated_As</p>
                    <p className="font-bold text-sm tracking-tight">{user?.name || 'Authorized User'}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <DropdownItem icon={<User className="w-4 h-4" />} label="Profile" onClick={() => { onViewChange('profile'); setProfileOpen(false); }} />
                    <DropdownItem icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => { onViewChange('settings'); setProfileOpen(false); }} />
                    <div className="h-px bg-white/5 mx-2 my-1"></div>
                    <DropdownItem icon={<LogOut className="w-4 h-4 text-red-100/40" />} label="Logout" onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide relative flex flex-col pt-2 md:pt-0">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 w-full flex justify-center z-50 px-4 pointer-events-none">
        <nav className="flex items-center bg-[#0a0a0a] border border-white/10 rounded-full p-2 gap-1 shadow-2xl pointer-events-auto">
          <NavButton
            active={activeView === 'dashboard'}
            onClick={() => onViewChange('dashboard')}
            icon={<Home className="w-[18px] h-[18px]" />}
            label="HOME"
          />
          <NavButton
            active={activeView === 'subs'}
            onClick={() => onViewChange('subs')}
            icon={<LayoutGrid className="w-[18px] h-[18px]" />}
            label="SUBS"
          />
          <NavButton
            active={activeView === 'flow'}
            onClick={() => onViewChange('flow')}
            icon={<History className="w-[18px] h-[18px]" />}
            label="FLOW"
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
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-[11px] font-bold uppercase tracking-wider
        ${active ? 'bg-white text-black shrink-0 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}
      `}
    >
      {icon}
      {active && <span>{label}</span>}
    </button>
  );
}

// --- Dashboard View ---

function Dashboard({ subscriptions, transactions, onAddSub, onAddFlow, onViewChange }) {
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const subTotal = subscriptions
    .filter(s => !s.hide_cost && !s.is_free_trial)
    .reduce((acc, s) => acc + (s.cost || 0), 0);
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
          <button onClick={() => onViewChange('subs')} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View Calendar</button>
        </div>

        <div className="flex flex-nowrap gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {subscriptions.slice(0, 4).map(sub => (
            <RenewalCard key={sub.id} name={sub.name} domain={sub.domain} days={Math.floor(Math.random() * 30)} cost={sub.cost || 0} />
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
            {monthlyIncome > 0 && (
              <InsightItem text={`“Subscriptions account for ${Math.round((subTotal / monthlyIncome) * 100)}% of your monthly spending.”`} />
            )}
            {subscriptions.length > 0 && (
              <InsightItem text={`“Your largest recurring expense is ${[...subscriptions].sort((a, b) => (b.cost || 0) - (a.cost || 0))[0]?.name || 'Unknown'}.”`} />
            )}
            {subscriptions.length === 0 && (
              <InsightItem text="“No active subscription protocols detected in the current node.”" />
            )}
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
    <div className={`p-6 md:p-8 border border-white/5 bg-black/20 ${highlight ? 'ring-1 ring-white/10' : ''}`}>
      <p className="mono-label mb-4 text-[9px]">{label}</p>
      <div className={`text-2xl md:text-3xl lg:text-4xl font-mono tracking-tighter ${color}`}>
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

function SubscriptionManager({ subscriptions, setSubscriptions, onOpenAdd, onEditSub }) {
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
            cost={sub.hide_cost ? "••••" : (sub.is_free_trial ? "FREE" : sub.cost)}
            cycle={sub.cycle}
            next={sub.is_free_trial ? (sub.trial_end_date ? `Trial ends ${sub.trial_end_date}` : 'Trial Active') : sub.next}
            highlight={sub.highlight}
            onEdit={() => onEditSub(sub)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SubscriptionTableCard({ name, domain, cost, cycle, next, highlight, onEdit }) {
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
        <button onClick={onEdit} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded">
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

      <button onClick={onEdit} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors group-hover:translate-x-1 transition-transform">
        Modify_Protocol <ChevronRight className="w-3 h-3" />
      </button>

      {highlight && <div className="absolute top-0 right-0 w-12 h-12 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>}
    </div>
  );
}

// --- Money Flow View ---

function MoneyFlow({ flows, setFlows, activeFlowId, setActiveFlowId, transactions, setTransactions, onOpenAdd, user }) {
  const [isFlowMenuOpen, setIsFlowMenuOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'

  // If activeFlowId is 'all', we use all transactions. Otherwise, filter by flow_id (or null for legacy)
  const flowTransactions = activeFlowId === 'all'
    ? transactions
    : transactions.filter(t => t.flow_id === activeFlowId || (!t.flow_id && flows.length > 0 && activeFlowId === flows[0].id));

  const filteredTransactions = flowTransactions.filter(t => {
    if (typeFilter === 'all') return true;
    if (typeFilter === 'income') return t.type === 'income';
    if (typeFilter === 'expense') return t.type === 'expense' || t.type === 'subscription';
    return true;
  });

  const monthlyIncome = flowTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = flowTransactions
    .filter(t => t.type === 'expense' || t.type === 'subscription')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = monthlyIncome - monthlyExpenses;
  const activeFlow = activeFlowId === 'all' ? { name: 'All Ledgers' } : (flows.find(f => f.id === activeFlowId) || { name: 'Main Ledger' });

  const handleCreateFlow = async () => {
    const name = window.prompt("Enter new flow name (e.g., Business, Savings):");
    if (!name || !name.trim() || !user) return;
    try {
      const { data, error } = await supabase.from('money_flows').insert([{ user_id: user.id, name: name.trim() }]).select();
      if (error) throw error;
      if (data && data[0]) {
        setFlows([...flows, data[0]]);
        setActiveFlowId(data[0].id);
        setIsFlowMenuOpen(false);
      }
    } catch (err) { console.error("Error creating flow", err); }
  };

  const handleDeleteFlow = async () => {
    if (flows.length <= 1) return alert("System requires at least one flow ledger active.");
    if (!window.confirm(`[WARNING] Destructive Operation\nDelete flow "${activeFlow.name}" and ALL its entries?`)) return;
    try {
      await supabase.from('money_flows').delete().eq('id', activeFlowId);
      const remaining = flows.filter(f => f.id !== activeFlowId);
      setFlows(remaining);
      setActiveFlowId(remaining[0].id);
      setTransactions(prev => prev.filter(t => t.flow_id !== activeFlowId));
      setIsOptionsOpen(false);
    } catch (err) { console.error("Error deleting flow", err); }
  };

  const handleResetFlow = async () => {
    if (!window.confirm(`[WARNING] Destructive Operation\nClear ALL transactions from "${activeFlow.name}"?`)) return;
    try {
      await supabase.from('transactions').delete().eq('flow_id', activeFlowId);
      setTransactions(prev => prev.filter(t => t.flow_id !== activeFlowId));
      setIsOptionsOpen(false);
    } catch (err) { console.error("Error resetting flow", err); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 space-y-12 max-w-[1400px] mx-auto pb-40"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8 relative">
        <div className="space-y-4">
          <p className="mono-label">Ledger_Sync</p>

          <div className="relative">
            <button
              onClick={() => { setIsFlowMenuOpen(!isFlowMenuOpen); setIsOptionsOpen(false); }}
              className="flex items-center gap-4 hover:opacity-75 transition-opacity"
            >
              <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight">{activeFlow.name}</h2>
              <ChevronRight className={`w-5 h-5 md:w-6 md:h-6 transition-transform ${isFlowMenuOpen ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {isFlowMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-4 w-64 bg-[#0a0a0a] border border-white/10 shadow-2xl z-40 p-2"
                >
                  <p className="mono-label !text-[8px] p-2 mb-2 border-b border-white/5 text-primary">Select_Flow_Matrix</p>
                  <button
                    onClick={() => { setActiveFlowId('all'); setIsFlowMenuOpen(false); }}
                    className={`w-full text-left px-3 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeFlowId === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                  >
                    All Ledgers
                  </button>
                  <div className="h-px bg-white/5 my-2 mx-2"></div>
                  {flows.map(f => (
                    <button
                      key={f.id}
                      onClick={() => { setActiveFlowId(f.id); setIsFlowMenuOpen(false); }}
                      className={`w-full text-left px-3 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeFlowId === f.id ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                    >
                      {f.name}
                    </button>
                  ))}
                  <div className="h-px bg-white/5 my-2 mx-2"></div>
                  <button
                    onClick={handleCreateFlow}
                    className="w-full flex items-center gap-2 px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Initialize New Flow
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleCreateFlow}
            className="flex items-center gap-2 px-3 py-2 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Plus className="w-3 h-3" /> New Flow
          </button>
        </div>

        <div className="flex gap-2 md:gap-4 items-center w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <button
              onClick={() => { setIsOptionsOpen(!isOptionsOpen); setIsFlowMenuOpen(false); }}
              className="w-full md:w-auto p-4 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all h-[52px] flex items-center justify-center"
            >
              <Settings className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isOptionsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a] border border-red-500/20 shadow-2xl z-40 p-2"
                >
                  <p className="mono-label !text-[8px] p-2 text-red-500/70">Flow_Controls</p>
                  <button onClick={handleResetFlow} className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    Reset Transactions
                  </button>
                  <button onClick={handleDeleteFlow} className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    Delete Flow
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onOpenAdd}
            className="flex-1 md:flex-none px-6 py-4 bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors shrink-0 h-[52px] flex items-center justify-center"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
        <SummaryBlock label="Total_Income" value={monthlyIncome} color="text-green-400" />
        <SummaryBlock label="Total_Expenses" value={monthlyExpenses} color="text-red-400" />
        <SummaryBlock label="Net_Balance" value={netBalance} highlight />
        <SummaryBlock label="Liquidity_Status" value={netBalance >= 0 ? "Operational" : "Deficit"} isStatus />
      </div>

      {/* Filters Banner */}
      <div className="flex gap-2">
        {['all', 'income', 'expense'].map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-4 py-2 border font-mono text-[10px] uppercase font-bold tracking-widest transition-colors ${typeFilter === type ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/10 hover:bg-white/5'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-1">
        <div className="flex px-6 py-3 border-b border-white/5 text-[9px] mono-label text-slate-500 uppercase">
          <span className="flex-1">Direction / Category</span>
          <span className="w-24 text-right">Date</span>
          <span className="w-32 text-right">Amount</span>
        </div>
        <div className="divide-y divide-white/5 border border-white/5 bg-black/20">
          {filteredTransactions.map(t => (
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
    <div className={`p-4 md:p-6 bg-black/40 ${highlight ? 'ring-1 ring-primary/20 bg-primary/5' : ''}`}>
      <p className="mono-label !text-[8px] mb-2">{label}</p>
      {isStatus ? (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm md:text-lg lg:text-xl font-bold uppercase tracking-widest truncate">{value}</span>
        </div>
      ) : (
        <div className={`text-lg md:text-2xl font-mono font-black ${color || 'text-white'} truncate`}>
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
        {(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

function ControlToggle({ label, active }) {
  const [isOn, setIsOn] = useState(active);
  return (
    <div
      className={`p-4 border font-mono text-xs cursor-pointer select-none flex justify-between items-center transition-colors
        ${isOn ? 'border-primary/50 bg-primary/10 text-primary' : 'border-white/10 bg-black/40 text-slate-500 hover:text-white'}
      `}
      onClick={() => setIsOn(!isOn)}
    >
      <span>{label}</span>
      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isOn ? 'bg-primary' : 'bg-white/10'}`}>
        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isOn ? 'translate-x-4' : ''}`}></div>
      </div>
    </div>
  );
}

// --- Profile View ---

function ProfileView({ user, subscriptions, transactions, flows }) {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [nameDisplay, setNameDisplay] = useState(user?.user_metadata?.full_name || 'Authorized User');

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === nameDisplay) return setEditingName(false);
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName }
      });
      if (error) throw error;
      setNameDisplay(newName);
      setEditingName(false);
    } catch (err) {
      console.error("Error updating name:", err);
    } finally {
      setLoading(false);
    }
  };

  const accountCreated = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown_Date';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 space-y-12 max-w-4xl mx-auto"
    >
      <div className="space-y-1">
        <p className="mono-label">Identity_Module</p>
        <h2 className="text-4xl font-bold uppercase tracking-tight">System Profile</h2>
      </div>

      <div className="bg-black/40 border border-white/5 p-8 flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative z-10">
          <User className="w-10 h-10 text-slate-400" />
        </div>

        <div className="flex-1 space-y-4 relative z-10 w-full">
          <div className="space-y-1">
            {editingName ? (
              <div className="flex gap-2 w-full max-w-sm">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-black/50 border border-white/20 px-3 py-1 text-xl font-bold uppercase tracking-tight outline-none focus:border-primary w-full"
                  autoFocus
                />
                <button onClick={handleUpdateName} disabled={loading} className="px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 shrink-0">
                  {loading ? '...' : 'SAVE'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-bold uppercase tracking-tight text-white">{nameDisplay}</h3>
                <button onClick={() => setEditingName(true)} className="text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-white transition-colors">
                  [EDIT]
                </button>
              </div>
            )}
            <p className="text-sm font-mono text-slate-400">{user?.email}</p>
          </div>
          <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
            <div>
              <p className="mono-label !text-[8px]">Enlistment_Date</p>
              <p className="text-sm font-mono text-slate-300">{accountCreated}</p>
            </div>
            <div>
              <p className="mono-label !text-[8px]">Security_Status</p>
              <p className="text-sm font-mono text-green-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 border border-white/5">
        <div className="p-8 bg-black/40">
          <p className="mono-label !text-[8px] mb-2">Tracked_Subs</p>
          <p className="text-3xl font-mono font-bold">{subscriptions.length}</p>
        </div>
        <div className="p-8 bg-black/40">
          <p className="mono-label !text-[8px] mb-2">Ledger_Entries</p>
          <p className="text-3xl font-mono font-bold">{transactions.length}</p>
        </div>
        <div className="p-8 bg-black/40">
          <p className="mono-label !text-[8px] mb-2">Active_Flows</p>
          <p className="text-3xl font-mono font-bold">{flows?.length || 0}</p>
        </div>
      </div>
    </motion.div>
  );
}

// --- Settings View ---

function SettingsView({ user, flows, setFlows, activeFlowId, setActiveFlowId, setTransactions, theme, setTheme }) {
  const [currency, setCurrency] = useState('₹');
  const [cycle, setCycle] = useState('Monthly');
  const [showChangelog, setShowChangelog] = useState(false);

  const handleCreateFlow = async () => {
    const name = window.prompt("Enter new ledger name (e.g., Savings, Personal, Business):");
    if (!name || !name.trim() || !user) return;
    try {
      const { data, error } = await supabase.from('money_flows').insert([{ user_id: user.id, name: name.trim() }]).select();
      if (error) throw error;
      if (data && data[0]) {
        setFlows([...flows, data[0]]);
        setActiveFlowId(data[0].id);
      }
    } catch (err) { console.error("Error creating flow", err); }
  };

  const handleDeleteFlow = async (flowId, flowName) => {
    if (flows.length <= 1) return alert("System requires at least one active ledger.");
    if (!window.confirm(`[WARNING] Destructive Operation\nDelete ledger "${flowName}" and ALL its transactions?`)) return;
    try {
      await supabase.from('money_flows').delete().eq('id', flowId);
      const remaining = flows.filter(f => f.id !== flowId);
      setFlows(remaining);
      if (activeFlowId === flowId) setActiveFlowId(remaining[0].id);
      setTransactions(prev => prev.filter(t => t.flow_id !== flowId));
    } catch (err) { console.error("Error deleting flow", err); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 space-y-12 max-w-4xl mx-auto"
    >
      <div className="space-y-1">
        <p className="mono-label">System_Preferences</p>
        <h2 className="text-4xl font-bold uppercase tracking-tight">Settings</h2>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="space-y-4">
          <h3 className="mono-label !text-primary border-b border-white/5 pb-2">General_Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 p-6">
              <p className="mono-label !text-[10px] mb-4">Base_Currency</p>
              <div className="flex bg-white/5 rounded p-1 font-mono text-sm max-w-[200px]">
                {['₹', '$', '€'].map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex-1 py-2 text-center rounded transition-colors ${currency === c ? 'bg-primary text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-black/40 border border-white/5 p-6">
              <p className="mono-label !text-[10px] mb-4">Default_Billing_Cycle</p>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className="w-full bg-black border border-white/10 p-3 font-mono text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
              >
                <option value="Monthly" className="bg-[#0a0a0a] text-slate-200">Monthly</option>
                <option value="Yearly" className="bg-[#0a0a0a] text-slate-200">Yearly</option>
                <option value="Weekly" className="bg-[#0a0a0a] text-slate-200">Weekly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ledger Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="mono-label !text-primary">Ledger_Configuration</h3>
            <button onClick={handleCreateFlow} className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Ledger
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flows.map(f => (
              <div key={f.id} className="bg-black/40 border border-white/5 p-4 flex justify-between items-center group">
                <div>
                  <p className="font-bold uppercase tracking-widest text-sm">{f.name}</p>
                  <p className="mono-label !text-[8px] text-slate-500 mt-1">ID: {f.id.split('-')[0]}</p>
                </div>
                <button
                  onClick={() => handleDeleteFlow(f.id, f.name)}
                  className="p-2 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Ledger"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="mono-label !text-primary border-b border-white/5 pb-2">Notification_Protocols</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ControlToggle label="Renewal_Reminders" active={true} />
            <ControlToggle label="Monthly_Spending_Summary" active={true} />
            <ControlToggle label="Financial_Insights" active={false} />
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="mono-label !text-primary border-b border-white/5 pb-2">Interface_Appearance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 p-6 flex justify-between items-center group">
              <div>
                <p className="mono-label !text-[10px]">Theme_Mode</p>
                <p className="font-bold uppercase tracking-widest text-sm mt-1">{theme}_Protocol</p>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <ControlToggle label="Compact_Ledger_Layout" active={false} />
          </div>
        </div>

        {/* System Version & Changelog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="mono-label !text-primary">System_Manifest</h3>
            <button
              onClick={() => setShowChangelog(!showChangelog)}
              className="text-[9px] font-mono text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
              {showChangelog ? '[HIDE_LOG]' : '[VIEW_VERSION_LOG]'}
            </button>
          </div>

          <div className="bg-black/40 border border-white/5 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[11px] font-bold text-slate-300 uppercase tracking-widest">Protocol Evolution v1.2.4</p>
              <p className="text-[10px] font-mono text-slate-500">2026-03-07</p>
            </div>

            <AnimatePresence>
              {showChangelog && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4 mt-6 pt-6 border-t border-white/5"
                >
                  <div className="space-y-3">
                    <p className="text-[10px] mono-label text-slate-500">_Recent_Updates</p>
                    <ul className="space-y-2 text-[11px] font-mono text-slate-400">
                      <li>• [FEATURE] Integrated multi-mode theme engine (Light/Dark Switch).</li>
                      <li>• [FEATURE] Deployed global navigational footer with system telemetry.</li>
                      <li>• [OPTIMIZATION] Reconfigured Vite rollup layers for modular chunk distribution.</li>
                      <li>• [MOBILE] Optimized responsive grid layers for vertical viewports.</li>
                      <li>• [FIX] Resolved Subscription_Cost aggregation logic across hidden protocols.</li>
                      <li>• [FIX] Rectified gear icon interaction on individual fleet cards.</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-4 pt-8">
          <h3 className="mono-label text-red-400 border-b border-red-500/20 pb-2">Data_Management</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> Export User Data (CSV)
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="px-8 py-12 md:py-20 border-t border-white/5 bg-black/20 mt-16 md:mt-32 relative z-10 pb-40 md:pb-48">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-primary w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest text-white">SubsTrack</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed font-mono uppercase tracking-tight">
            Synthesizing code and aesthetics to build digital products that feel as good as they work.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-12 lg:col-span-2">
          <div className="space-y-6">
            <p className="mono-label !text-[9px] !text-slate-500">Navigation_Node</p>
            <div className="flex flex-col gap-3">
              <button className="text-[11px] uppercase font-bold text-slate-400 hover:text-white transition-all text-left tracking-widest">Dashboard</button>
              <button className="text-[11px] uppercase font-bold text-slate-400 hover:text-white transition-all text-left tracking-widest">Fleet_Overview</button>
              <button className="text-[11px] uppercase font-bold text-slate-400 hover:text-white transition-all text-left tracking-widest">Ledger_Access</button>
            </div>
          </div>
          <div className="space-y-6">
            <p className="mono-label !text-[9px] !text-slate-500">Developer_Auth</p>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/anonically22" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                <Globe className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary transition-colors" />
                <span className="text-[11px] uppercase font-bold text-slate-400 group-hover:text-white transition-all tracking-widest">GitHub_Repo</span>
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="mono-label !text-[9px] !text-slate-500">System_Status</p>
          <div className="p-4 border border-white/5 bg-white/5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">All_Systems_Nominal</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-8 mt-8 md:pt-16 md:mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          © 2026 Crafted with <span className="text-red-500/80">♥</span> by <span className="text-slate-200">anonical</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary/40"></div>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Build_Rev 1.2.4</p>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block"></div>
          <button
            onClick={() => {
              const main = document.querySelector('main');
              if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[10px] font-mono text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors group"
          >
            Terminal_Top <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
