import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";
import { ArrowRight } from "lucide-react";

export function CTABlock() {
  const { t, lang } = useLang();
  const msg = lang === "ar"
    ? "السلام عليكم، أرغب في حجز حصة تجريبية مجانية مع أكاديمية قمرة."
    : "Hello Qumra Academy, I'd like to book a free trial lesson.";
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-surface-elevated via-surface to-background p-10 text-center sm:p-16">
        <div className="starfield absolute inset-0 opacity-60" />
        <div className="relative">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.cta.subtitle}</p>
          <a
            href={whatsappUrl(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-primary mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            {t.hero.cta1} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  );
}
