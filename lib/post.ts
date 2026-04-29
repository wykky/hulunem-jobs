// Server-side helper to POST a row to the Apps Script webhook.

const URL = process.env.WEBHOOK_URL || "";
const SECRET = process.env.WEBHOOK_SECRET || "";

export async function postRow(tab: string, row: (string | number)[], mode = "append"): Promise<{ ok: boolean; error?: string }> {
  if (!URL || !SECRET) return { ok: false, error: "Webhook not configured" };
  try {
    const res = await fetch(URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: SECRET, tab, mode, rows: [row] }),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
