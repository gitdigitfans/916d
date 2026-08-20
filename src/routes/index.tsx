import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/qumra/Hero";
import { Section } from "@/components/qumra/Section";
import { ProgramCards } from "@/components/qumra/ProgramCards";
import { TestimonialCards } from "@/components/qumra/TestimonialCards";
import { TeacherCards } from "@/components/qumra/TeacherCards";
import { Stats } from "@/components/qumra/Stats";
import { CTABlock } from "@/components/qumra/CTABlock";
import { VideoTestimonials } from "@/components/qumra/VideoTestimonials";
import { getHomeContentFn } from "@/lib/admin-server";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getHomeContentFn();
    } catch {
      return null;
    }
  },
  component: Home,
});

function Home() {
  const { t } = useLang();
  const content = Route.useLoaderData();
  return (
    <>
      <Hero heroImage={content?.hero_image} />

      <Section eyebrow="Programs" title={t.programs.title} subtitle={t.programs.subtitle} center>
        <ProgramCards programs={content?.programs} />
      </Section>

      <VideoTestimonials items={content?.testimonials} />

      <div className="border-y border-border/50 bg-surface/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stats />
        </div>
      </div>

      <Section eyebrow="Why us" title={t.why.title} subtitle={t.why.subtitle} center>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {t.why.items.map((it) => (
            <div
              key={it}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm font-medium">{it}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Instructors" title={t.teachers.title} subtitle={t.teachers.subtitle} center>
        <TeacherCards items={content?.teachers} />
      </Section>

      <Section eyebrow="Process" title={t.process.title} subtitle={t.process.subtitle} center>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.process.steps.map((s, i) => (
            <div key={s.t} className="relative rounded-2xl border border-border bg-surface/50 p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Testimonials" title={t.testimonials.title} center>
        <TestimonialCards items={content?.testimonials} />
      </Section>

      <CTABlock />
    </>
  );
}
