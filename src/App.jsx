import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ShieldCheck, CalendarRange, BarChart3, ArrowRight } from 'lucide-react';

function AnimatedNumber({ value, suffix = "" }) {
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
    <span className="mono-number">
      ₹ {displayValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      <span className="text-white/40 text-2xl ml-4 font-sans">{suffix}</span>
    </span>
  );
}

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Transformations for the opening sequence
  const textOpacity = useTransform(smoothProgress, [0, 0.1, 0.2], [0, 1, 0]);
  const numberScale = useTransform(smoothProgress, [0.1, 0.3], [1, 1.5]);
  const numberY = useTransform(smoothProgress, [0.1, 0.4], [0, -100]);
  const yearlyOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);

  return (
    <main ref={containerRef} className="bg-background text-foreground min-h-[400vh] selection:bg-white selection:text-black">
      {/* 1. Opening Section */}
      <section className="sticky top-0 h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
        <motion.div
          style={{ opacity: textOpacity }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl serif-statement font-light tracking-tight max-w-4xl leading-tight">
            Your money is quietly leaving.
          </h1>
        </motion.div>

        <motion.div
          style={{ scale: numberScale, y: numberY }}
          className="text-6xl md:text-9xl font-bold"
        >
          <AnimatedNumber value={1249.50} suffix="/ month" />
        </motion.div>

        <motion.div
          style={{ opacity: yearlyOpacity }}
          className="mt-24 text-center"
        >
          <p className="text-lg md:text-xl text-white/50 mb-4 font-sans uppercase tracking-[0.2em]">
            Yearly Projection
          </p>
          <div className="text-5xl md:text-7xl">
            <AnimatedNumber value={14994.00} suffix="/ year" />
          </div>
          <p className="mt-8 text-white/40 max-w-md mx-auto leading-relaxed">
            A small drip becomes a flood over time. SubsTrack helps you see the scale of your recurring commitments.
          </p>
        </motion.div>
      </section>

      {/* 2. Grid Section */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-background px-8">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 stroke-1" />}
            title="Add Subscriptions"
            description="Centralize every commitment. From streaming to software, see everything in one institutional view."
          />
          <FeatureCard
            icon={<CalendarRange className="w-8 h-8 stroke-1" />}
            title="Track Renewals"
            description="Never be surprised by a charge again. Anticipate renewals with precise, monochromatic clarity."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 stroke-1" />}
            title="Analyze Impact"
            description="Understand the psychological weight of your spending. Institutional tools for personal wealth."
          />
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl serif-statement font-light mb-12 max-w-3xl">
            See what your subscriptions are costing you.
          </h2>
          <button className="group relative px-12 py-5 bg-white text-black font-sans uppercase tracking-[0.2em] font-medium overflow-hidden transition-all duration-300 hover:px-16 active:scale-95">
            <span className="relative z-10 flex items-center gap-4">
              Start Tracking <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </motion.div>
      </section>

      {/* Decorative subtle border or watermark */}
      <footer className="fixed bottom-12 left-12 mix-blend-difference hidden md:block">
        <span className="font-mono text-white/20 text-xs tracking-[0.5em] uppercase">
          SubsTrack // Institutional Analytics
        </span>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="p-8 border border-white/5 hover:border-white/20 transition-colors duration-500 bg-white/[0.02]"
    >
      <div className="mb-8 text-white/40">
        {icon}
      </div>
      <h3 className="text-2xl font-serif font-light mb-4">{title}</h3>
      <p className="text-white/50 leading-relaxed font-sans font-light">
        {description}
      </p>
    </motion.div>
  );
}
