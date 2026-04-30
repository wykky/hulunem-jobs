import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "./PostHogProvider";

const SITE = "https://jobs.hulunem.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Hulunem Jobs — Ethiopian Jobs, Remote Work & Career Skills",
    template: "%s — Hulunem Jobs",
  },
  description: "Latest jobs in Ethiopia across all sectors — finance, tech, NGO, government, hospitality. Remote opportunities for Ethiopians plus curated career skills resources.",
  keywords: ["Ethiopian jobs", "jobs Ethiopia", "Addis Ababa jobs", "EthioJobs", "HaHu jobs", "remote jobs Ethiopia", "Ethiopian careers", "tech jobs Ethiopia", "finance jobs Addis", "NGO jobs Ethiopia", "Ethiopian employment", "skills training Ethiopia"],
  authors: [{ name: "Hulunem", url: "https://hulunem.com" }],
  creator: "Hulunem",
  publisher: "Hulunem",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    title: "Hulunem Jobs — Ethiopian Jobs & Career Skills",
    description: "Latest jobs in Ethiopia across all sectors plus remote opportunities and skills resources.",
    siteName: "Hulunem Jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hulunem Jobs — Ethiopian Jobs & Career Skills",
    description: "Latest Ethiopian and remote jobs, updated Mon & Thu.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
  icons: { icon: "/icon.svg" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hulunem Jobs",
  url: SITE,
  description: "Ethiopian jobs and career skills resources.",
  inLanguage: "en",
  publisher: { "@type": "Organization", name: "Hulunem", url: "https://hulunem.com" },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className="bg-bg text-gray-200 antialiased"><PostHogProvider>{children}</PostHogProvider></body>
    </html>
  );
}
