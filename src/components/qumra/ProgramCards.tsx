import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { SiteProgram } from "@/lib/admin-server";
import img2 from "@/assets/qumra/2.jpg.asset.json";
import img3 from "@/assets/qumra/3.jpg.asset.json";
import img4 from "@/assets/qumra/4.jpg.asset.json";
import imgF from "@/assets/qumra/f2.jpg.asset.json";
import { ArrowRight } from "lucide-react";

export function ProgramCards({ programs }: { programs?: SiteProgram[] }) {
  const { t, lang } = useLang();
  const cards = programs
    ? programs.map((p) => ({
        img: p.image_url,
        name: lang === "ar" ? p.name_ar : p.name_en,
        desc: lang === "ar" ? p.desc_ar : p.desc_en,
      }))
    : [
        { img: img2.url, name: t.programs.intermediate, desc: t.programs.quran.desc },
        { img: img3.url, name: t.programs.hifz, desc: t.programs.quran.desc },
        { img: img4.url, name: t.programs.ijazah, desc: t.programs.islamic.desc },
        { img: imgF.url, name: t.programs.kids.name, desc: t.programs.kids.desc },
      ];
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.name}
          to="/programs"
          className="group relative overflow-hidden rounded-2xl border border-border bg-surface/50 transition hover:border-primary/60 hover:-translate-y-1"
        >
          <div className="aspect-square overflow-hidden">
            <img src={c.img} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="p-5">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary">{c.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              {t.programs.viewAll} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
