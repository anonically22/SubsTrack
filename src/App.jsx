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
  const [view, setView] = useState('landing'); // landing, auth, dashboard, subs, flow
  const [user, setUser] = useState(null);

  const navigateTo = (newView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

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

function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 md:p-12 space-y-16 max-w-[1400px] mx-auto"
    >
      {/* Top Section: Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <OverviewCard label="Monthly_Income" value={45000} color="text-slate-200" />
        <OverviewCard label="Monthly_Expenses" value={21000} color="text-slate-200" />
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
          <RenewalCard name="Netflix" domain="netflix.com" days={5} cost={499} />
          <RenewalCard name="Spotify" domain="spotify.com" days={12} cost={119} />
          <RenewalCard name="AWS Node" domain="aws.amazon.com" days={18} cost={850} />
          <RenewalCard name="GitHub Copilot" domain="github.com" days={22} cost={1000} />
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
        <SubscriptionTableCard name="Netflix Premium" domain="netflix.com" cost={499} cycle="Monthly" next="12 Mar" />
        <SubscriptionTableCard name="GitHub Copilot" domain="github.com" cost={1000} cycle="Monthly" next="28 Mar" />
        <SubscriptionTableCard name="DigitalOcean" domain="digitalocean.com" cost={1240} cycle="Monthly" next="01 Apr" />
        <SubscriptionTableCard name="Disney Plus" domain="disneyplus.com" cost={149} cycle="Monthly" next="15 Mar" />
        <SubscriptionTableCard name="AWS Server 01" domain="aws.amazon.com" cost={850} cycle="Usage" next="30 Mar" highlight />
        <SubscriptionTableCard name="Figma Pro" domain="figma.com" cost={990} cycle="Monthly" next="10 Apr" />
        <SubscriptionTableCard name="Notion" domain="notion.so" cost={400} cycle="Annual" next="Jan 2025" />
        <SubscriptionTableCard name="ChatGPT Plus" domain="openai.com" cost={1650} cycle="Monthly" next="20 Mar" />
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
            <span className="mono-label !text-[8px] !text-slate-300">{category}</span>
            <span className="text-slate-600 font-mono text-[9px]">•</span>
            <span className="mono-label !text-[8px] !text-slate-300">{date}</span>
          </div>
        </div>
      </div>
      <div className={`text-sm font-mono font-bold ${isPlus ? 'text-green-400' : 'text-slate-200'}`}>
        {isPlus ? '+' : '-'}₹{amount.toLocaleString('en-IN')}
      </div>
    </div>
  );
}
