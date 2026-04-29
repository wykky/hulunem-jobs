"use client";

import { useState, useMemo } from "react";
import { ExternalLink, Search } from "lucide-react";
import type { SkillRow } from "@/lib/data";

export function SkillsList({ skills }: { skills: SkillRow[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const cats = useMemo(
    () => Array.from(new Set(skills.map((s) => s.category).filter(Boolean))).sort(),
    [skills]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return skills.filter((s) => {
      if (cat && s.category !== cat) return false;
      if (!needle) return true;
      return `${s.title} ${s.summary} ${s.category}`.toLowerCase().includes(needle);
    });
  }, [skills, q, cat]);

  if (skills.length === 0) {
    return <div className="text-sm text-muted py-8 text-center">Coming soon.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border border-border bg-panel rounded-lg p-3 sm:p-4 space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search skills, topics, keywords…"
            className="w-full bg-bg border border-border rounded pl-8 pr-3 py-2 text-sm focus:border-accent outline-none"
          />
        </div>
        {cats.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <Chip active={cat === ""} onClick={() => setCat("")}>All</Chip>
            {cats.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
            ))}
          </div>
        )}
        <div className="text-xs text-muted num">{filtered.length} of {skills.length}</div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-sm text-muted py-8 text-center">No matches.</div>
      ) : (
        <ul className="border border-border bg-panel rounded-lg divide-y divide-border overflow-hidden">
          {filtered.map((s) => (
            <li key={s.url} className="px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-accent">{s.category}</div>
              <a href={s.url} target="_blank" rel="noopener" className="text-sm font-medium hover:text-accent inline-flex items-center gap-1 break-words">
                {s.title} <ExternalLink size={12} className="shrink-0" />
              </a>
              {s.summary && <div className="text-xs text-muted mt-1 leading-snug">{s.summary}</div>}
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
