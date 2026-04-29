import { getJobs, getSkills, type JobRow } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Building2, Calendar, ArrowRight } from "lucide-react";

export const revalidate = 300;

export default async function Home() {
  const [jobs, skills] = await Promise.all([getJobs(), getSkills()]);
  const sectors = Array.from(new Set(jobs.map((j) => j.sector).filter(Boolean))).sort();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6 min-w-0">
          <Hero count={jobs.length} sectors={sectors.length} />
          <div className="border border-border bg-panel rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-sm">Latest Jobs</h2>
              <span className="text-xs text-muted num">{jobs.length} active</span>
            </div>
            {jobs.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted">No jobs posted yet.</div>
            ) : (
              <ul className="divide-y divide-border">
                {jobs.map((j) => <JobItem key={j.slug} job={j} />)}
              </ul>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="border border-border bg-panel rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-sm">Skills & Resources</h2>
              <a href="/skills" className="text-xs text-accent">All →</a>
            </div>
            {skills.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted">Coming soon.</div>
            ) : (
              <ul className="divide-y divide-border">
                {skills.slice(0, 6).map((s) => (
                  <li key={s.url} className="px-4 py-3">
                    <div className="text-[10px] uppercase tracking-widest text-accent">{s.category}</div>
                    <a href={s.url} target="_blank" rel="noopener" className="text-sm hover:text-accent block leading-snug">{s.title}</a>
                    {s.summary && <div className="text-xs text-muted mt-1 leading-snug">{s.summary}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border border-border bg-panel rounded-lg p-4">
            <h2 className="font-semibold text-sm mb-2">Hiring?</h2>
            <p className="text-xs text-muted mb-3">Post your job listing free.</p>
            <a href="/submit" className="inline-flex items-center gap-1 text-sm text-accent">
              Submit a job <ArrowRight size={14} />
            </a>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

function Hero({ count, sectors }: { count: number; sectors: number }) {
  return (
    <section className="border border-border bg-panel rounded-lg p-4 sm:p-6">
      <div className="text-xs uppercase tracking-widest text-accent mb-2">Hulunem Jobs</div>
      <h1 className="text-xl sm:text-2xl font-semibold mb-2">Find your next role in Ethiopia</h1>
      <p className="text-muted text-sm leading-relaxed">
        <span className="num">{count}</span> active listings across <span className="num">{sectors}</span> sectors. Updated daily from EthioJobs, HaHu, and direct employer submissions.
      </p>
    </section>
  );
}

function JobItem({ job }: { job: JobRow }) {
  return (
    <li className="px-4 py-4 hover:bg-bg/40">
      <a href={`/jobs/${job.slug}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium text-sm hover:text-accent break-words">{job.title}</div>
            <div className="flex items-center gap-3 text-xs text-muted mt-1 flex-wrap">
              <span className="flex items-center gap-1"><Building2 size={12} />{job.company}</span>
              {job.location && <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>}
              {job.expires && <span className="flex items-center gap-1 num"><Calendar size={12} />exp. {job.expires}</span>}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-accent">{job.sector}</span>
            <div className="text-xs text-muted mt-1">{job.type}</div>
          </div>
        </div>
      </a>
    </li>
  );
}
