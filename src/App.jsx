import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap
} from 'lucide-react';

/**
 * SubsTrack Core Application
 * Aesthetic: Institutional, Calm, Analytical, Precise.
 */

// --- Shared Components ---

function AnimatedNumber({ value, prefix = "₹", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    const duration = 1500;
    let startTime = null;

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
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

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState('landing'); // landing, auth, dashboard, subs, flow
  const [user, setUser] = useState(null);

  const navigateTo = (newView) => setView(newView);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-sans selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingView key="landing" onStart={() => navigateTo('auth')} />
        )}

        {view === 'auth' && (
          <AuthScreen key="auth" onLogin={() => {
            setUser({ name: 'Alex' });
            navigateTo('dashboard');
          }} />
        )}

        {(view === 'dashboard' || view === 'subs' || view === 'flow') && (
          <AppShell key="app" activeView={view} onViewChange={navigateTo} user={user}>
            {view === 'dashboard' && <Dashboard />}
            {view === 'subs' && <SubscriptionManager />}
            {view === 'flow' && <MoneyFlow />}
          </AppShell>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Landing View (Updated for consistency) ---

function LandingView({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
    >
      <h1 className="serif-display text-6xl md:text-8xl mb-8 leading-tight">
        Your money is<br />quietly leaving.
      </h1>
      <p className="max-w-xl text-slate-400 text-lg mb-12 font-medium">
        Subscriptions are designed to disappear into the background.
        SubsTrack brings them back into focus.
      </p>
      <button
        onClick={onStart}
        className="px-12 py-5 border border-primary/50 text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-primary transition-all overflow-hidden group relative"
      >
        <span className="relative z-10">Start Tracking</span>
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary transition-colors"></div>
      </button>
    </motion.div>
  );
}

// --- Auth Screen ---

function AuthScreen({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);

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
          <p className="text-slate-500 max-w-md text-sm uppercase tracking-widest font-bold font-mono">
            SubsTrack Institutional Framework v4.2
          </p>
        </motion.div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 p-12 md:p-24 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight uppercase">{isSignup ? 'Initialize Account' : 'Secure Login'}</h3>
            <p className="text-slate-500 text-sm">Access the institutional liquidity dashboard.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            {isSignup && (
              <div className="space-y-2">
                <label className="mono-label !text-[9px]">Full_Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono" placeholder="ALEX_R" required />
              </div>
            )}
            <div className="space-y-2">
              <label className="mono-label !text-[9px]">Email_Protocol</label>
              <input type="email" className="w-full bg-black/50 border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono" placeholder="alex@protocol.net" required />
            </div>
            <div className="space-y-2">
              <label className="mono-label !text-[9px]">Security_Key</label>
              <input type="password" className="w-full bg-black/50 border border-white/10 p-4 focus:border-primary outline-none transition-colors font-mono" placeholder="••••••••" required />
            </div>

            <button className="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors">
              {isSignup ? 'Establish Access' : 'Authenticate'}
            </button>
          </form>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-slate-500 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors"
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
            <User className="w-5 h-5 text-slate-400" />
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
                  <DropdownItem icon={<Settings className="w-4 h-4" />} label="Settings" />
                  <DropdownItem icon={<LogOut className="w-4 h-4 text-red-400" />} label="Logout" onClick={() => window.location.reload()} />
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

      {/* Floating Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-2 gap-2 shadow-2xl">
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
      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all"
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
        ${active ? 'bg-white text-black shrink-0' : 'text-slate-500 hover:text-white hover:bg-white/5'}
      `}
    >
      {icon}
      {active && <span>{label}</span>}
    </button>
  );
}

// --- Dashboard View ---

function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 md:p-12 space-y-16 max-w-[1400px] mx-auto"
    >
      {/* Top Section: Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <OverviewCard label="Monthly_Income" value={45000} color="text-slate-400" />
        <OverviewCard label="Monthly_Expenses" value={21000} color="text-slate-400" />
        <OverviewCard label="Subscriptions_Cost" value={1800} color="text-primary" />
        <OverviewCard label="Remaining_Balance" value={22200} color="text-white" highlight />
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
          <RenewalCard name="Netflix" days={5} cost={499} icon="https://www.netflix.com/favicon.ico" />
          <RenewalCard name="Spotify" days={12} cost={119} icon="https://www.spotify.com/favicon.ico" />
          <RenewalCard name="AWS Node" days={18} cost={850} icon="https://aws.amazon.com/favicon.ico" />
          <RenewalCard name="GitHub Copilot" days={22} cost={1000} icon="https://github.com/favicon.ico" />
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
            <InsightItem text="“You spent ₹1,800 on subscriptions this month.”" />
            <InsightItem text="“Subscriptions account for 7% of your monthly spending.”" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-1">
            <p className="mono-label">Control_Center</p>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionButton icon={<Plus className="w-5 h-5" />} label="Add Subscription" color="bg-primary/20 hover:bg-primary/30 border-primary/20" />
            <ActionButton icon={<Zap className="w-5 h-5" />} label="Add Transaction" color="bg-white/5 hover:bg-white/10 border-white/5" />
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

function RenewalCard({ name, days, cost, icon }) {
  return (
    <div className="group min-w-[280px] p-6 border border-white/5 bg-black/20 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden">
      <div className="flex justify-between items-start mb-10">
        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
          <img src={icon} alt={name} className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" onError={(e) => e.target.style.display = 'none'} />
        </div>
        <div className="flex flex-col items-end">
          <p className="mono-label !text-primary !normal-case tracking-tight">-{days} days</p>
          <p className="text-[10px] font-bold font-mono text-slate-500 mt-1">₹{cost}</p>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold tracking-tight lowercase">{name}</h4>
        <p className="text-[10px] text-slate-500 font-mono mt-1">Institutional_Billed</p>
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

function ActionButton({ icon, label, color }) {
  return (
    <button className={`flex items-center gap-4 p-6 border transition-all text-xs font-bold uppercase tracking-widest text-white group ${color}`}>
      <div className="p-2 border border-white/10 group-hover:border-white/40 transition-colors">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

// --- Subscription Manager ---

function SubscriptionManager() {
  const [search, setSearch] = useState('');

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
          <button className="h-full px-6 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-slate-200 shrink-0">
            + New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/5 border border-white/5 font-display transition-all">
        <SubscriptionTableCard name="Netflix Premium" cost={499} cycle="Monthly" next="12 Mar" />
        <SubscriptionTableCard name="GitHub Copilot" cost={1000} cycle="Monthly" next="28 Mar" />
        <SubscriptionTableCard name="DigitalOcean" cost={1240} cycle="Monthly" next="01 Apr" />
        <SubscriptionTableCard name="Disney Plus" cost={149} cycle="Monthly" next="15 Mar" />
        <SubscriptionTableCard name="AWS Server 01" cost={850} cycle="Usage" next="30 Mar" highlight />
        <SubscriptionTableCard name="Figma Pro" cost={990} cycle="Monthly" next="10 Apr" />
        <SubscriptionTableCard name="Notion" cost={400} cycle="Annual" next="Jan 2025" />
        <SubscriptionTableCard name="ChatGPT Plus" cost={1650} cycle="Monthly" next="20 Mar" />
      </div>
    </motion.div>
  );
}

function SubscriptionTableCard({ name, cost, cycle, next, highlight }) {
  return (
    <div className={`p-8 bg-background-dark hover:bg-white/[0.03] transition-all group flex flex-col gap-8 relative overflow-hidden ${highlight ? 'bg-primary/5' : ''}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg tracking-tight lowercase">{name}</h3>
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

      <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors group-hover:translate-x-1 transition-transform">
        Modify_Protocol <ChevronRight className="w-3 h-3" />
      </button>

      {highlight && <div className="absolute top-0 right-0 w-12 h-12 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>}
    </div>
  );
}

// --- Money Flow View ---

function MoneyFlow() {
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
        <button className="px-6 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-slate-200">
          + Transaction
        </button>
      </div>

      {/* Monthly Summary */}
      <div className="bg-black/40 border border-white/5 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <SummaryItem label="Income" value={45000} type="plus" />
        <SummaryItem label="Expenses" value={21000} type="minus" />
        <SummaryItem label="Subscriptions" value={1800} type="minus" />
        <SummaryItem label="Net_Balance" value={22200} type="total" />
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 px-6">
          <p className="mono-label">Chronicle</p>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        <div className="space-y-1 bg-white/5 border border-white/5">
          <TransactionItem name="Salary Deposit" category="Income" amount={45000} date="01 Mar" type="plus" />
          <TransactionItem name="Lidl Groceries" category="Expenses" amount={1200} date="02 Mar" type="minus" />
          <TransactionItem name="Netflix Subscription" category="Subs" amount={499} date="03 Mar" type="minus" />
          <TransactionItem name="Petrol / Gas" category="Transport" amount={2500} date="04 Mar" type="minus" />
          <TransactionItem name="Monthly Rent" category="Rent" amount={12000} date="05 Mar" type="minus" />
          <TransactionItem name="Freelance Payout" category="Income" amount={8000} date="06 Mar" type="plus" />
        </div>
      </div>
    </motion.div>
  );
}

function SummaryItem({ label, value, type }) {
  const color = type === 'plus' ? 'text-green-400' : type === 'minus' ? 'text-red-400' : 'text-primary';
  return (
    <div className="space-y-2">
      <p className="mono-label !text-[8px]">{label}</p>
      <div className={`text-xl font-mono font-bold ${color}`}>
        {type === 'minus' ? '-' : type === 'plus' ? '+' : ''}
        <AnimatedNumber value={value} prefix="" />
      </div>
    </div>
  );
}

function TransactionItem({ name, category, amount, date, type }) {
  const isPlus = type === 'plus';
  return (
    <div className="flex items-center justify-between p-6 bg-background-dark hover:bg-white/[0.03] transition-all group">
      <div className="flex items-center gap-6">
        <div className={`w-10 h-10 flex items-center justify-center border ${isPlus ? 'border-green-500/20 text-green-500' : 'border-white/10 text-slate-400'}`}>
          {isPlus ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-tight uppercase">{name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="mono-label !text-[8px] !text-slate-500">{category}</span>
            <span className="text-slate-700 font-mono text-[9px]">•</span>
            <span className="mono-label !text-[8px] !text-slate-500">{date}</span>
          </div>
        </div>
      </div>
      <div className={`text-sm font-mono font-bold ${isPlus ? 'text-green-400' : 'text-slate-200'}`}>
        {isPlus ? '+' : '-'}₹{amount.toLocaleString('en-IN')}
      </div>
    </div>
  );
}
