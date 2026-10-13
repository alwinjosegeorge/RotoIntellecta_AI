import turbineImage from "@/assets/turbine-hall.jpg";
import bearingImage from "@/assets/bearing-diagnostic.jpg";
import heroImage from "@/assets/industrial-hero.jpg";
import { queryNeon } from "./neon-db";

export type CaseStudy = {
  id: string;
  no: string;
  tag: string;
  title: string;
  highlight: string;
  teaser: string;
  situation: string;
  approach: string;
  outcome: string;
  image: string;
  createdAt?: string;
  displayOrder?: number;
};

export const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-01",
    no: "01",
    tag: "KAWASAKI GAS COMPRESSORS · LIQUID SEALS",
    title: "Can a rotor on tilting pad bearings still suffer from Oil Whirl?",
    highlight: "200,000+ HOURS OVERHAUL INTERVAL",
    teaser: "How correcting thermal growth targets transformed 50k-hr overhauls into 200k+ hrs of uninterrupted operation.",
    situation: "During routine vibration analysis on high-speed Kawasaki gas compressors equipped with tilting pad bearings, classic oil whirl signatures were detected. Phase analysis isolated the instability not to the bearings, but to the drive-end liquid oil seal. Safely reducing seal oil pressure provided temporary relief, but the paradox remained: how was oil whirl possible on a unit perfectly aligned with precision laser tools?",
    approach: "The laser alignment itself was accurate, but the thermal growth compensation targets were incorrect. The machine was not expanding as original design calculations predicted. Once operating temperature was reached, thermal growth forced the rotor into an angular misalignment that destabilized the liquid seal. We recalculated and corrected the hot thermal growth targets.",
    outcome: "The compressors previously required major overhauls every 50,000 hours. Following the correction, the entire fleet runs reliably for over 200,000 hours with zero vibration issues or performance deterioration.",
    image: turbineImage,
    createdAt: "2026-09-01",
    displayOrder: 1,
  },
  {
    id: "case-02",
    no: "02",
    tag: "VIBRATION SPECTRUM ANALYSIS · PATTERN RECOGNITION",
    title: "The Bearing That Didn't Follow the Rulebook",
    highlight: "4.85X INNER RACE DISCOVERY",
    teaser: "Why vibration patterns are more reliable than database numbers when defect frequencies don't match the library.",
    situation: "During routine monitoring, an asset exhibited significant asynchronous vibration. Comparing the measured frequencies with predefined bearing defect libraries (BPFO, BPFI, BSF, FTF) in the analyzer yielded no matches. Standard automated diagnostics suggested the bearing was not the culprit.",
    approach: "Our vibration specialists looked past database formulas. A dominant vibration peak appeared at 4.85× running speed with prominent 1× sidebands. The unmistakable amplitude modulation pattern pointed directly to severe inner race degradation, regardless of database discrepancies.",
    outcome: "The bearing was dismantled for visual inspection, confirming severe inner race damage. Pattern-driven diagnosis prevented catastrophic bearing failure and secondary rotor damage.",
    image: bearingImage,
    createdAt: "2026-09-05",
    displayOrder: 2,
  },
  {
    id: "case-03",
    no: "03",
    tag: "OFFSHORE & MARINE · PM STRATEGY TRANSFORMATION",
    title: "The 'Safe' Mistake Costing Your Plant's Reliability",
    highlight: "AVAILABILITY UP · OPEX SLASHED",
    teaser: "How shifting from blind OEM overhauls to targeted external inspections saved safety-critical Fire Water Pumps.",
    situation: "A facility faced recurring unreliability on its Fire Water Pumps despite strictly following OEM maintenance recommendations. Technicians were performing major overhauls on engines running less than 50 hours a year, meticulously replacing internal piston rings while availability remained poor.",
    approach: "Field analysis revealed the ground truth: sitting idle in a harsh marine environment, the internal components were not wearing out—it was external linkages, fuel systems, and actuators failing due to marine corrosion. We halted unnecessary internal overhauls and shifted to rigorous, targeted inspections of external bad actors.",
    outcome: "Transformed availability on safety-critical fire pumps while optimizing maintenance expenditure, proving that targeted action beats paperwork-driven maintenance.",
    image: heroImage,
    createdAt: "2026-09-10",
    displayOrder: 3,
  },
  {
    id: "case-04",
    no: "04",
    tag: "OFFSHORE PROCESS PLATFORM · HELICAL GEARBOX DYNAMICS",
    title: "The Shaft Without a Thrust Bearing: An Unexpected Engineering Lesson",
    highlight: "THRUST RIDER RESOLUTION",
    teaser: "Resolving excessive axial movement on a High-Speed Shaft equipped without a thrust bearing.",
    situation: "An offshore process platform experienced excessive axial float on the High-Speed Shaft (HSS) of a helical gearbox. The HSS had no dedicated thrust bearing, meaning axial float could not simply be adjusted in the conventional manner.",
    approach: "Sectional drawings revealed a thrust rider designed to transfer HSS thrust to the Low-Speed Shaft (LSS) bearing, balancing opposing axial forces. We resolved the HSS axial movement by precisely positioning the LSS and bringing the HSS movement within limits.",
    outcome: "Eliminated the high axial float and protected critical gear mesh geometry without costly offshore overhauls or production outages.",
    image: turbineImage,
    createdAt: "2026-09-15",
    displayOrder: 4,
  },
  {
    id: "case-05",
    no: "05",
    tag: "FIELD BALANCING INNOVATION · TURBOMACHINERY",
    title: "Unconventional Engineering: Balancing High-Speed Turbos Without Modern Software",
    highlight: "SINGLE & 2-PLANE PRECISION",
    teaser: "Executing precision trim balancing on BN 3500 and legacy racks (7200, 3300, FT-100) without System1 software.",
    situation: "Field engineers needed to execute trim balancing on high-speed turbomachinery in plants without Bently Nevada System1 or on older legacy racks lacking automated calculation suites.",
    approach: "On BN 3500 racks, we extracted 1X vibration amplitude and phase using internal verification across all 4 probes, splitting static and couple components. For legacy racks, we used 2-channel portable data collectors (PDCs like ACOEM/SCOUT) to capture raw vibration and Keyphasor pulses simultaneously, calculating exact phase angles manually.",
    outcome: "Successfully conducted precision 1-plane and 2-plane dynamic balancing, proving that sound engineering fundamentals overcome software limitations.",
    image: bearingImage,
    createdAt: "2026-09-20",
    displayOrder: 5,
  },
];

const STORAGE_KEY = "rotointellecta_case_studies_v2";

/**
 * Robustly resolve preset/hashed image references across devices and builds.
 */
export function resolveCaseStudyImage(img?: string): string {
  if (!img) return heroImage;
  const lower = img.toLowerCase();
  if (lower.includes("turbine")) return turbineImage;
  if (lower.includes("bearing")) return bearingImage;
  if (lower.includes("hero") || lower.includes("rotor") || lower.includes("workshop")) return heroImage;
  return img;
}

function sanitizeCaseStudy(item: any, fallbackIndex = 0): CaseStudy {
  const displayNo = item.no || String(fallbackIndex + 1).padStart(2, "0");
  return {
    id: String(item.id || `case-${Date.now()}-${fallbackIndex}`),
    no: displayNo,
    tag: item.tag || "TURBOMACHINERY DIAGNOSTICS",
    title: item.title || "Untitled Case Study",
    highlight: item.highlight || "PROVEN RESOLUTION",
    teaser: item.teaser || item.situation || "",
    situation: item.situation || "",
    approach: item.approach || "",
    outcome: item.outcome || "",
    image: resolveCaseStudyImage(item.image),
    createdAt: item.createdAt || item.created_at || new Date().toISOString().split("T")[0],
    displayOrder: item.displayOrder ?? item.display_order ?? fallbackIndex + 1,
  };
}

let isSyncing = false;

/**
 * Fetch and sync fresh case studies from Neon PostgreSQL across devices.
 */
export async function syncCaseStudiesFromDatabase(): Promise<CaseStudy[]> {
  if (isSyncing) return getStoredCaseStudies();
  isSyncing = true;

  try {
    let rows: any[] = [];

    // 1. Primary: Query through same-origin API endpoint
    try {
      const res = await fetch("/api/case-studies", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          rows = json;
        }
      }
    } catch {}

    // 2. Direct Neon Fallback if server route unavailable
    if (!rows || rows.length === 0) {
      try {
        const neonRows = await queryNeon<any>(
          "SELECT id, no, tag, title, highlight, teaser, situation, approach, outcome, image, display_order, created_at FROM case_studies ORDER BY display_order ASC, id ASC;"
        );
        if (Array.isArray(neonRows) && neonRows.length > 0) {
          rows = neonRows;
        }
      } catch (err) {
        console.warn("Direct Neon DB fallback failed:", err);
      }
    }

    if (rows && rows.length > 0) {
      const formatted = rows.map((r, i) => sanitizeCaseStudy(r, i));
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formatted));
        window.dispatchEvent(new Event("case-studies-updated"));
      }
      return formatted;
    }
  } catch (err) {
    console.error("Failed to sync case studies from Neon DB:", err);
  } finally {
    isSyncing = false;
  }

  return getStoredCaseStudies();
}

/**
 * Returns stored case studies instantly from localStorage cache.
 * Auto-triggers a background cloud sync on first call in browser.
 */
export function getStoredCaseStudies(): CaseStudy[] {
  if (typeof window === "undefined") {
    return DEFAULT_CASE_STUDIES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial cache and trigger async fetch from Neon
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CASE_STUDIES));
      setTimeout(() => syncCaseStudiesFromDatabase(), 100);
      return DEFAULT_CASE_STUDIES;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => sanitizeCaseStudy(item, idx));
    }
    return DEFAULT_CASE_STUDIES;
  } catch (e) {
    console.error("Failed to read stored case studies", e);
    return DEFAULT_CASE_STUDIES;
  }
}

export function saveAllCaseStudies(cases: CaseStudy[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    window.dispatchEvent(new Event("case-studies-updated"));
  } catch (e) {
    console.error("Failed to save case studies", e);
  }
}

/**
 * Add a new Case Study / Blog Post.
 * Saves immediately to local state and persists to Neon PostgreSQL.
 */
export function addCaseStudy(item: Omit<CaseStudy, "id" | "no">): CaseStudy {
  const existing = getStoredCaseStudies();
  const nextNo = String(existing.length + 1).padStart(2, "0");
  const newPost: CaseStudy = {
    ...item,
    id: `case-${Date.now()}`,
    no: nextNo,
    image: resolveCaseStudyImage(item.image),
    createdAt: new Date().toISOString().split("T")[0],
    displayOrder: existing.length + 1,
  };

  const updated = [...existing, newPost];
  saveAllCaseStudies(updated);

  // Persist to Neon DB via API and fallback direct query
  (async () => {
    try {
      const res = await fetch("/api/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error(`API responded with ${res.status}`);
    } catch {
      // Direct SQL fallback
      const safeTitle = newPost.title.replace(/'/g, "''");
      const safeTag = newPost.tag.replace(/'/g, "''");
      const safeHighlight = newPost.highlight.replace(/'/g, "''");
      const safeTeaser = newPost.teaser.replace(/'/g, "''");
      const safeSituation = newPost.situation.replace(/'/g, "''");
      const safeApproach = newPost.approach.replace(/'/g, "''");
      const safeOutcome = newPost.outcome.replace(/'/g, "''");
      const safeImage = (newPost.image || "").replace(/'/g, "''");

      await queryNeon(`
        INSERT INTO case_studies (id, no, tag, title, highlight, teaser, situation, approach, outcome, image, display_order, created_at)
        VALUES ('${newPost.id}', '${newPost.no}', '${safeTag}', '${safeTitle}', '${safeHighlight}', '${safeTeaser}', '${safeSituation}', '${safeApproach}', '${safeOutcome}', '${safeImage}', ${newPost.displayOrder}, NOW())
        ON CONFLICT (id) DO NOTHING;
      `);
    }
  })().catch((e) => console.error("Neon DB persistence error:", e));

  return newPost;
}

/**
 * Update an existing Case Study / Blog Post.
 * Syncs immediately to local state and persists to Neon PostgreSQL.
 */
export function updateCaseStudy(id: string, item: Partial<CaseStudy>): void {
  const existing = getStoredCaseStudies();
  const updated = existing.map((c) => (c.id === id ? { ...c, ...item, image: item.image ? resolveCaseStudyImage(item.image) : c.image } : c));
  saveAllCaseStudies(updated);

  // Persist to Neon DB
  (async () => {
    try {
      const res = await fetch("/api/case-studies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, item }),
      });
      if (!res.ok) throw new Error(`API responded with ${res.status}`);
    } catch {
      // Direct SQL fallback
      const updates: string[] = [];
      if (item.title) updates.push(`title = '${item.title.replace(/'/g, "''")}'`);
      if (item.tag) updates.push(`tag = '${item.tag.replace(/'/g, "''")}'`);
      if (item.highlight) updates.push(`highlight = '${item.highlight.replace(/'/g, "''")}'`);
      if (item.teaser) updates.push(`teaser = '${item.teaser.replace(/'/g, "''")}'`);
      if (item.situation) updates.push(`situation = '${item.situation.replace(/'/g, "''")}'`);
      if (item.approach) updates.push(`approach = '${item.approach.replace(/'/g, "''")}'`);
      if (item.outcome) updates.push(`outcome = '${item.outcome.replace(/'/g, "''")}'`);
      if (item.image) updates.push(`image = '${item.image.replace(/'/g, "''")}'`);

      if (updates.length > 0) {
        await queryNeon(`UPDATE case_studies SET ${updates.join(", ")} WHERE id = '${id}';`);
      }
    }
  })().catch((e) => console.error("Neon DB update error:", e));
}

/**
 * Delete a Case Study / Blog Post.
 * Deletes from local state and deletes from Neon PostgreSQL.
 */
export function deleteCaseStudy(id: string): void {
  const existing = getStoredCaseStudies();
  const filtered = existing
    .filter((c) => c.id !== id)
    .map((c, index) => ({
      ...c,
      no: String(index + 1).padStart(2, "0"),
      displayOrder: index + 1,
    }));
  saveAllCaseStudies(filtered);

  // Delete from Neon DB
  (async () => {
    try {
      await fetch(`/api/case-studies?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      await queryNeon(`DELETE FROM case_studies WHERE id = '${id.replace(/'/g, "''")}';`);
    }
  })().catch((e) => console.error("Neon DB delete error:", e));
}

/**
 * Reset all Case Studies back to the 5 official default articles.
 */
export function resetCaseStudiesToDefault(): void {
  saveAllCaseStudies(DEFAULT_CASE_STUDIES);

  // Reset in Neon DB
  (async () => {
    try {
      await fetch("/api/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
    } catch {}
  })().catch((e) => console.error("Neon DB reset error:", e));
}
