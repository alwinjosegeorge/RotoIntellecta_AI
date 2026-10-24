/**
 * Google Gemini AI Integration for RotoIntellecta AI Chat
 */

const decodeKey = (encoded: string): string => {
  try {
    if (typeof atob !== "undefined") return atob(encoded);
    if (typeof Buffer !== "undefined") return Buffer.from(encoded, "base64").toString("utf-8");
  } catch {
    // fallback
  }
  return "";
};

const DEFAULT_GEMINI_KEY = decodeKey("QVEuQWI4Uk42SVV5VjYtT21TR19iNk9GOEZ3Vk1EM0xOd2VvbFZzYmtENkJ4Xy1fTno0SlE=");

const GEMINI_API_KEY =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
  (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
  DEFAULT_GEMINI_KEY;

const SYSTEM_PROMPT = `You are the official AI Engineering Assistant for RotoIntellecta AI (https://rotointellecta.ai).
Your role is to assist industrial plant managers, maintenance engineers, and reliability specialists who visit the website.

Core Company Information:
- Brand: RotoIntellecta AI
- Focus: Rotating machinery excellence, condition monitoring, predictive AI tools, and reliability engineering.
- 5 Core Pillars: MONITOR | PREDICT | MAINTAIN | OPTIMISE | GROOM.
- Key Services:
  1. Remote Engineering Support & RCA: Systematic Root Cause Analysis (RCFA), Bently Nevada System1 plot interpretation, early-stage bearing defect detection, remote 1-plane/2-plane rotor balancing.
  2. Strategic Asset Management: Preventive Maintenance (PM) optimization, Failure Modes & Effects Analysis (FMEA), asset criticality ranking, reliability KPIs.
  3. 24/7 Live Predictive Monitoring (PdM): High-frequency acoustic sensing, pre-alarm anomaly detection, condition-based maintenance.
  4. AI Operational Solutions: Dynamic SKU spares inventory optimization and field troubleshooting agents.
  5. Training Academy: ISO 18436-2 accredited Mobius Institute Category I, II, & III Vibration Analyst certification, SMRP CMRP certification coaching, and ISA-CAP automation workflows.
- Tribute: In loving memory of our mentor Nelson Sir ("When you earn money, don't just build wealth—create employment. Give back to the society that educated you.").
- Official Contact:
  - Phone & WhatsApp: +91 88911 44334 (Direct engineering desk / 24/7 technical dispatch)
  - Email: contact@rotointellecta.com

Guidelines:
- Tone: Professional, technically competent, welcoming, and concise.
- Formatting: Use short paragraphs or clear bullet points suitable for a compact website chat widget.
- Always provide actionable technical insight (e.g. mention 1X/2X running speed, fault frequencies, Bently Nevada System1, or Mobius paths when relevant).
- Offer our official phone number (+91 88911 44334) and email (contact@rotointellecta.com) whenever the visitor asks for emergency diagnostics, quotes, scheduling, or callback requests.`;

export interface ChatHistoryItem {
  sender: "visitor" | "assistant" | "system";
  text: string;
}

export async function askGemini(
  prompt: string,
  history: ChatHistoryItem[] = []
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return fallbackResponse(prompt);
  }

  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

  // Prepare contents array with conversation history
  const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

  // Add system instruction prompt
  contents.push({
    parts: [{ text: SYSTEM_PROMPT }],
  });

  // Add recent conversation turns (last 6 messages max)
  const recentHistory = history.slice(-6);
  for (const item of recentHistory) {
    if (item.sender === "visitor") {
      contents.push({
        role: "user",
        parts: [{ text: item.text }],
      });
    } else if (item.sender === "assistant") {
      contents.push({
        role: "model",
        parts: [{ text: item.text }],
      });
    }
  }

  // Add the current user prompt
  contents.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  // Try available models sequentially
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply && typeof reply === "string" && reply.trim()) {
        return reply.trim();
      }
    } catch (err) {
      console.warn(`Gemini model ${model} request failed, attempting next model:`, err);
    }
  }

  // Fallback domain response if models are temporarily unavailable
  return fallbackResponse(prompt);
}

function fallbackResponse(userText: string): string {
  const lower = userText.toLowerCase();

  if (lower.includes("phone") || lower.includes("call") || lower.includes("number")) {
    return "You can reach our engineering desk directly at 📞 +91 88911 44334. We provide 24/7 technical dispatch and emergency vibration support.";
  }

  if (lower.includes("email") || lower.includes("mail")) {
    return "You can email our specialists at ✉️ contact@rotointellecta.com. Feel free to attach your FFT spectrum waterfall plots or vibration reports for immediate analysis.";
  }

  if (lower.includes("vibrat") || lower.includes("defect") || lower.includes("bearing") || lower.includes("gear")) {
    return "Our diagnostic engineers specialize in high vibration RCA, Bently Nevada System1 data surveillance, and spectral demodulation. Would you like our team to review your machine data? You can call us directly at +91 88911 44334 or email contact@rotointellecta.com.";
  }

  if (lower.includes("train") || lower.includes("mobius") || lower.includes("cmrp") || lower.includes("course") || lower.includes("academy")) {
    return "RotoIntellecta Academy provides accredited Mobius Institute Category I, II, and III Vibration Analyst training, as well as SMRP CMRP certification prep. Call +91 88911 44334 or email contact@rotointellecta.com for upcoming batch schedules.";
  }

  return "Thank you for reaching out! Our reliability engineers specialize in turbomachinery diagnostics, remote System1 surveillance, and reliability training. You can contact us directly at 📞 +91 88911 44334 or ✉️ contact@rotointellecta.com.";
}
