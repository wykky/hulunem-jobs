import { getSkills } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkillsList } from "@/components/SkillsList";

export const revalidate = 60;

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Skills & Resources</h1>
        <p className="text-sm text-muted mb-6">Curated learning material to level up your career.</p>
        <SkillsList skills={skills} />
      </main>
      <Footer />
    </div>
  );
}
