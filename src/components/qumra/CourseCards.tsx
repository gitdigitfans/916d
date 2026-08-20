import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";
import type { Course } from "@/lib/admin-server";
import { BookOpen, Clock, GraduationCap, Layers } from "lucide-react";
import img2 from "@/assets/qumra/2.jpg.asset.json";
import img3 from "@/assets/qumra/3.jpg.asset.json";
import img4 from "@/assets/qumra/4.jpg.asset.json";
import img5 from "@/assets/qumra/5.jpg.asset.json";
import imgF from "@/assets/qumra/f2.jpg.asset.json";
import imgI from "@/assets/qumra/ii.jpg.asset.json";

const IMGS = [img2.url, img3.url, img4.url, img5.url, imgF.url, imgI.url, img2.url, img3.url];

export function CourseCards({ items }: { items?: Course[] }) {
  const { t, lang } = useLang();

  if (!items || items.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.courses.items.map((c, i) => (
          <article
            key={c.name}
            className="group overflow-hidden rounded-2xl border border-border bg-surface/50 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={IMGS[i % IMGS.length]}
                alt={c.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                {c.tag}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-primary">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{c.desc}</p>
              <ul className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-foreground/80">
                <li className="flex flex-col items-start gap-1 rounded-lg border border-border/60 bg-background/40 p-2">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">{c.level}</span>
                </li>
                <li className="flex flex-col items-start gap-1 rounded-lg border border-border/60 bg-background/40 p-2">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">{c.duration}</span>
                </li>
                <li className="flex flex-col items-start gap-1 rounded-lg border border-border/60 bg-background/40 p-2">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">{c.lessons}</span>
                </li>
              </ul>
              <a
                href={whatsappUrl(
                  lang === "ar"
                    ? `السلام عليكم، أرغب في التسجيل في كورس: ${c.name}`
                    : `Hello, I'd like to enroll in the course: ${c.name}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"
              >
                <BookOpen className="h-4 w-4" />
                {t.courses.enroll}
              </a>
            </div>
          </article>
        ))}
      </div>
    );
  }

  const cards = items.map((c) => ({
    name: lang === "ar" ? c.name_ar : c.name_en,
    desc: lang === "ar" ? c.desc_ar : c.desc_en,
    level: lang === "ar" ? c.level_ar : c.level_en,
    duration: lang === "ar" ? c.duration_ar : c.duration_en,
    lessons: c.lessons,
    tag: lang === "ar" ? c.tag_ar : c.tag_en,
    image: c.image_url,
  }));

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c, i) => (
        <article
          key={i}
          className="group overflow-hidden rounded-2xl border border-border bg-surface/50 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={c.image || IMGS[i % IMGS.length]}
              alt={c.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
              {c.tag}
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-primary">{c.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{c.desc}</p>
            <ul className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-foreground/80">
              <li className="flex flex-col items-start gap-1 rounded-lg border border-border/60 bg-background/40 p-2">
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold">{c.level}</span>
              </li>
              <li className="flex flex-col items-start gap-1 rounded-lg border border-border/60 bg-background/40 p-2">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold">{c.duration}</span>
              </li>
              <li className="flex flex-col items-start gap-1 rounded-lg border border-border/60 bg-background/40 p-2">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold">{c.lessons}</span>
              </li>
            </ul>
            <a
              href={whatsappUrl(
                lang === "ar"
                  ? `السلام عليكم، أرغب في التسجيل في كورس: ${c.name}`
                  : `Hello, I'd like to enroll in the course: ${c.name}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"
            >
              <BookOpen className="h-4 w-4" />
              {t.courses.enroll}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
