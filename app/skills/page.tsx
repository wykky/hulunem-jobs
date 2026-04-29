import { getSkills } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExternalLink } from "lucide-react";

export const revalidate = 300;

export default async function SkillsPage() {
  const skills = await getSkills();
  const grouped: Record<string, typeof skills> = {};
  skills.forEach((s) => {
    (grouped[s.category] ||= []).push(s);
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Skills & Resources</h1>
        <p className="text-sm text-muted mb-6">Curated learning material to level up your career.</p>
        {Object.keys(grouped).length === 0 ? (
          <div className="text-sm text-muted py-8 text-center">Coming soon.</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, items]) => (
              <section key={cat} className="border border-border bg-panel rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <h2 className="text-xs uppercase tracking-widest text-accent">{cat}</h2>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((s) => (
                    <li key={s.url} className="px-4 py-3">
                      <a href={s.url} target="_blank" rel="noopener" className="text-sm font-medium hover:text-accent inline-flex items-center gap-1">
                        {s.title} <ExternalLink size={12} />
                      </a>
                      {s.summary && <div className="text-xs text-muted mt-1">{s.summary}</div>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
