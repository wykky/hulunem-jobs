import { getJobBySlug, getJobs } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Building2, Calendar, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <a href="/" className="text-xs text-muted hover:text-accent">← All jobs</a>
        <article className="mt-4 border border-border bg-panel rounded-lg p-6">
          <div className="text-[10px] uppercase tracking-widest text-accent">{job.sector}</div>
          <h1 className="text-2xl font-semibold mt-1 mb-3 break-words">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted mb-4">
            <span className="flex items-center gap-1"><Building2 size={14} />{job.company}</span>
            {job.location && <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>}
            {job.type && <span>{job.type}</span>}
            {job.expires && <span className="flex items-center gap-1 num"><Calendar size={14} />Expires {job.expires}</span>}
          </div>
          {job.summary && <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{job.summary}</p>}
          <div className="mt-6 flex items-center justify-between gap-4">
            {job.url && (
              <a href={job.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black rounded text-sm font-medium hover:bg-accent/90">
                Apply <ExternalLink size={14} />
              </a>
            )}
            <span className="text-xs text-muted num">Posted {job.posted} · {job.source}</span>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
