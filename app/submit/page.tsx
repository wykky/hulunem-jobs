"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { submitJob } from "./actions";

const SECTORS = ["Technology", "Finance", "Banking", "NGO", "Government", "Healthcare", "Education", "Hospitality", "Manufacturing", "Agriculture", "Construction", "Retail", "Media", "Other"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function SubmitPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(formData: FormData) {
    setStatus("loading");
    const res = await submitJob(formData);
    if (res.ok) { setStatus("ok"); setMsg(""); }
    else { setStatus("error"); setMsg(res.error || "Submission failed"); }
  }

  if (status === "ok") {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="border border-border bg-panel rounded-lg p-8 text-center">
            <div className="text-accent text-3xl mb-3">▲</div>
            <h1 className="text-xl font-semibold mb-2">Thanks — submission received</h1>
            <p className="text-sm text-muted">We'll review your listing within 24 hours and publish it on jobs.hulunem.com.</p>
            <a href="/" className="inline-block mt-4 text-sm text-accent">← Back to jobs</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Post a Job</h1>
        <p className="text-sm text-muted mb-6">Free for all employers. Submissions are reviewed before publication.</p>
        <form action={onSubmit} className="space-y-4 border border-border bg-panel rounded-lg p-5">
          <Field label="Job title *" name="title" required />
          <Field label="Company *" name="company" required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Sector" name="sector" options={SECTORS} />
            <Select label="Type" name="type" options={TYPES} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Location" name="location" placeholder="Addis Ababa" />
            <Field label="Expires" name="expires" type="date" />
          </div>
          <Field label="Apply URL or email" name="url" placeholder="https://… or mailto:…" />
          <Textarea label="Summary" name="summary" placeholder="Brief description, key responsibilities, qualifications…" />
          <hr className="border-border" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name" name="contact_name" />
            <Field label="Your email *" name="contact_email" type="email" required />
          </div>
          {status === "error" && <div className="text-sm text-down">{msg}</div>}
          <button type="submit" disabled={status === "loading"} className="px-4 py-2 bg-accent text-black rounded text-sm font-medium hover:bg-accent/90 disabled:opacity-50">
            {status === "loading" ? "Submitting…" : "Submit listing"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className="mt-1 w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none" />
    </label>
  );
}

function Textarea({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <textarea name={name} placeholder={placeholder} rows={5} className="mt-1 w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none resize-y" />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <select name={name} className="mt-1 w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none">
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
