"use client";

import { useState, useMemo } from "react";
import { MapPin, Building2, Calendar, Search } from "lucide-react";
import type { JobRow } from "@/lib/data";

export function JobsList({ jobs }: { jobs: JobRow[] }) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("");

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
        <ul className="divide-y divide-border">
          {filtered.map((j) => (
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
