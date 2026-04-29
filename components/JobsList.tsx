"use client";

import { useState, useMemo, useEffect } from "react";
import { MapPin, Building2, Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { JobRow } from "@/lib/data";

const PAGE_SIZE = 15;

export function JobsList({ jobs }: { jobs: JobRow[] }) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("");
  const [page, setPage] = useState(0);

  const sectors = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.sector).filter(Boolean))).sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (sector && j.sector !== sector) return false;
      if (!needle) return true;
      const hay = `${j.title} ${j.company} ${j.location} ${j.type} ${j.summary} ${j.sector}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [jobs, q, sector]);

  useEffect(() => { setPage(0); }, [q, sector]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="border border-border bg-panel rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-semibold text-sm">Latest Jobs</h2>
        <span className="text-xs text-muted num">{filtered.length} of {jobs.length}</span>
      </div>

      <div className="px-3 sm:px-4 py-3 border-b border-border space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, company, location, keywords…"
            className="w-full bg-bg border border-border rounded pl-8 pr-3 py-2 text-sm focus:border-accent outline-none"
          />
        </div>
        {sectors.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <Chip active={sector === ""} onClick={() => setSector("")}>All</Chip>
            {sectors.map((s) => (
              <Chip key={s} active={sector === s} onClick={() => setSector(s)}>{s}</Chip>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted">No jobs match.</div>
      ) : (
        <>
          <ul className="divide-y divide-border">
            {visible.map((j) => (
              <li key={j.slug} className="px-4 py-4 hover:bg-bg/40">
                <a href={`/jobs/${j.slug}`} className="block">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-sm hover:text-accent break-words">{j.title}</div>
                      <div className="flex items-center gap-3 text-xs text-muted mt-1 flex-wrap">
                        <span className="flex items-center gap-1"><Building2 size={12} />{j.company}</span>
                        {j.location && <span className="flex items-center gap-1"><MapPin size={12} />{j.location}</span>}
                        {j.expires && <span className="flex items-center gap-1 num"><Calendar size={12} />exp. {j.expires}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase tracking-widest text-accent">{j.sector}</span>
                      <div className="text-xs text-muted mt-1">{j.type}</div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <Pagination page={safePage} total={totalPages} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active ? "bg-accent text-black border-accent" : "border-border text-muted hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = pageRange(page, total);
  return (
    <div className="px-3 sm:px-4 py-3 border-t border-border flex items-center justify-between gap-2 text-sm">
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="flex items-center gap-1 px-2 py-1 rounded border border-border text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      <div className="flex gap-1 flex-wrap justify-center">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2 py-1 text-muted text-xs">…</span>
          ) : (
            <button
              key={i}
              onClick={() => onChange(p)}
              className={`text-xs num px-2.5 py-1 rounded border transition-colors ${
                p === page ? "bg-accent text-black border-accent" : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {p + 1}
            </button>
          )
        )}
      </div>
      <button
        disabled={page === total - 1}
        onClick={() => onChange(page + 1)}
        className="flex items-center gap-1 px-2 py-1 rounded border border-border text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

function pageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const out: (number | "...")[] = [0];
  if (current > 2) out.push("...");
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) out.push(i);
  if (current < total - 3) out.push("...");
  out.push(total - 1);
  return out;
}
