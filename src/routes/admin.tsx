import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  FileText,
  Sparkles,
  ShieldCheck,
  Lock,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import {
  getStoredCaseStudies,
  syncCaseStudiesFromDatabase,
  addCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  resetCaseStudiesToDefault,
  type CaseStudy,
} from "@/lib/blog-storage";

import turbineImage from "@/assets/turbine-hall.jpg";
import bearingImage from "@/assets/bearing-diagnostic.jpg";
import heroImage from "@/assets/industrial-hero.jpg";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — RotoIntellecta AI Case Studies & Blog Manager" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const ADMIN_PASSWORD =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_ADMIN_PASSWORD) ||
  "5555";

const PRESET_IMAGES = [
  { label: "Gas Turbine Hall", url: turbineImage },
  { label: "Bearing Envelope Diagnostic", url: bearingImage },
  { label: "Industrial Rotor Workshop", url: heroImage },
];

function AdminDashboard() {
  // Security Authentication State (Default password: 5555)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("roto_admin_authenticated") === "true";
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("roto_admin_authenticated", "true");
      }
    } else {
      setPasswordError("Incorrect password. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput("");
    setPasswordError("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("roto_admin_authenticated");
    }
  };

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [highlight, setHighlight] = useState("");
  const [teaser, setTeaser] = useState("");
  const [situation, setSituation] = useState("");
  const [approach, setApproach] = useState("");
  const [outcome, setOutcome] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>(turbineImage);

  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = async (forceSync = false) => {
    setCaseStudies(getStoredCaseStudies());
    if (forceSync) setIsSyncing(true);
    try {
      const fresh = await syncCaseStudiesFromDatabase();
      if (fresh && fresh.length > 0) {
        setCaseStudies(fresh);
      }
      if (forceSync) {
        showToast("Synchronized with Neon Cloud PostgreSQL!");
      }
    } catch {
      // fallback to cached
    } finally {
      if (forceSync) setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => setCaseStudies(getStoredCaseStudies());
    window.addEventListener("case-studies-updated", handleUpdate);
    return () => window.removeEventListener("case-studies-updated", handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const resetForm = () => {
    setTitle("");
    setTag("");
    setHighlight("");
    setTeaser("");
    setSituation("");
    setApproach("");
    setOutcome("");
    setSelectedImage(turbineImage);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (c: CaseStudy) => {
    setEditingId(c.id);
    setTitle(c.title);
    setTag(c.tag);
    setHighlight(c.highlight);
    setTeaser(c.teaser);
    setSituation(c.situation);
    setApproach(c.approach);
    setOutcome(c.outcome);
    setSelectedImage(c.image);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      deleteCaseStudy(id);
      showToast("Case study deleted successfully.");
      loadData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !situation.trim() || !approach.trim() || !outcome.trim()) {
      alert("Please fill in all required fields (Title, Challenge, Approach, Outcome).");
      return;
    }

    if (editingId) {
      updateCaseStudy(editingId, {
        title,
        tag: tag || "TURBOMACHINERY DIAGNOSTICS",
        highlight: highlight || "FIELD RESOLUTION",
        teaser: teaser || title,
        situation,
        approach,
        outcome,
        image: selectedImage,
      });
      showToast("Case study updated successfully!");
    } else {
      addCaseStudy({
        title,
        tag: tag || "FIELD ENGINEERING PUBLICATION",
        highlight: highlight || "PROVEN RESOLUTION",
        teaser: teaser || title,
        situation,
        approach,
        outcome,
        image: selectedImage,
      });
      showToast("New case study published successfully to the website!");
    }

    resetForm();
    loadData();
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all case studies back to the 5 official default articles?")) {
      resetCaseStudiesToDefault();
      showToast("Reset to default 5 case studies.");
      loadData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Background glow and grid */}
        <div className="absolute inset-0 technical-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#121216]/95 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Header Icon */}
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white shadow-inner mb-6">
            <Lock className="size-6 text-emerald-400" />
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Admin Authentication
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Restricted portal. Please enter the administrative password to manage Case Studies & Field Notes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Enter Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Admin Password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  autoFocus
                  className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 px-4 py-3.5 text-base text-white placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono tracking-widest text-center"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-2 text-xs text-rose-400 text-center font-mono">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!passwordInput.trim()}
              className="w-full rounded-xl bg-white hover:bg-zinc-200 text-black py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-98 disabled:opacity-40 cursor-pointer"
            >
              Unlock Admin Portal
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Return to Website
            </Link>
          </div>
        </div>

        <p className="mt-8 text-[11px] font-mono text-zinc-600">
          RotoIntellecta AI • Strategic Reliability Operations
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 font-sans pb-20">
      {/* Top Admin Navbar */}
      <header className="border-b border-zinc-800 bg-[#121216] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700"
            >
              <ArrowLeft className="size-3.5" /> Live Website
            </Link>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-white text-black font-black text-xs flex items-center justify-center">
                R
              </div>
              <h1 className="text-base font-bold tracking-tight text-white">
                RotoIntellecta <span className="text-zinc-400 font-normal">/ Case Studies Admin</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white border border-zinc-700 bg-zinc-850 hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Pull latest case studies from Neon Cloud DB"
            >
              <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync Cloud"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Lock admin session"
            >
              <LogOut className="size-3.5" /> Lock
            </button>
            <button
              onClick={handleResetDefaults}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className="size-3.5" /> Reset Defaults
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(!isFormOpen);
              }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="size-4" /> {isFormOpen ? "Close Editor" : "New Case Study"}
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-5 py-3 rounded-xl font-semibold text-sm shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Stats Header Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141418] border border-zinc-800/80 p-5 rounded-2xl">
            <span className="text-xs font-mono uppercase text-zinc-400">Total Published Articles</span>
            <p className="text-3xl font-extrabold text-white mt-1">{caseStudies.length}</p>
          </div>
          <div className="bg-[#141418] border border-zinc-800/80 p-5 rounded-2xl">
            <span className="text-xs font-mono uppercase text-zinc-400">Cloud Database Sync</span>
            <p className="text-sm font-semibold text-emerald-400 mt-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Neon PostgreSQL Connected (Live Sync)
            </p>
          </div>
          <div className="bg-[#141418] border border-zinc-800/80 p-5 rounded-2xl">
            <span className="text-xs font-mono uppercase text-zinc-400">Target Section</span>
            <p className="text-sm font-semibold text-zinc-300 mt-2">
              Field Engineering Publications (01—{String(caseStudies.length).padStart(2, "0")})
            </p>
          </div>
        </div>

        {/* Upload / Edit Form Modal / Collapsible */}
        {isFormOpen && (
          <div className="bg-[#141418] border border-zinc-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="size-5 text-zinc-400" />
                  {editingId ? "Edit Case Study / Blog Post" : "Upload New Case Study"}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  The article will immediately appear in the &ldquo;Case Studies &amp; Field Notes&rdquo; section on the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Article Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Can a rotor on tilting pad bearings still suffer from Oil Whirl?"
                    className="w-full bg-[#1b1b22] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Category Tag / Machine Model
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. KAWASAKI GAS COMPRESSORS · LIQUID SEALS"
                    className="w-full bg-[#1b1b22] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Highlight Badge (Metric / Key Result)
                  </label>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    placeholder="e.g. 200,000+ HOURS OVERHAUL INTERVAL"
                    className="w-full bg-[#1b1b22] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Short Summary / Teaser Line
                  </label>
                  <input
                    type="text"
                    value={teaser}
                    onChange={(e) => setTeaser(e.target.value)}
                    placeholder="Brief 1-sentence teaser visible before expanding"
                    className="w-full bg-[#1b1b22] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Image Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                  Select Article Image
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRESET_IMAGES.map((img) => {
                    const isSelected = selectedImage === img.url;
                    return (
                      <button
                        type="button"
                        key={img.label}
                        onClick={() => setSelectedImage(img.url)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-white bg-zinc-800"
                            : "border-zinc-800 bg-[#1a1a20] hover:border-zinc-700"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.label}
                          className="size-12 rounded-lg object-cover grayscale"
                        />
                        <span className="text-xs font-medium text-zinc-200">{img.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3 Detailed Technical Sections */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    1. The Challenge &amp; Symptoms (Situation) <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Describe the initial failure, machine symptoms, alarm triggers, and why conventional methods were puzzled..."
                    className="w-full bg-[#1b1b22] border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    2. Engineering Approach &amp; Discovery (Methodology) <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                    placeholder="Describe how the RotoIntellecta team analyzed the data (System1, FFT phase, harmonics, physical inspection) to isolate root cause..."
                    className="w-full bg-[#1b1b22] border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    3. The Ground Truth Outcome (Final Resolution &amp; Impact) <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="Describe the verified outcome (e.g. 200,000+ run hours, 100% availability, OpEx savings, avoided overhauls)..."
                    className="w-full bg-[#1b1b22] border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-md active:scale-95"
                >
                  {editingId ? "Save Changes" : "Publish to Website"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Articles Table / Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Live Case Studies ({caseStudies.length})</h2>
            <span className="text-xs text-zinc-400">Click any article to edit or delete</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {caseStudies.map((c, index) => (
              <div
                key={c.id}
                className="bg-[#141418] border border-zinc-800 hover:border-zinc-700 p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="size-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-400">{c.no}</span>
                      <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                        {c.tag}
                      </span>
                      <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded">
                        {c.highlight}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1.5">{c.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1 max-w-2xl">{c.teaser || c.situation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleEdit(c)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl border border-zinc-700 transition-colors cursor-pointer"
                  >
                    <Edit3 className="size-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-400 px-3 py-2 rounded-xl border border-red-900/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
