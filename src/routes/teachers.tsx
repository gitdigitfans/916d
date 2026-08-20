import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/qumra/Section";
import { TeacherCards } from "@/components/qumra/TeacherCards";
import { CTABlock } from "@/components/qumra/CTABlock";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { getTeachersFn } from "@/lib/admin-server";
import ii from "@/assets/qumra/ii.jpg.asset.json";

export const Route = createFileRoute("/teachers")({
  loader: async () => {
    try {
      return await getTeachersFn();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: "Teachers — Qumra Academy" },
      {
        name: "description",
        content:
          "Meet Qumra Academy's certified male and female instructors in Quran, Arabic, and Islamic Studies.",
      },
      { property: "og:title", content: "Teachers — Qumra Academy" },
      { property: "og:description", content: "Top class instructors with years of experience." },
      { property: "og:image", content: ii.url },
      { property: "og:url", content: "/teachers" },
    ],
    links: [{ rel: "canonical", href: "/teachers" }],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const { t } = useLang();
  const teachers = Route.useLoaderData();
  return (
    <>
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-primary/30">
            <img
              src={ii.url}
              alt="Top class instructors"
              className="h-56 w-full object-cover sm:h-72"
            />
          </div>
        </div>
      </div>
      <Section eyebrow="Instructors" title={t.teachers.title} subtitle={t.teachers.subtitle} center>
        <TeacherCards items={teachers} />
      </Section>
      <CTABlock />
    </>
  );
}
