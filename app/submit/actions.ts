"use server";

import { postRow } from "@/lib/post";

export async function submitJob(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const get = (k: string) => String(formData.get(k) || "").trim();

  const title = get("title");
  const company = get("company");
  const sector = get("sector");
  const location = get("location");
  const type = get("type");
  const expires = get("expires");
  const url = get("url");
  const contact_name = get("contact_name");
  const contact_email = get("contact_email");
  const summary = get("summary");

  if (!title || !company || !contact_email) return { ok: false, error: "Missing required fields" };

  const timestamp = new Date().toISOString();
  const row = [timestamp, title, company, sector, location, type, expires, url, contact_name, contact_email, summary, "pending"];
  return await postRow("Submissions", row, "append");
}
