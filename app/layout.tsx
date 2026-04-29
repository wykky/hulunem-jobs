import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hulunem Jobs — Ethiopian Jobs & Skills",
  description: "Latest jobs in Ethiopia across all sectors, plus curated skills resources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-gray-200 antialiased">{children}</body>
    </html>
  );
}
