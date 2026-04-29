import { getJobBySlug, getJobs } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Building2, Calendar, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const j = await getJobBySlug(slug);
  if (!j) return { title: "Job not found" };
  const desc = `${j.company} — ${j.type} position in ${j.location || "Ethiopia"}. ${j.summary}`.slice(0, 200);
  return {
    title: `${j.title} — ${j.company}`,
    description: desc,
    alternates: { canonical: `/jobs/${j.slug}` },
    openGraph: {
      type: "article",
      url: `https://jobs.hulunem.com/jobs/${j.slug}`,
      title: `${j.title} — ${j.company}`,
      description: desc,
      publishedTime: j.posted,
    },
    twitter: { card: "summary_large_image", title: `${j.title} — ${j.company}`, description: desc },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const jobJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    datePosted: job.posted,
    validThrough: job.expires,
    employmentType: (job.type || "FULL_TIME").toUpperCase().replace(/[\s-]/g, "_"),
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location || "Addis Ababa", addressCountry: "ET" },
    },
    industry: job.sector,
    url: `https://jobs.hulunem.com/jobs/${job.slug}`,
    directApply: false,
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }} />
    </div>
  );
}
