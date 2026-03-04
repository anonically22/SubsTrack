import { motion } from 'framer-motion';
import {
  Wallet,
  Eye,
  ShieldCheck,
  Scissors,
  Quote,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Institutional Finance Landing Page - Variant 2
 * Inspired by structured management and clinical clarity.
 */

function AnimatedNumber({ value, prefix = "₹ ", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    const duration = 2000;
    let startTime = null;

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = start + (end - start) * progress;
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      {suffix}
    </span>
  );
}

export default function App() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-slate-100 font-display selection:bg-primary/30 antialiased">
      <Header />

      <main className="flex flex-col items-center">
        <HeroSection />
        <MetricsSection />
        <StructuredManagementSection />
        <QuoteSection />
        <Footer />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 px-6 md:px-20 py-6 sticky top-0 bg-background-dark/95 backdrop-blur-md z-50">
      <div className="flex items-center gap-3">
        <Wallet className="text-primary w-6 h-6" />
        <div className="flex flex-col">
          <h2 className="text-slate-100 text-sm font-bold tracking-tight uppercase leading-none">SubsTrack</h2>
          <span className="mono-label !text-[8px] mt-1">Status: Operational</span>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-12 items-center">
        <nav className="hidden md:flex items-center gap-10">
          <NavLink label="Product" />
          <NavLink label="Pricing" />
          <NavLink label="Insights" />
        </nav>
        <button className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-none h-10 px-6 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
          Access Portal
        </button>
      </div>
    </header>
  );
}

function NavLink({ label }) {
  return (
    <a className="text-slate-300 hover:text-white text-[11px] font-bold tracking-widest uppercase transition-colors" href="#">
      {label}
    </a>
  );
}

function HeroSection() {
  return (
    <section className="w-full relative border-b border-white/10">
      <div className="absolute top-8 left-8 flex flex-col gap-1 hidden md:flex">
        <span className="mono-label">System_Status: Active</span>
        <span className="mono-label">Node: Mumbai_Edge_01</span>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-20 py-32 md:py-48 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10 max-w-5xl"
        >
          <h1 className="serif-display text-6xl md:text-9xl text-slate-100 leading-[0.9] tracking-tighter">
            Your money is<br />quietly leaving.
          </h1>

          <div className="pt-12 relative inline-block">
            <p className="font-mono text-4xl md:text-6xl text-slate-300 tracking-tighter mb-2">
              <AnimatedNumber value={1249.50} suffix="" />
              <span className="text-slate-600">/mo</span>
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-white/10"></div>
              <p className="mono-label !text-slate-400">Current undetected leak</p>
              <div className="h-px w-8 bg-white/10"></div>
            </div>
          </div>

          <div className="pt-12">
            <button className="group relative px-12 py-5 border border-primary/50 text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-primary transition-all overflow-hidden">
              <span className="relative z-10">Secure Your Capital</span>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary transition-colors"></div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="w-full border-b border-white/10 bg-white/[0.01]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">
        <div className="flex-1 p-12 md:p-20 border-r border-white/10">
          <div className="flex flex-col gap-6 max-w-md">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-slow"></span>
              <h3 className="mono-label !text-slate-300">Metric: Annual Liquidity Impact</h3>
            </div>
            <p className="text-slate-300 text-xl font-medium leading-relaxed">
              Subscription decay is the silent killer of modern liquidity. We aggregate cross-platform data to reveal the compound drain.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <MetricBox label="Renewal_Freq" value="High_Var" />
              <MetricBox label="Data_Source" value="Aggregated" />
            </div>
          </div>
        </div>

        <div className="flex-1 p-12 md:p-20 flex flex-col justify-center bg-black/40">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-white text-7xl md:text-9xl font-mono tracking-tighter leading-none">
                <AnimatedNumber value={14994.00} />
              </p>
              <p className="mono-label mb-2">/ YEAR LOSS</p>
            </div>
            <div className="h-[120px] w-full flex items-end gap-1 pt-8 border-t border-white/10">
              {[10, 15, 8, 20, 12, 35, 5, 25].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: "0%" }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="flex-1 bg-white/5 hover:bg-primary/40 transition-all cursor-pointer"
                />
              ))}
            </div>
            <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest">
              <span>Q1_EST</span>
              <span>Q2_EST</span>
              <span>Q3_EST</span>
              <span>Q4_EST</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricBox({ label, value }) {
  return (
    <div className="p-4 border border-white/5 bg-black">
      <span className="mono-label !text-[8px]">{label}</span>
      <p className="font-mono text-lg text-white mt-1">{value}</p>
    </div>
  );
}

function StructuredManagementSection() {
  return (
    <section className="w-full max-w-[1400px] px-6 md:px-20 py-32">
      <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-10">
        <div className="flex flex-col gap-6">
          <h2 className="text-slate-100 text-4xl md:text-6xl serif-display leading-[1.1] max-w-xl">
            Structured Management
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-primary"></div>
            <span className="mono-label">Framework_v4.2</span>
          </div>
        </div>
        <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-[500px]">
          Take control of your recurring expenses with institutional precision and clinical clarity. Optimized for high-net-worth oversight.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10">
        <FeatureCard
          id="01"
          icon={<Eye className="text-primary w-10 h-10 stroke-1" />}
          title="Visibility"
          description="See every transaction in a rigid, structured grid. No hidden fees, no dark patterns, just absolute transparency."
          items={["Real-time ledger synchronization", "Deep packet merchant analysis"]}
        />
        <FeatureCard
          id="02"
          icon={<ShieldCheck className="text-primary w-10 h-10 stroke-1" />}
          title="Control"
          description="Cancel unwanted subscriptions with a single tap. Reclaim your balance from service fatigue and automatic renewals."
          items={["One-click termination protocols", "Merchant blocking & restriction"]}
          isMiddle
        />
        <FeatureCard
          id="03"
          icon={<Scissors className="text-primary w-10 h-10 stroke-1" />}
          title="Optimization"
          description="Identify overlapping services automatically. Our engine detects redundancy in your digital ecosystem."
          items={["Algorithmic redundancy detection", "Cost-per-usage benchmarking"]}
        />
      </div>
    </section>
  );
}

function FeatureCard({ id, icon, title, description, items, isMiddle }) {
  return (
    <div className={`group relative flex flex-col gap-8 p-12 border-white/10 hover:bg-white/[0.03] transition-all
      ${isMiddle ? 'border-b md:border-b-0 md:border-x' : 'border-b md:border-b-0 md:last:border-b-0'}
    `}>
      <span className="absolute top-6 right-6 font-mono text-slate-700 text-sm font-bold">{id}</span>
      {icon}
      <div className="flex flex-col gap-6">
        <h3 className="text-slate-100 text-lg font-bold uppercase tracking-[0.2em]">{title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
        <ul className="space-y-3 pt-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="h-px w-3 bg-primary mt-2.5"></span>
              <span className="mono-label !text-slate-400 !normal-case">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function QuoteSection() {
  return (
    <section className="w-full py-48 flex flex-col items-center justify-center text-center border-y border-white/10 bg-black/40 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 h-full w-px bg-white"></div>
        <div className="absolute top-0 right-1/4 h-full w-px bg-white"></div>
      </div>
      <div className="max-w-4xl px-6 relative z-10">
        <Quote className="text-slate-700 w-16 h-16 mb-12 mx-auto stroke-1" />
        <h2 className="text-slate-100 text-5xl md:text-7xl serif-display italic leading-tight tracking-tight">
          “Awareness changes behavior”
        </h2>
        <div className="mt-16 flex items-center justify-center gap-6">
          <div className="h-px w-12 bg-white/10"></div>
          <p className="mono-label !text-slate-400">Institutional Mandate</p>
          <div className="h-px w-12 bg-white/10"></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full py-24 bg-background-dark border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <Wallet className="text-primary w-8 h-8" />
            <h2 className="text-slate-100 text-xl font-bold tracking-tighter uppercase">SubsTrack</h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
            Providing enterprise-grade oversight for personal liquidity management. Secure, private, and precise.
          </p>
          <div className="flex flex-col gap-1">
            <span className="mono-label !text-[8px]">© 2024 SubsTrack Institutional</span>
            <span className="mono-label !text-[8px]">Data Residency: encrypted_eu_west</span>
          </div>
        </div>

        <FooterColumn
          title="Capabilities"
          links={["Aggregation", "Recovery", "Optimization"]}
        />
        <FooterColumn
          title="Legal Architecture"
          links={["Privacy Protocol", "Governance", "Security API"]}
        />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="space-y-6">
      <h4 className="mono-label !text-slate-200">{title}</h4>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <a
            key={link}
            className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            href="#"
          >
            {link}
          </a>
        ))}
      </nav>
    </div>
  );
}
