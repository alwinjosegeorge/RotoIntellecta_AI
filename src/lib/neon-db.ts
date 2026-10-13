/**
 * Neon PostgreSQL Client & Helper Services
 * RotoIntellecta AI
 */

export interface ChatInquiry {
  id?: number;
  sessionId?: string;
  name?: string;
  contact?: string;
  message: string;
  sender?: "visitor" | "assistant" | "system";
  createdAt?: string;
}

export const NEON_CONNECTION_STRING =
  "postgresql://neondb_owner:npg_Y6tFU3fdXJiE@ep-fragrant-violet-b5h7gl41-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";
export const NEON_HTTP_ENDPOINT =
  "https://ep-fragrant-violet-b5h7gl41-pooler.c-7.us-east-2.aws.neon.tech/sql";

/**
 * Universal query runner for Neon PostgreSQL.
 * Note: Does not set forbidden Content-Type headers that fail browser CORS preflight.
 */
export async function queryNeon<T = any>(query: string): Promise<T[]> {
  try {
    const response = await fetch(NEON_HTTP_ENDPOINT, {
      method: "POST",
      headers: {
        "Neon-Connection-String": NEON_CONNECTION_STRING,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.warn("Neon query response status:", response.status);
      return [];
    }

    const data = await response.json();
    return (data.rows as T[]) || [];
  } catch (error) {
    console.error("Failed to query Neon PostgreSQL:", error);
    return [];
  }
}

/**
 * Save chat inquiry / message to Neon PostgreSQL
 */
export async function saveChatInquiry(inquiry: ChatInquiry): Promise<boolean> {
  try {
    const safeSession = (inquiry.sessionId || "guest").replace(/'/g, "''");
    const safeName = (inquiry.name || "Visitor").replace(/'/g, "''");
    const safeContact = (inquiry.contact || "").replace(/'/g, "''");
    const safeMessage = inquiry.message.replace(/'/g, "''");
    const safeSender = (inquiry.sender || "visitor").replace(/'/g, "''");

    const sql = `
      INSERT INTO chat_inquiries (session_id, name, contact, message, sender)
      VALUES ('${safeSession}', '${safeName}', '${safeContact}', '${safeMessage}', '${safeSender}')
      RETURNING id;
    `;

    const rows = await queryNeon(sql);
    return rows.length > 0;
  } catch (err) {
    console.error("Error saving chat inquiry to Neon:", err);
    return false;
  }
}

/**
 * Fetch chat history for session
 */
export async function getChatInquiriesBySession(sessionId: string): Promise<ChatInquiry[]> {
  try {
    const safeSession = sessionId.replace(/'/g, "''");
    const sql = `
      SELECT id, session_id as "sessionId", name, contact, message, sender, created_at as "createdAt"
      FROM chat_inquiries
      WHERE session_id = '${safeSession}'
      ORDER BY id ASC;
    `;
    return queryNeon<ChatInquiry>(sql);
  } catch {
    return [];
  }
}

/**
 * Check Neon DB health
 */
export async function checkNeonHealth(): Promise<{ connected: boolean; version?: string }> {
  try {
    const rows = await queryNeon<{ time: string; version: string }>("SELECT NOW() as time, version();");
    if (rows && rows.length > 0) {
      return { connected: true, version: rows[0].version };
    }
    return { connected: false };
  } catch {
    return { connected: false };
  }
}
