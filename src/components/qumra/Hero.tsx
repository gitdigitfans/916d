import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";
import img5 from "@/assets/qumra/5.jpg.asset.json";

export function Hero({ heroImage }: { heroImage?: string }) {
  const { t, lang } = useLang();
  const img = heroImage || img5.url;
  const msg = lang === "ar"
    ? "السلام عليكم، أرغب في حجز حصة تجريبية مجانية مع أكاديمية قمرة."
    : "Hello Qumra Academy, I'd like to book a free trial lesson.";
  return (
    <section className="relative overflow-hidden">
      <div className="starfield absolute inset-0 opacity-70" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:py-28">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3 w-3" />
            {t.hero.eyebrow}
          </div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappUrl(msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-primary inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </a>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              {t.hero.cta2}
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border/50 pt-6">
            {[
              { n: "1000+", l: t.stats.students },
              { n: "20+", l: t.stats.teachers },
              { n: "30+", l: t.stats.countries },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-primary sm:text-3xl">{s.n}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-2xl shadow-primary/20">
            <img src={img} alt="Qumra Academy — top class instructors" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -start-4 rounded-2xl border border-primary/30 bg-background/90 px-4 py-3 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-widest text-primary">{t.stats.satisfaction}</div>
            <div className="text-2xl font-bold">95%</div>
          </div>
        </div>
      </div>
    </section>
  );
}
