// Fetches data from published Google Sheets (CSV). No API key needed.

export type JobRow = {
  posted: string; title: string; company: string; sector: string;
  location: string; type: string; expires: string; url: string;
  source: string; slug: string; summary: string;
};
export type SkillRow = {
  added: string; category: string; title: string; url: string; summary: string;
};

const SHEETS = {
  jobs: process.env.SHEET_JOBS_URL || "",
  skills: process.env.SHEET_SKILLS_URL || "",
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (cell !== "" || row.length > 0) { row.push(cell); rows.push(row); row = []; cell = ""; }
        if (ch === "\r" && text[i + 1] === "\n") i++;
      } else cell += ch;
    }
  }
  if (cell !== "" || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
}

async function fetchCsv(url: string): Promise<string[][]> {
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return parseCsv((await res.text()).trim());
  } catch { return []; }
}

const today = () => new Date().toISOString().slice(0, 10);

export async function getJobs(): Promise<JobRow[]> {
  const rows = await fetchCsv(SHEETS.jobs);
  if (!rows.length) return mockJobs;
  const t = today();
  return rows.slice(1)
    .map((r) => ({
      posted: r[0] || "", title: r[1] || "", company: r[2] || "", sector: r[3] || "",
      location: r[4] || "", type: r[5] || "", expires: r[6] || "", url: r[7] || "",
      source: r[8] || "", slug: r[9] || "", summary: r[10] || "",
    }))
    .filter((j) => j.title && j.slug && (!j.expires || j.expires >= t))
    .sort((a, b) => (a.posted < b.posted ? 1 : a.posted > b.posted ? -1 : 0));
}

export async function getJobBySlug(slug: string): Promise<JobRow | null> {
  const all = await getJobs();
  return all.find((j) => j.slug === slug) || null;
}

export async function getSkills(): Promise<SkillRow[]> {
  const rows = await fetchCsv(SHEETS.skills);
  if (!rows.length) return mockSkills;
  return rows.slice(1)
    .map((r) => ({
      added: r[0] || "", category: r[1] || "", title: r[2] || "", url: r[3] || "", summary: r[4] || "",
    }))
    .filter((s) => s.title && s.url)
    .sort((a, b) => (a.added < b.added ? 1 : -1));
}

const mockJobs: JobRow[] = [
  { posted: "2026-04-28", title: "Senior Backend Engineer", company: "Ethio Telecom", sector: "Technology", location: "Addis Ababa", type: "Full-time", expires: "2026-05-30", url: "https://ethiotelecom.et", source: "Direct", slug: "ethio-telecom-senior-backend-2026-04-28", summary: "Build distributed services for telebirr and core network APIs. 5+ yrs Go/Java." },
  { posted: "2026-04-27", title: "Credit Risk Analyst", company: "Awash Bank", sector: "Finance", location: "Addis Ababa", type: "Full-time", expires: "2026-05-15", url: "https://awashbank.com", source: "EthioJobs", slug: "awash-credit-risk-2026-04-27", summary: "Corporate credit underwriting, IFRS 9 modeling. CFA preferred." },
  { posted: "2026-04-26", title: "M&E Officer", company: "USAID Ethiopia", sector: "NGO", location: "Addis Ababa", type: "Contract", expires: "2026-05-10", url: "https://usaid.gov", source: "EthioJobs", slug: "usaid-me-officer-2026-04-26", summary: "Monitor health programs across Oromia and Amhara regions." },
];

const mockSkills: SkillRow[] = [
  { added: "2026-04-28", category: "AI", title: "Andrew Ng — Machine Learning Specialization", url: "https://coursera.org/specializations/machine-learning-introduction", summary: "Free-to-audit foundational ML course." },
  { added: "2026-04-27", category: "Engineering", title: "Designing Data-Intensive Applications", url: "https://dataintensive.net", summary: "Backend systems essentials." },
  { added: "2026-04-26", category: "Career", title: "How to Write a CV — Harvard Guide", url: "https://hwpi.harvard.edu", summary: "Standard CV/resume writing reference." },
];
