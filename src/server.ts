import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { neon } from "@neondatabase/serverless";

const NEON_CONNECTION_STRING =
  "postgresql://neondb_owner:npg_Y6tFU3fdXJiE@ep-fragrant-violet-b5h7gl41-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

const sql = neon(NEON_CONNECTION_STRING);

const SEED_CASE_STUDIES = [
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
    image: "turbine-hall",
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
    image: "bearing-diagnostic",
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
    image: "industrial-hero",
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
    image: "turbine-hall",
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
    image: "bearing-diagnostic",
  },
];

async function handleCaseStudiesApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (method === "GET") {
      let rows: any[] = [];
      try {
        rows = (await sql`
          SELECT id, no, tag, title, highlight, teaser, situation, approach, outcome, image, display_order as "displayOrder", created_at as "createdAt"
          FROM case_studies
          ORDER BY display_order ASC, id ASC;
        `) as any[];
      } catch (dbErr) {
        console.warn("Neon DB query error, attempting self-heal:", dbErr);
      }

      // If database was empty, auto-seed defaults
      if (!rows || rows.length === 0) {
        for (let i = 0; i < SEED_CASE_STUDIES.length; i++) {
          const item = SEED_CASE_STUDIES[i];
          try {
            await sql`
              INSERT INTO case_studies (id, no, tag, title, highlight, teaser, situation, approach, outcome, image, display_order, created_at)
              VALUES (${item.id}, ${item.no}, ${item.tag}, ${item.title}, ${item.highlight}, ${item.teaser}, ${item.situation}, ${item.approach}, ${item.outcome}, ${item.image}, ${i + 1}, NOW())
              ON CONFLICT (id) DO NOTHING;
            `;
          } catch {}
        }
        rows = (await sql`
          SELECT id, no, tag, title, highlight, teaser, situation, approach, outcome, image, display_order as "displayOrder", created_at as "createdAt"
          FROM case_studies
          ORDER BY display_order ASC, id ASC;
        `) as any[];
      }

      return Response.json(rows, {
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    if (method === "POST") {
      const body = (await request.json().catch(() => ({}))) as any;
      if (body.action === "reset") {
        await sql`TRUNCATE TABLE case_studies;`;
        for (let i = 0; i < SEED_CASE_STUDIES.length; i++) {
          const item = SEED_CASE_STUDIES[i];
          await sql`
            INSERT INTO case_studies (id, no, tag, title, highlight, teaser, situation, approach, outcome, image, display_order, created_at)
            VALUES (${item.id}, ${item.no}, ${item.tag}, ${item.title}, ${item.highlight}, ${item.teaser}, ${item.situation}, ${item.approach}, ${item.outcome}, ${item.image}, ${i + 1}, NOW());
          `;
        }
        const fresh = await sql`
          SELECT id, no, tag, title, highlight, teaser, situation, approach, outcome, image, display_order as "displayOrder", created_at as "createdAt"
          FROM case_studies
          ORDER BY display_order ASC, id ASC;
        `;
        return Response.json(fresh, { headers: corsHeaders });
      }

      // Insert new case study
      const item = body;
      const countRes = (await sql`SELECT COUNT(*)::int as count FROM case_studies;`) as any[];
      const nextOrder = (countRes[0]?.count || 0) + 1;
      const nextNo = item.no || String(nextOrder).padStart(2, "0");
      const id = item.id || `case-${Date.now()}`;

      await sql`
        INSERT INTO case_studies (id, no, tag, title, highlight, teaser, situation, approach, outcome, image, display_order, created_at)
        VALUES (${id}, ${nextNo}, ${item.tag || "TURBOMACHINERY"}, ${item.title}, ${item.highlight || ""}, ${item.teaser || ""}, ${item.situation || ""}, ${item.approach || ""}, ${item.outcome || ""}, ${item.image || ""}, ${nextOrder}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          no = EXCLUDED.no,
          tag = EXCLUDED.tag,
          title = EXCLUDED.title,
          highlight = EXCLUDED.highlight,
          teaser = EXCLUDED.teaser,
          situation = EXCLUDED.situation,
          approach = EXCLUDED.approach,
          outcome = EXCLUDED.outcome,
          image = EXCLUDED.image;
      `;

      return Response.json({ success: true, id, no: nextNo }, { headers: corsHeaders });
    }

    if (method === "PUT") {
      const body = (await request.json().catch(() => ({}))) as any;
      const { id, item } = body;
      if (!id || !item) {
        return Response.json({ error: "Missing id or item" }, { status: 400, headers: corsHeaders });
      }

      await sql`
        UPDATE case_studies
        SET
          title = COALESCE(${item.title}, title),
          tag = COALESCE(${item.tag}, tag),
          highlight = COALESCE(${item.highlight}, highlight),
          teaser = COALESCE(${item.teaser}, teaser),
          situation = COALESCE(${item.situation}, situation),
          approach = COALESCE(${item.approach}, approach),
          outcome = COALESCE(${item.outcome}, outcome),
          image = COALESCE(${item.image}, image)
        WHERE id = ${id};
      `;

      return Response.json({ success: true, id }, { headers: corsHeaders });
    }

    if (method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) {
        return Response.json({ error: "Missing id" }, { status: 400, headers: corsHeaders });
      }

      await sql`DELETE FROM case_studies WHERE id = ${id};`;
      return Response.json({ success: true, id }, { headers: corsHeaders });
    }

    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  } catch (err: any) {
    console.error("API error in /api/case-studies:", err);
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/case-studies") {
        return await handleCaseStudiesApi(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
