import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/qumra/Section";
import { CourseCards } from "@/components/qumra/CourseCards";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { getCatalogFn, getProgramsVideoFn } from "@/lib/admin-server";
import { CTABlock } from "@/components/qumra/CTABlock";
import img2 from "@/assets/qumra/2.jpg.asset.json";
import img3 from "@/assets/qumra/3.jpg.asset.json";
import img4 from "@/assets/qumra/4.jpg.asset.json";
import imgF from "@/assets/qumra/f2.jpg.asset.json";
import introVideo from "@/assets/qumra/qumra-intro.mp4.asset.json";
import { Check } from "lucide-react";

export const Route = createFileRoute("/programs")({
  loader: async () => {
    const [catalog, video] = await Promise.all([
      getCatalogFn().catch(() => null),
      getProgramsVideoFn().catch(() => ({ programs_video_url: "" })),
    ]);
    return { catalog, video: video?.programs_video_url || "" };
  },
  head: () => ({
    meta: [
      { title: "Programs — Qumra Academy" },
      { name: "description", content: "Explore all Qumra Academy programs: Quran, Islamic Studies, Arabic Language, and Kids." },
      { property: "og:title", content: "Programs — Qumra Academy" },
      { property: "og:description", content: "Structured tracks for every learner, from first letters to Ijazah." },
      { property: "og:image", content: img3.url },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: Programs,
});

function Programs() {
  const { t } = useLang();
  const data = Route.useLoaderData();
  const catalog = data?.catalog ?? null;
  const videoUrl = data?.video || introVideo.url;

  const programs = [
    {
      img: img2.url,
      name: t.programs.quran.name,
      desc: t.programs.quran.desc,
      items: ["Noor Al-Bayan", "Qaida Noorania", "Quran Reading", "Tajweed Rules", "Hifz", "Revision", "Ijazah", "Understanding"],
    },
    {
      img: img4.url,
      name: t.programs.islamic.name,
      desc: t.programs.islamic.desc,
      items: ["Aqeedah", "Fiqh", "Seerah", "Hadith", "Tafsir", "Islamic Manners", "Daily Duas", "Islamic History"],
    },
    {
      img: img3.url,
      name: t.programs.arabic.name,
      desc: t.programs.arabic.desc,
      items: ["Alphabet", "Reading", "Writing", "Speaking", "Listening", "Grammar", "Vocabulary", "Conversation"],
    },
    {
      img: imgF.url,
      name: t.programs.kids.name,
      desc: t.programs.kids.desc,
      items: ["Interactive Quran", "Arabic for Kids", "Islamic Stories", "Games & Activities", "Character Building"],
    },
  ];

  return (
    <>
      <Section eyebrow="Programs" title={t.programs.title} subtitle={t.programs.subtitle} center>
        <div className="space-y-10">
          {programs.map((p, i) => (
            <div
              key={p.name}
              className={`grid gap-8 overflow-hidden rounded-3xl border border-border bg-surface/50 p-6 lg:grid-cols-2 lg:p-10 ${
                i % 2 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-primary/20">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary sm:text-3xl">{p.name}</h3>
                <p className="mt-3 text-muted-foreground">{p.desc}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section className="border-y border-border/50 bg-gradient-to-b from-surface/20 via-background to-surface/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {t.programs.videoEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{t.programs.videoTitle}</h2>
            <p className="mt-3 text-muted-foreground">{t.programs.videoSubtitle}</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-black shadow-2xl shadow-primary/20">
            <Media url={videoUrl} />
          </div>
        </div>
      </section>

      <Section eyebrow="Courses" title={t.courses.title} subtitle={t.courses.subtitle} center>
        <CourseCards items={catalog?.courses} />
      </Section>

      <CTABlock />
    </>
  );
}

function videoEmbed(url: string) {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/))([\w-]{11})|youtu\.be\/([\w-]{11})/,
  );
  if (m) return { type: "youtube" as const, id: m[1] || m[2] };
  return { type: "file" as const, url };
}

function Media({ url }: { url: string }) {
  const emb = videoEmbed(url);
  if (emb.type === "youtube") {
    return (
      <div className="aspect-video overflow-hidden">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${emb.id}`}
          title="Qumra Academy intro video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video
      src={url}
      controls
      playsInline
      preload="metadata"
      className="h-auto w-full"
    />
  );
}
