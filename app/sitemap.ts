import { getJobs } from "@/lib/data";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE = "https://jobs.hulunem.com";

function safeDate(s: string, fallback: Date): Date {
  if (!s) return fallback;
  const d = new Date(s);
  return isNaN(d.getTime()) ? fallback : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobs();
  const now = new Date();

  return [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1.0, lastModified: now },
    { url: `${BASE}/skills`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${BASE}/submit`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    ...jobs.map((j) => ({
      url: `${BASE}/jobs/${j.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      lastModified: safeDate(j.posted, now),
    })),
  ];
}
