import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUp, CheckCircle2, ChevronDown, Award, Cpu, Flame, GraduationCap, HardHat, Layers, Menu, ShieldCheck, Sparkles, X, Wrench, Phone, Mail } from "lucide-react";

import heroImage from "@/assets/industrial-hero.jpg";
import bearingImage from "@/assets/bearing-diagnostic.jpg";
import turbineImage from "@/assets/turbine-hall.jpg";
import nelsonSirImage from "@/assets/nelson-sir.jpg";
import logoDark from "@/assets/roto-logo-dark.png";
import logoLight from "@/assets/roto-logo-light.png";
import { ChatWidget } from "@/components/chat-widget";
import { getStoredCaseStudies, syncCaseStudiesFromDatabase, type CaseStudy } from "@/lib/blog-storage";

const navItems = [
  ["Services", "#services"],
  ["Expertise", "#expertise"],
  ["Case Studies", "#cases"],
  ["Academy", "#training"],
  ["Tribute", "#tribute"],
  ["Contact", "#contact"],
] as const;

const fivePillars = ["MONITOR", "PREDICT", "MAINTAIN", "OPTIMISE", "GROOM"] as const;

const services = [
  {
    no: "01",
    id: "remote-support",
    title: "Remote Engineering Support & Troubleshooting",
    short: "Immediate turbomachinery diagnostic support without logistical delays.",
    tagline: "High Vibration? Recurring Failures? Expert support delivered remotely.",
    points: [
      {
        name: "Root Cause Analysis (RCA & RCFA)",
        desc: "Systematic investigation of rotating equipment failures to eliminate recurring bad actors permanently.",
      },
      {
        name: "Vibration & Plot Interpretation",
        desc: "Specialized analysis of Bently Nevada System1 data, isolating early-stage bearing defects, misalignment, and aerodynamic instabilities.",
      },
      {
        name: "Remote Rotor Balancing",
        desc: "Precision guidance for your field maintenance team to perform 1-plane and 2-plane balancing on high-speed rotating machinery.",
      },
    ],
  },
  {
    no: "02",
    id: "asset-management",
    title: "Strategic Asset Management Services",
    short: "Move from firefighting to proactive, value-driven reliability engineering.",
    tagline: "Reduce your OpEx. Improve Reliability. Maximize asset availability.",
    points: [
      {
        name: "PM Optimization",
        desc: "Eliminate low-value maintenance tasks, rationalize overhaul intervals, and optimize lifecycle costs.",
      },
      {
        name: "FMEA & Criticality Ranking",
        desc: "Identify potential failure modes early and construct smarter, risk-based maintenance strategies.",
      },
      {
        name: "KPI & Balanced Scorecard",
        desc: "Define actionable reliability KPIs and performance metrics to drive accountability and operational excellence.",
      },
    ],
  },
  {
    no: "03",
    id: "predictive-monitoring",
    title: "Live Predictive Monitoring & AI Insights",
    short: "Leverage the power of your telemetry with 24/7 real-time surveillance.",
    tagline: "Predict. Prevent. Perform. Catch faults weeks before functional failure.",
    points: [
      {
        name: "24/7 Data Surveillance",
        desc: "Continuous monitoring of Bently Nevada System1 and IoT sensor streams for critical turbomachinery assets.",
      },
      {
        name: "Predictive Maintenance (PdM) Suggestions",
        desc: "Analyzing high-frequency acoustic and vibration signals to detect anomalies weeks before alarm thresholds are breached.",
      },
      {
        name: "Condition-Based Maintenance (CBM) Integration",
        desc: "Shift your plant strategy from arbitrary calendar schedules to actual measured equipment health.",
      },
    ],
  },
  {
    no: "04",
    id: "ai-solutions",
    title: "AI-Powered Operational Solutions",
    short: "Streamline operations with custom industrial intelligence tools.",
    tagline: "Predict Demand. Optimize Inventory. Deploy Real-Time AI Agents.",
    points: [
      {
        name: "AI Inventory & Spares Management",
        desc: "Accurately forecast required spares based on failure rates and lead times, eliminating stockouts while cutting dead capital.",
      },
      {
        name: "Custom AI Industrial Agents",
        desc: "Tailored AI agents deployed in industrial environments to assist engineers in real-time with equipment troubleshooting and maintenance workflows.",
      },
    ],
  },
  {
    no: "05",
    id: "training-academy",
    title: "Reliability Academy & Certifications",
    short: "World-class vibration and reliability certifications for engineering teams.",
    tagline: "Build Skills. Get Certified. Advance Maintenance Worldwide.",
    points: [
      {
        name: "Mobius Institute Cat I, II & III Vibration Training",
        desc: "Expert-led certification pathways aligned with ISO 18436-2, taught by instructors with >90% exam distinction scores.",
      },
      {
        name: "CMRP Certification Coaching",
        desc: "Master all 5 Pillars of the SMRP Body of Knowledge and prepare with total confidence for CMRP certification.",
      },
      {
        name: "Automation, PLC & ISA-CAP Coaching",
        desc: "Practical preparation for ISA Certified Automation Professional and critical plant control architectures.",
      },
    ],
  },
] as const;

const fieldCases = [
  {
    no: "01",
    tag: "KAWASAKI GAS COMPRESSORS · LIQUID SEALS",
    title: "Can a rotor on tilting pad bearings still suffer from Oil Whirl?",
    highlight: "200,000+ HOURS OVERHAUL INTERVAL",
    teaser: "How correcting thermal growth targets transformed 50k-hr overhauls into 200k+ hrs of uninterrupted operation.",
    situation: "During routine vibration analysis on high-speed Kawasaki gas compressors equipped with tilting pad bearings, classic oil whirl signatures were detected. Phase analysis isolated the instability not to the bearings, but to the drive-end liquid oil seal. Safely reducing seal oil pressure provided temporary relief, but the paradox remained: how was oil whirl possible on a unit perfectly aligned with precision laser tools?",
    approach: "The laser alignment itself was accurate, but the thermal growth compensation targets were incorrect. The machine was not expanding as original design calculations predicted. Once operating temperature was reached, thermal growth forced the rotor into an angular misalignment that destabilized the liquid seal. We recalculated and corrected the hot thermal growth targets.",
    outcome: "The compressors previously required major overhauls every 50,000 hours. Following the correction, the entire fleet runs reliably for over 200,000 hours with zero vibration issues or performance deterioration.",
    image: turbineImage,
  },
  {
    no: "02",
    tag: "VIBRATION SPECTRUM ANALYSIS · PATTERN RECOGNITION",
    title: "The Bearing That Didn't Follow the Rulebook",
    highlight: "4.85X INNER RACE DISCOVERY",
    teaser: "Why vibration patterns are more reliable than database numbers when defect frequencies don't match the library.",
    situation: "During routine monitoring, an asset exhibited significant asynchronous vibration. Comparing the measured frequencies with predefined bearing defect libraries (BPFO, BPFI, BSF, FTF) in the analyzer yielded no matches. Standard automated diagnostics suggested the bearing was not the culprit.",
    approach: "Our vibration specialists looked past database formulas. A dominant vibration peak appeared at 4.85× running speed with prominent 1× sidebands. The unmistakable amplitude modulation pattern pointed directly to severe inner race degradation, regardless of database discrepancies.",
    outcome: "The bearing was dismantled for visual inspection, confirming severe inner race damage. Pattern-driven diagnosis prevented catastrophic bearing failure and secondary rotor damage.",
    image: bearingImage,
  },
  {
    no: "03",
    tag: "OFFSHORE & MARINE · PM STRATEGY TRANSFORMATION",
    title: "The 'Safe' Mistake Costing Your Plant's Reliability",
    highlight: "AVAILABILITY UP · OPEX SLASHED",
    teaser: "How shifting from blind OEM overhauls to targeted external inspections saved safety-critical Fire Water Pumps.",
    situation: "A facility faced recurring unreliability on its Fire Water Pumps despite strictly following OEM maintenance recommendations. Technicians were performing major overhauls on engines running less than 50 hours a year, meticulously replacing internal piston rings while availability remained poor.",
    approach: "Field analysis revealed the ground truth: sitting idle in a harsh marine environment, the internal components were not wearing out—it was external linkages, fuel systems, and actuators failing due to marine corrosion. We halted unnecessary internal overhauls and shifted to rigorous, targeted inspections of external bad actors.",
    outcome: "Transformed availability on safety-critical fire pumps while optimizing maintenance expenditure, proving that targeted action beats paperwork-driven maintenance.",
    image: heroImage,
  },
  {
    no: "04",
    tag: "OFFSHORE PROCESS PLATFORM · HELICAL GEARBOX DYNAMICS",
    title: "The Shaft Without a Thrust Bearing: An Unexpected Engineering Lesson",
    highlight: "THRUST RIDER RESOLUTION",
    teaser: "Resolving excessive axial movement on a High-Speed Shaft equipped without a thrust bearing.",
    situation: "An offshore process platform experienced excessive axial float on the High-Speed Shaft (HSS) of a helical gearbox. The HSS had no dedicated thrust bearing, meaning axial float could not simply be adjusted in the conventional manner.",
    approach: "Sectional drawings revealed a thrust rider designed to transfer HSS thrust to the Low-Speed Shaft (LSS) bearing, balancing opposing axial forces. We resolved the HSS axial movement by precisely positioning the LSS and bringing the HSS movement within limits.",
    outcome: "Eliminated the high axial float and protected critical gear mesh geometry without costly offshore overhauls or production outages.",
    image: turbineImage,
  },
  {
    no: "05",
    tag: "FIELD BALANCING INNOVATION · TURBOMACHINERY",
    title: "Unconventional Engineering: Balancing High-Speed Turbos Without Modern Software",
    highlight: "SINGLE & 2-PLANE PRECISION",
    teaser: "Executing precision trim balancing on BN 3500 and legacy racks (7200, 3300, FT-100) without System1 software.",
    situation: "Field engineers needed to execute trim balancing on high-speed turbomachinery in plants without Bently Nevada System1 or on older legacy racks lacking automated calculation suites.",
    approach: "On BN 3500 racks, we extracted 1X vibration amplitude and phase using internal verification across all 4 probes, splitting static and couple components. For legacy racks, we used 2-channel portable data collectors (PDCs like ACOEM/SCOUT) to capture raw vibration and Keyphasor pulses simultaneously, calculating exact phase angles manually.",
    outcome: "Successfully conducted precision 1-plane and 2-plane dynamic balancing, proving that sound engineering fundamentals overcome software limitations.",
    image: bearingImage,
  },
] as const;

function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      const width = canvas.clientWidth || 800;
      const height = canvas.clientHeight || 260;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;

      // Draw oscilloscope background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;

      // Horizontal grid lines
      const gridRows = 6;
      for (let i = 1; i < gridRows; i++) {
        const y = (height / gridRows) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical grid lines
      const gridCols = 12;
      for (let i = 1; i < gridCols; i++) {
        const x = (width / gridCols) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Live animated vibration waveform path
      ctx.beginPath();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.lineJoin = "round";

      const points = 360;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const progress = i / points;

        // Modulated envelope (bearing defect impact envelope)
        const envelope = Math.sin(progress * Math.PI) * 0.95 + 0.05;

        // Complex vibration harmonics (1X, 2X, high frequency bearing demodulation)
        const wave1 = Math.sin(progress * 26 - time * 3.8) * 44;
        const wave2 = Math.sin(progress * 13 - time * 2.2) * 22;
        const wave3 = Math.cos(progress * 52 + time * 2.0) * 12;
        const wave4 = Math.sin(progress * 4 - time * 1.1) * 8;

        const y = centerY + (wave1 + wave2 + wave3 + wave4) * envelope;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Live telemetry scanner sweep line
      const scanX = (time * 70) % width;
      const gradient = ctx.createLinearGradient(scanX - 40, 0, scanX, 0);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.35)");

      ctx.fillStyle = gradient;
      ctx.fillRect(Math.max(0, scanX - 40), 0, 40, height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      ctx.restore();

      time += 0.024;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full block" />
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink/90 text-ink-foreground backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-site items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <a href="#top" className="flex items-center group shrink-0 py-1" aria-label="RotoIntellecta AI Home">
          <img
            src={logoDark}
            alt="RotoIntellecta AI - Industrial Solutions"
            className="h-8 sm:h-8.5 lg:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
            width={180}
            height={36}
          />
        </a>
        
        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-5 lg:gap-6 xl:gap-8 lg:flex ml-8 lg:ml-12 xl:ml-16">
          {navItems.map(([label, href]) => (
            <a className="nav-link whitespace-nowrap" href={href} key={href}>{label}</a>
          ))}
        </div>

        {/* Desktop Contact Actions */}
        <div className="ml-auto hidden items-center gap-4 xl:gap-6 lg:flex shrink-0">
          <a
            href="tel:8891144334"
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
          >
            <Phone className="size-3.5 text-emerald-400" />
            <span>+91 88911 44334</span>
          </a>
          <a
            href="#contact"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            Talk to an expert <ArrowDownRight className="size-3.5" />
          </a>
        </div>

        {/* Mobile Right Action Bar */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="tel:8891144334"
            aria-label="Direct Call"
            className="grid size-9 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 active:scale-95 transition-transform"
          >
            <Phone className="size-4" />
          </a>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg bg-white/10 text-white active:scale-95 transition-transform"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex min-h-dvh flex-col bg-ink/98 backdrop-blur-xl p-5 text-ink-foreground animate-in fade-in duration-200 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-ink-line pb-4">
            <div className="flex items-center">
              <img
                src={logoDark}
                alt="RotoIntellecta AI - Industrial Solutions"
                className="h-8 w-auto object-contain"
                width={165}
                height={32}
              />
            </div>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-xl bg-white/10 text-white active:scale-90 transition-transform cursor-pointer"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-1 py-4">
            {navItems.map(([label, href], i) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between border-b border-ink-line/40 py-3 text-xl font-medium tracking-tight text-zinc-200 hover:text-white transition-colors"
              >
                <span className="font-mono text-xs text-zinc-500 mr-3">0{i + 1}</span>
                <span className="flex-1 text-left">{label}</span>
                <ArrowDownRight className="size-4 text-zinc-600 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>

          <div className="mt-auto border-t border-ink-line pt-4 pb-2 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:8891144334"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-xs font-mono font-semibold text-emerald-300 active:scale-95 transition-transform"
              >
                <Phone className="size-3.5 text-emerald-400" />
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/918891144334"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 p-2.5 text-xs font-mono font-semibold text-white active:scale-95 transition-transform"
              >
                <span>WhatsApp</span>
              </a>
            </div>
            <a
              href="mailto:Rotointellecta@gmail.com"
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 p-2 text-xs font-mono text-zinc-300 truncate"
            >
              <Mail className="size-3.5 text-zinc-400" />
              <span>Rotointellecta@gmail.com</span>
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg active:scale-95 transition-transform"
            >
              Talk to an Expert <ArrowDownRight className="size-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] lg:min-h-[840px] overflow-hidden bg-ink pt-16 text-ink-foreground flex flex-col justify-between">
      <div className="absolute inset-x-0 bottom-0 h-[64%] lg:left-[33%] lg:top-16 lg:h-[calc(100%-4rem)]">
        <img src={heroImage} alt="Industrial turbine rotor in a workshop" width={1920} height={1280} fetchPriority="high" className="h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 bg-hero-wash" />
        <div className="absolute inset-0 technical-grid opacity-30" />
      </div>
      
      <div className="relative mx-auto flex flex-1 flex-col justify-between max-w-site w-full px-5 pb-8 pt-6 sm:pt-10 lg:px-8 lg:pb-10 lg:pt-10">
        <div>
          <div className="grid grid-cols-4 gap-4 lg:grid-cols-12">
            <p className="kicker text-ink-muted">Rotating equipment reliability<br />& industrial artificial intelligence</p>
            <p className="col-span-2 col-start-3 hidden text-right font-mono text-[10px] uppercase leading-relaxed text-ink-muted lg:col-span-2 lg:col-start-11 lg:block">
              Proven OpEx / ~$5M Saved<br />Experience / 18+ Years<br />Global Support
            </p>
          </div>

          <h1 className="hero-title mt-6 sm:mt-8 lg:mt-8">
            <span>We Translate</span>
            <span>Machine Language</span>
            <span className="text-ink-muted">for You.</span>
          </h1>

          {/* 5 Core Pillars Bar */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono tracking-wider text-zinc-300 uppercase">
            {fivePillars.map((pillar, i) => (
              <span key={pillar} className="flex items-center gap-2 sm:gap-4 bg-white/5 lg:bg-transparent px-2.5 py-1 sm:px-0 sm:py-0 rounded-md sm:rounded-none border border-white/10 lg:border-none">
                <span className="font-semibold text-white">{pillar}</span>
                {i < fivePillars.length - 1 && <span className="text-zinc-600 hidden sm:inline">◈</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid items-end gap-6 sm:gap-8 pt-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-zinc-300">
              Welcome to the future of industrial reliability. At <strong className="text-white">RotoIntellecta AI</strong>, we bridge the gap between heavy-duty engineering and cutting-edge artificial intelligence. We specialize in rotating equipment excellence, offering a comprehensive suite of digital and technical solutions designed to maximize your asset life cycle and minimize unplanned downtime.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
              <a href="#services" className="btn-light w-full sm:w-auto text-center justify-center">Explore solutions <ArrowDownRight className="size-4" /></a>
              <a href="#contact" className="btn-outline-light w-full sm:w-auto text-center justify-center">Talk to an expert</a>
            </div>

            {/* Mobile quick reliability badges */}
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono text-zinc-400 lg:hidden border-t border-ink-line/60 pt-4">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                24/7 Remote RCA & System1
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                Mobius Cat III & CMRP
              </span>
              <a href="tel:8891144334" className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded font-semibold">
                <Phone className="size-3" /> Call: +91 88911 44334
              </a>
            </div>
          </div>
          
          <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <div className="border-l border-ink-line pl-5 font-mono text-[11px] uppercase leading-6 text-ink-muted space-y-1">
              <p className="text-white font-semibold">◈ High Vibration? Recurring Failures?</p>
              <p>Remote Engineering Support & RCA</p>
              <p>24/7 AI System1 Data Surveillance</p>
              <p>Mobius Cat III & CMRP Certified</p>
              <p className="text-zinc-300 pt-1">
                Direct Desk: <a href="tel:8891144334" className="text-white hover:underline">+91 88911 44334</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BackToTop({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`mt-12 sm:mt-16 flex items-center justify-between border-t pt-6 ${dark ? "border-ink-line" : "border-border"}`}>
      <span className={`font-mono text-[10px] uppercase tracking-wider ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
        RotoIntellecta AI
      </span>
      <a
        href="#top"
        className={`group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-all py-1.5 px-3 rounded-lg border ${
          dark
            ? "border-white/10 hover:border-white/30 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10"
            : "border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-950 bg-zinc-50 hover:bg-zinc-100"
        }`}
        title="Back to Top"
      >
        <span>Back to Top</span>
        <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
}

export function ProblemCards() {
  return (
    <section id="services" className="bg-white py-16 lg:py-24 border-b border-border">
      <div className="mx-auto max-w-site px-5 lg:px-8">
        <div className="mb-10 grid grid-cols-4 gap-4 lg:grid-cols-12">
          <p className="kicker text-muted-foreground">Solutions / 01—05</p>
          <p className="col-span-4 text-lg lg:col-span-6 lg:col-start-7 text-zinc-800 font-medium">
            Select an operational discipline or explore our complete rotating equipment reliability suite.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {services.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.no}
              className="group flex min-h-72 flex-col justify-between border border-border bg-white p-6 transition-all hover:bg-zinc-950 hover:text-white rounded-xl shadow-xs"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-zinc-400 group-hover:text-zinc-500">{item.no}</span>
                <ArrowDownRight className="size-5 transition-transform group-hover:rotate-45" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-base xl:text-lg font-bold uppercase leading-snug">{item.title}</h3>
                <p className="mt-3 text-xs text-zinc-500 group-hover:text-zinc-400 line-clamp-2">{item.short}</p>
              </div>
            </a>
          ))}
        </div>
        <BackToTop />
      </div>
    </section>
  );
}

export function RemoteSupportSection() {
  const service = services[0];
  return (
    <section id={service.id} className="bg-white py-24 lg:py-32 border-b border-border">
      <div className="mx-auto max-w-site px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-muted-foreground">01 / Remote Engineering</p>
            <h2 className="section-title text-zinc-950 mt-4">IMMEDIATE EXPERT SUPPORT. NO LOGISTICAL DELAYS.</h2>
            <p className="body-copy mt-6 text-zinc-600">
              Access world-class expertise for your turbomachinery without the logistical delay and expense of site visits. Our remote diagnostic center provides immediate support for high-stakes mechanical anomalies.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 border border-border">
              <img src={bearingImage} alt="Bearing diagnostic plot and telemetry" loading="lazy" width={1600} height={1104} className="h-full w-full object-cover grayscale" />
              <span className="absolute bottom-4 left-4 bg-black px-3 py-2 font-mono text-[10px] uppercase text-white rounded">
                Remote Diagnostics / System1 Telemetry
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {service.points.map((pt, i) => (
            <article className="border-t border-border pt-6" key={pt.name}>
              <span className="font-mono text-[10px] text-zinc-400">REMOTE.0{i + 1}</span>
              <h3 className="mt-4 text-xl font-bold text-zinc-950">{pt.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{pt.desc}</p>
            </article>
          ))}
        </div>
        <BackToTop />
      </div>
    </section>
  );
}

export function AssetManagement() {
  const service = services[1];
  return (
    <section id={service.id} className="bg-white py-24 lg:py-32 border-b border-border">
      <div className="mx-auto max-w-site px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-muted-foreground">02 / Strategic Asset Management</p>
            <h2 className="section-title text-zinc-950 mt-4">MOVE FROM FIREFIGHTING TO VALUE-DRIVEN FORESIGHT.</h2>
            <p className="body-copy mt-6 text-zinc-600">
              We help organizations transform maintenance into a proactive, value-driven function that improves asset performance and reduces total lifecycle costs.
            </p>
          </div>
          <div className="lg:col-span-7 space-y-6">
            {service.points.map((pt, i) => (
              <article className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 border-t border-border pt-6" key={pt.name}>
                <span className="text-4xl font-light text-zinc-300">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-bold text-zinc-950">{pt.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{pt.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <BackToTop />
      </div>
    </section>
  );
}

export function PredictiveMonitoring() {
  const service = services[2];
  return (
    <section id={service.id} className="bg-ink py-24 text-ink-foreground lg:py-36">
      <div className="mx-auto max-w-site px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker text-ink-muted">03 / Live Predictive Monitoring</p>
            <h2 className="section-title text-white mt-4">PREDICT.<br />PREVENT.<br />PERFORM.</h2>
          </div>
          <p className="body-copy self-end text-ink-muted lg:col-span-5">
            Leverage the power of your operational data with 24/7 surveillance, high-frequency acoustic detection, and AI predictive analytics to detect faults weeks before functional failure.
          </p>
        </div>

        <div className="monitor-panel mt-16 rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 gap-px border-b border-ink-line bg-ink-line md:grid-cols-4">
            {[["SURVEILLANCE", "24/7 SYSTEM1"], ["ACOUSTIC SENSING", "HIGH FREQUENCY"], ["DIAGNOSIS", "PRE-ALARM ANOMALY"], ["STRATEGY", "CONDITION-BASED (CBM)"]].map(([a, b]) => (
              <div className="bg-ink-panel p-5" key={a}>
                <span className="font-mono text-[9px] text-ink-muted">{a}</span>
                <p className="mt-2 text-sm font-semibold text-white">{b}</p>
              </div>
            ))}
          </div>
          <div className="h-72 p-5 lg:h-96">
            <div className="flex justify-between font-mono text-[9px] text-ink-muted">
              <span>TURBOMACHINERY FFT / TIME WAVEFORM</span>
              <span>EARLY ANOMALY DETECTION ENGINE</span>
            </div>
            <Waveform />
          </div>
          <div className="grid gap-px bg-ink-line md:grid-cols-3">
            {service.points.map((pt) => (
              <div key={pt.name} className="bg-ink-panel p-5">
                <p className="text-xs font-bold uppercase text-white">{pt.name}</p>
                <p className="mt-2 text-xs text-ink-muted leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <BackToTop dark />
      </div>
    </section>
  );
}

export function AISolutions() {
  const service = services[3];
  return (
    <section id={service.id} className="bg-white py-24 lg:py-32 border-b border-border">
      <div className="mx-auto max-w-site px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-muted-foreground">04 / AI Operational Solutions</p>
            <h2 className="section-title text-zinc-950 mt-4">INTELLIGENCE TOOLS FOR FIELD & INVENTORY.</h2>
            <p className="body-copy mt-6 text-zinc-600">
              Streamline back-end operations and field-level support with specialized industrial AI tools designed to eliminate guesswork.
            </p>
          </div>
          <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
            {service.points.map((pt, i) => (
              <article className="border border-border bg-zinc-50 p-8 rounded-2xl flex flex-col justify-between" key={pt.name}>
                <div>
                  <span className="font-mono text-xs text-zinc-400">AI / 0{i + 1}</span>
                  <h3 className="mt-6 text-2xl font-bold text-zinc-950">{pt.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-600">{pt.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-200">
                  <span className="font-mono text-[10px] uppercase text-zinc-500">
                    {i === 0 ? "Output: Dynamic SKU Spares Policy" : "Output: Real-time Field Troubleshooting"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <BackToTop />
      </div>
    </section>
  );
}

export function ExpertiseSection() {
  const credentials = [
    { title: "CMRP", desc: "Certified Maintenance & Reliability Professional (SMRP)" },
    { title: "Mobius Cat III", desc: "Vibration Analyst Certification with >90% score" },
    { title: "AMD Certification", desc: "Asset Management & Diagnostics from Bently Nevada" },
    { title: "ISA CAP", desc: "Certified Automation Professional (International Society for Automation)" },
  ];

  return (
    <section id="expertise" className="bg-white py-24 lg:py-36 border-b border-border">
      <div className="mx-auto max-w-site px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker text-muted-foreground">05 / Engineering Authority</p>
            <h2 className="section-title text-zinc-950 mt-4">18 YEARS OF TURBOMACHINERY EXCELLENCE.</h2>
          </div>
          <div className="flex items-end lg:col-span-4 lg:col-start-9">
            <div className="border border-zinc-200 bg-zinc-50 p-6 rounded-2xl w-full">
              <span className="text-4xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">~$5M / Year</span>
              <p className="mt-2 text-xs font-semibold text-zinc-700 uppercase tracking-wide">Proven OpEx Savings Delivered</p>
              <p className="mt-1 text-xs text-zinc-500">Achieved through reliability strategies & PdM with &lt;$1M investment.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold text-zinc-950">Proven Results. Smarter Maintenance.</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Our engineers bring 18 years of specialized experience in heavy turbomachinery—including gas turbines, compressors, multi-stage pumps, mechanical & gas seals, and condition monitoring. We possess profound expertise in interpreting vibration data (System1 and condition monitoring), delivering high-impact technical training, and optimizing PM schedules.
            </p>
            <p className="text-sm leading-relaxed text-zinc-600">
              Our team possesses a unique dual expertise in core mechanical engineering and developing advanced AI solutions specifically tailored for complex industrial problems.
            </p>
          </div>
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {credentials.map((cred) => (
              <div key={cred.title} className="border border-border p-6 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center gap-2 text-zinc-950">
                  <ShieldCheck className="size-5" />
                  <h4 className="font-bold text-lg">{cred.title}</h4>
                </div>
                <p className="mt-3 text-xs text-zinc-600 leading-relaxed">{cred.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <BackToTop />
      </div>
    </section>
  );
}

export function TrainingSection() {
  const service = services[4];
  return (
    <section id="training" className="bg-white py-24 lg:py-32 border-b border-border">
      <div className="mx-auto max-w-site px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker text-muted-foreground">06 / Training Academy</p>
            <h2 className="section-title text-zinc-950 mt-4">BUILD SKILLS. GET CERTIFIED. TRANSFORM MAINTENANCE.</h2>
          </div>
          <p className="body-copy self-end text-zinc-600 lg:col-span-5">
            Empower your workforce with world-class certifications and industry-proven technical expertise. Our interactive online training is designed for working professionals worldwide.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <article className="border border-border p-8 rounded-2xl bg-zinc-50 flex flex-col justify-between">
            <div>
              <span className="text-4xl font-light text-zinc-400">01</span>
              <p className="mt-6 font-mono text-xs uppercase text-zinc-500">ISO 18436-2 Track</p>
              <h3 className="mt-2 text-2xl font-bold text-zinc-950">Mobius Institute Cat I, II & III</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                Expert-led vibration analysis certification pathways. Spectrum & waveform diagnostics, fault frequencies, cross-channel phase, and rotor dynamics.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-200">
              <span className="text-xs font-semibold text-zinc-900">Taught by &gt;90% Exam Distinction Instructors</span>
            </div>
          </article>

          <article className="border border-border p-8 rounded-2xl bg-zinc-50 flex flex-col justify-between">
            <div>
              <span className="text-4xl font-light text-zinc-400">02</span>
              <p className="mt-6 font-mono text-xs uppercase text-zinc-500">SMRP Body of Knowledge</p>
              <h3 className="mt-2 text-2xl font-bold text-zinc-950">CMRP Certification Coaching</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                Master all 5 Pillars of the SMRP Body of Knowledge (Business, Process Reliability, Equipment Reliability, People Skills, Work Management) and prepare confidently.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-200">
              <span className="text-xs font-semibold text-zinc-900">Comprehensive Exam Prep & Mentorship</span>
            </div>
          </article>

          <article className="border border-border p-8 rounded-2xl bg-zinc-50 flex flex-col justify-between">
            <div>
              <span className="text-4xl font-light text-zinc-400">03</span>
              <p className="mt-6 font-mono text-xs uppercase text-zinc-500">Controls & Reliability</p>
              <h3 className="mt-2 text-2xl font-bold text-zinc-950">ISA-CAP / PLC & SCADA</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                Practical preparation for ISA Certified Automation Professional, SCADA alarm rationalization, historian integration, and Reliability-Centered Maintenance.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-200">
              <span className="text-xs font-semibold text-zinc-900">Hands-on Industrial Automation Workflows</span>
            </div>
          </article>
        </div>
        <BackToTop />
      </div>
    </section>
  );
}

export function CaseStudies() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [cases, setCases] = useState<CaseStudy[]>([]);

  useEffect(() => {
    setCases(getStoredCaseStudies());
    syncCaseStudiesFromDatabase().then((fresh) => {
      if (fresh && fresh.length > 0) setCases(fresh);
    });
    const handleUpdate = () => setCases(getStoredCaseStudies());
    window.addEventListener("case-studies-updated", handleUpdate);
    return () => window.removeEventListener("case-studies-updated", handleUpdate);
  }, []);

  const displayList = cases.length > 0 ? cases : fieldCases;

  return (
    <section id="cases" className="bg-ink py-24 text-ink-foreground lg:py-36">
      <div className="mx-auto max-w-site px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 items-end">
          <div className="lg:col-span-8">
            <p className="kicker text-ink-muted">Field Engineering Publications / 01—{String(displayList.length).padStart(2, "0")}</p>
            <h2 className="section-title text-white mt-4">CASE STUDIES & FIELD NOTES.</h2>
          </div>
          <p className="body-copy text-ink-muted lg:col-span-4">
            Real turbomachinery diagnostic cases from the field—demonstrating why engineering patterns and ground truth surpass rigid databases.
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {displayList.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id || item.no}
                className={`border border-ink-line rounded-2xl overflow-hidden transition-colors ${isOpen ? "bg-ink-panel" : "bg-black/60 hover:bg-black/80"}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-8 flex items-start justify-between gap-3 sm:gap-4 cursor-pointer"
                >
                  <div className="grid grid-cols-[32px_minmax(0,1fr)] sm:grid-cols-[60px_minmax(0,1fr)] gap-3 sm:gap-4 items-start">
                    <span className="font-mono text-xs sm:text-sm text-ink-muted">{item.no}</span>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider block">{item.tag}</span>
                      <h3 className="mt-1.5 sm:mt-2 text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-tight">{item.title}</h3>
                      {!isOpen && <p className="mt-2 text-xs sm:text-sm text-zinc-400 line-clamp-1">{item.teaser || item.situation}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className="inline-block font-mono text-[10px] sm:text-xs text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 sm:px-3 py-0.5 sm:py-1 rounded max-w-[110px] sm:max-w-none truncate">
                      {item.highlight}
                    </span>
                    <span className={`grid size-8 sm:size-9 place-items-center rounded-full border border-ink-line text-sm sm:text-lg text-white transition-transform ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-6 sm:px-8 sm:pb-8 pt-3 border-t border-ink-line/50 grid gap-6 sm:gap-8 lg:grid-cols-12 animate-in fade-in duration-300">
                    <div className="overflow-hidden rounded-xl lg:col-span-5">
                      <img src={item.image} alt={item.title} loading="lazy" width={1600} height={1200} className="aspect-[16/10] sm:aspect-[4/3] w-full object-cover grayscale" />
                    </div>
                    <div className="space-y-6 lg:col-span-7">
                      <div>
                        <h4 className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">The Challenge & Symptoms</h4>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.situation}</p>
                      </div>
                      <div>
                        <h4 className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">Engineering Approach & Discovery</h4>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.approach}</p>
                      </div>
                      <div>
                        <h4 className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">The Ground Truth Outcome</h4>
                        <p className="mt-2 text-sm leading-relaxed text-emerald-400 font-medium">{item.outcome}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <BackToTop dark />
      </div>
    </section>
  );
}

export function TributeSection() {
  return (
    <section id="tribute" className="bg-white py-24 lg:py-32 border-b border-border">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-mono uppercase text-zinc-600 mb-8">
          <span>In Loving Memory</span>
        </div>

        {/* Nelson Sir Portrait */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="size-36 sm:size-44 md:size-48 rounded-full overflow-hidden border-4 border-zinc-100 shadow-2xl ring-1 ring-zinc-300">
              <img
                src={nelsonSirImage}
                alt="Nelson Sir — Our mentor, inspiration, and light"
                className="w-full h-full object-cover object-top filter grayscale contrast-105 hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-zinc-950 text-white font-mono text-[10px] uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
              Mentor & Inspiration
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-zinc-900 leading-tight max-w-3xl mx-auto">
          “When you earn money, don’t just build wealth—create employment. Give back to the society that educated you. One job can feed a family and educate a generation.”
        </h2>
        <div className="mt-8 space-y-2">
          <p className="font-bold text-zinc-950 uppercase tracking-widest text-sm">— Nelson Sir</p>
          <p className="text-xs text-zinc-500 max-w-lg mx-auto">
            Our mentor, our inspiration, our light and our guidance. His spirit of perseverance and dedication continues to guide our mission at RotoIntellecta AI.
          </p>
        </div>
        <BackToTop />
      </div>
    </section>
  );
}

export function ContactSection() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyToClipboard = (text: string, type: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSendMail = (e?: React.MouseEvent) => {
    const mailtoUrl = "mailto:Rotointellecta@gmail.com?subject=Technical%20Inquiry%20-%20RotoIntellecta%20AI";
    const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=Rotointellecta@gmail.com&su=Technical%20Inquiry%20-%20RotoIntellecta%20AI";

    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = mailtoUrl;
    } else {
      // On desktop, open Gmail compose tab directly
      window.open(gmailUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="contact" className="relative bg-ink py-24 text-ink-foreground lg:py-32 overflow-hidden border-t border-ink-line">
      <div className="absolute inset-0 technical-grid opacity-20 pointer-events-none" />
      <div className="relative mx-auto max-w-site px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 items-end">
          <div className="lg:col-span-8">
            <p className="kicker text-ink-muted">DIRECT ENGINEERING DISPATCH & INQUIRIES</p>
            <h2 className="section-title text-white mt-4">
              CONNECT WITH OUR RELIABILITY SPECIALISTS.
            </h2>
          </div>
          <p className="body-copy text-ink-muted lg:col-span-4">
            Whether facing critical turbomachinery vibration anomalies, planning PM optimization, or booking Mobius certification courses, reach our engineering desk directly.
          </p>
        </div>

        <div className="mt-12 sm:mt-14 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Official Phone & WhatsApp */}
          <div className="group relative rounded-2xl border border-ink-line bg-zinc-950/70 p-5 sm:p-7 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-950">
            <div className="flex size-11 sm:size-12 items-center justify-center rounded-xl bg-white/10 text-white mb-5 group-hover:scale-105 transition-transform">
              <Phone className="size-5 sm:size-6 text-emerald-400" />
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">Direct Phone & WhatsApp</p>
            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
              +91 88911 44334
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
              Immediate technical dispatch, emergency vibration troubleshooting, and plant advisory.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <a
                href="tel:8891144334"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors active:scale-95"
              >
                <Phone className="size-3.5" /> Call Direct
              </a>
              <a
                href="https://wa.me/918891144334"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors active:scale-95"
              >
                WhatsApp
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard("8891144334", "phone")}
                className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1 rounded-xl border border-zinc-800 px-3 py-2.5 text-xs font-mono text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer active:scale-95"
                title="Copy phone number"
              >
                {copiedPhone ? <CheckCircle2 className="size-3.5 text-emerald-400" /> : "Copy Number"}
              </button>
            </div>
          </div>

          {/* Card 2: Official Email */}
          <div className="group relative rounded-2xl border border-ink-line bg-zinc-950/70 p-5 sm:p-7 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-950">
            <div className="flex size-11 sm:size-12 items-center justify-center rounded-xl bg-white/10 text-white mb-5 group-hover:scale-105 transition-transform">
              <Mail className="size-5 sm:size-6 text-emerald-400" />
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">Official Engineering Email</p>
            <h3 className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-white break-all">
              Rotointellecta@gmail.com
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
              Submit spectrum waterfall plots, RFQs, training inquiries, or asset maintenance logs.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=Rotointellecta@gmail.com&su=Technical%20Inquiry%20-%20RotoIntellecta%20AI"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSendMail}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors active:scale-95 cursor-pointer shadow-sm"
              >
                <Mail className="size-3.5" /> Send Mail
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=Rotointellecta@gmail.com&su=Technical%20Inquiry%20-%20RotoIntellecta%20AI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors active:scale-95"
                title="Compose directly in Gmail"
              >
                Open Gmail
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard("Rotointellecta@gmail.com", "email")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 px-3 py-2.5 text-xs font-mono text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer active:scale-95"
                title="Copy email address"
              >
                {copiedEmail ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-sans font-semibold">
                    <CheckCircle2 className="size-3.5" /> Copied
                  </span>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
          </div>

          {/* Card 3: Operating Coverage */}
          <div className="group relative rounded-2xl border border-ink-line bg-zinc-950/70 p-5 sm:p-7 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-950 md:col-span-2 lg:col-span-1">
            <div className="flex size-11 sm:size-12 items-center justify-center rounded-xl bg-white/10 text-white mb-5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="size-5 sm:size-6 text-emerald-400" />
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">Operating Coverage</p>
            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
              24/7 Global Surveillance
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
              Remote turbomachinery vibration analysis, Bently Nevada System1 monitoring, and on-site expert deployment across India & worldwide.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Direct Technical Support Active</span>
            </div>
          </div>
        </div>
        <BackToTop dark />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-[#ebebeb] pt-12 md:pt-16 pb-16 md:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden rounded-t-[2.5rem] md:rounded-t-[3.5rem]">
      {/* Floating Card */}
      <div className="relative z-10 max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-12 md:p-14 shadow-sm border border-zinc-200/80 text-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Brand info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <a href="#top" className="inline-block group py-1" aria-label="RotoIntellecta AI Home">
                <img
                  src={logoLight}
                  alt="RotoIntellecta AI - Industrial Solutions"
                  className="h-9 sm:h-10 w-auto object-contain transition-opacity group-hover:opacity-90"
                  width={206}
                  height={40}
                />
              </a>
              <p className="mt-4 sm:mt-5 text-sm text-zinc-500 leading-relaxed max-w-xs">
                Condition monitoring, reliability engineering training, and predictive AI solutions for mission-critical rotating machinery.
              </p>
              <div className="mt-5 space-y-2 text-xs font-mono text-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 uppercase">Phone:</span>
                  <a href="tel:8891144334" className="font-semibold text-zinc-950 hover:underline">
                    +91 88911 44334
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 uppercase">Email:</span>
                  <a href="mailto:Rotointellecta@gmail.com" className="font-semibold text-zinc-950 hover:underline">
                    Rotointellecta@gmail.com
                  </a>
                </div>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase text-zinc-400">
                MONITOR | PREDICT | MAINTAIN | OPTIMISE | GROOM
              </p>
            </div>
          </div>

          {/* Right Columns: Services, Academy, Company */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h4 className="text-sm font-semibold text-zinc-950 mb-3 sm:mb-4">Services</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-500 font-normal">
                <li><a href="#remote-support" className="hover:text-zinc-950 transition-colors">Remote Support</a></li>
                <li><a href="#asset-management" className="hover:text-zinc-950 transition-colors">PM Optimization</a></li>
                <li><a href="#predictive-monitoring" className="hover:text-zinc-950 transition-colors">Live PdM</a></li>
                <li><a href="#ai-solutions" className="hover:text-zinc-950 transition-colors">AI Spares & Agents</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-950 mb-3 sm:mb-4">Resources</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-500 font-normal">
                <li><a href="#cases" className="hover:text-zinc-950 transition-colors">Case Studies</a></li>
                <li><a href="#training" className="hover:text-zinc-950 transition-colors">Mobius Cat I–III</a></li>
                <li><a href="#training" className="hover:text-zinc-950 transition-colors">CMRP Prep</a></li>
                <li><a href="#tribute" className="hover:text-zinc-950 transition-colors">Nelson Sir Tribute</a></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-sm font-semibold text-zinc-950 mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-500 font-normal">
                <li><a href="#expertise" className="hover:text-zinc-950 transition-colors">18 Years Expertise</a></li>
                <li><a href="#expertise" className="hover:text-zinc-950 transition-colors">Certifications</a></li>
                <li><a href="tel:8891144334" className="hover:text-zinc-950 transition-colors font-mono">+91 88911 44334</a></li>
                <li><a href="mailto:Rotointellecta@gmail.com" className="hover:text-zinc-950 transition-colors truncate block">Rotointellecta@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider & Bottom copyright row */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-400">
          <p>© 2026 RotoIntellecta AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#top" className="hover:text-zinc-700 transition-colors">Back to top ↑</a>
            <a href="tel:8891144334" className="hover:text-zinc-700 transition-colors font-mono">+91 88911 44334</a>
            <a href="mailto:Rotointellecta@gmail.com" className="hover:text-zinc-700 transition-colors">Rotointellecta@gmail.com</a>
          </div>
        </div>
      </div>

      {/* Large Watermark Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[22%] pointer-events-none select-none max-w-full w-full text-center overflow-hidden">
        <span className="text-[14vw] font-bold tracking-tight text-zinc-300/40 uppercase whitespace-nowrap block leading-none">
          RotoIntellecta
        </span>
      </div>
    </footer>
  );
}

export default function RotoSite() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProblemCards />
      <RemoteSupportSection />
      <AssetManagement />
      <PredictiveMonitoring />
      <AISolutions />
      <ExpertiseSection />
      <TrainingSection />
      <CaseStudies />
      <TributeSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </main>
  );
}