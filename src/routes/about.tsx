import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Section } from "@/components/qumra/Section";
import { Stats } from "@/components/qumra/Stats";
import { CTABlock } from "@/components/qumra/CTABlock";
import { useLang } from "@/lib/i18n/LanguageProvider";
import {
  Award,
  BookOpen,
  Clock,
  Eye,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import img2 from "@/assets/qumra/2.jpg.asset.json";
import img3 from "@/assets/qumra/3.jpg.asset.json";
import img5 from "@/assets/qumra/5.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Qumra Academy" },
      { name: "description", content: "Qumra Academy: our vision, mission, and core values for global Islamic education." },
      { property: "og:title", content: "About — Qumra Academy" },
      { property: "og:description", content: "Our vision, mission, and core values." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
} as const;

function About() {
  const { t, lang } = useLang();

  const values = [
    { l: t.about.values[0], Icon: Award },
    { l: t.about.values[1], Icon: ShieldCheck },
    { l: t.about.values[2], Icon: HeartHandshake },
    { l: t.about.values[3], Icon: Users },
    { l: t.about.values[4], Icon: BookOpen },
    { l: t.about.values[5], Icon: GraduationCap },
    { l: t.about.values[6], Icon: Clock },
    { l: t.about.values[7], Icon: Lightbulb },
  ];

  const milestones = [
    { t: t.about.milestones[0].t, d: t.about.milestones[0].d, Icon: Rocket },
    { t: t.about.milestones[1].t, d: t.about.milestones[1].d, Icon: Globe2 },
    { t: t.about.milestones[2].t, d: t.about.milestones[2].d, Icon: Users },
    { t: t.about.milestones[3].t, d: t.about.milestones[3].d, Icon: Sparkles },
  ];

  const heroChips = [
    { n: "20+", l: t.stats.teachers, Icon: GraduationCap },
    { n: "1000+", l: t.stats.students, Icon: Users },
    { n: "30+", l: t.stats.countries, Icon: Globe2 },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="starfield absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute -start-40 top-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -end-40 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto max-w-4xl px-4 pb-16 pt-24 text-center sm:px-6 lg:pt-32"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Qumra Academy
          </div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.about.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t.about.short}</p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {heroChips.map((c) => (
              <div
                key={c.l}
                className="rounded-2xl border border-primary/20 bg-surface/50 p-4 backdrop-blur transition hover:border-primary/50"
              >
                <c.Icon className="mx-auto h-5 w-5 text-primary" />
                <div className="mt-2 text-xl font-bold text-foreground sm:text-2xl">{c.n}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{c.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Story */}
      <Section eyebrow="Who we are" title={t.about.storyT} center>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-transparent to-primary/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-2xl shadow-primary/20">
              <img src={img2.url} alt="Qumra Academy students in a live class" className="aspect-[4/5] w-full object-cover" />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-8 -start-4 w-44 overflow-hidden rounded-2xl border border-primary/30 shadow-xl sm:-start-8 sm:w-52"
            >
              <img src={img5.url} alt="One-to-one online lesson" className="aspect-[4/3] w-full object-cover" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-6 -end-3 rounded-2xl border border-primary/30 bg-background/90 px-5 py-4 shadow-xl backdrop-blur-xl sm:-end-6"
            >
              <div className="text-[11px] uppercase tracking-widest text-primary">{t.stats.satisfaction}</div>
              <div className="text-3xl font-bold text-foreground">95%</div>
            </motion.div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="order-1 lg:order-2">
            <p className="text-base leading-relaxed text-foreground/90">{t.about.story[0]}</p>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">{t.about.story[1]}</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t.about.story[2]}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/programs"
                className="glow-primary inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                {t.hero.cta2}
              </Link>
              <Link
                to="/enroll"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary hover:text-primary"
              >
                {t.hero.cta1}
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { Icon: Eye, t: t.about.visionT, d: t.about.vision, hue: "from-primary/25 via-transparent to-transparent" },
            { Icon: Target, t: t.about.missionT, d: t.about.mission, hue: "from-primary/15 via-transparent to-transparent" },
          ].map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-surface-elevated to-surface p-8"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.hue} opacity-0 transition duration-500 group-hover:opacity-100`} />
              <div className="relative">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary transition group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-bold">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-foreground/80">{c.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Stats strip */}
      <div className="border-y border-border/50 bg-surface/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stats />
        </div>
      </div>

      {/* Journey */}
      <Section eyebrow="Timeline" title={t.about.milestoneT} center>
        <div className="relative mx-auto max-w-3xl space-y-8 before:absolute before:start-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-gradient-to-b before:from-primary/40 before:via-border before:to-transparent">
          {milestones.map((ms, i) => (
            <motion.div
              key={ms.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`relative flex items-center gap-6 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}
            >
              <div className={`w-1/2 ${i % 2 === 0 ? "text-end" : "text-start"}`}>
                <div className="inline-block rounded-2xl border border-border bg-surface/60 p-5 text-start shadow-sm transition hover:border-primary/50">
                  <ms.Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-2 text-lg font-bold">{ms.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{ms.d}</p>
                </div>
              </div>
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-background shadow-lg">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
              <div className="w-1/2" />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section eyebrow="Values" title={t.about.valuesT} center>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="group rounded-2xl border border-border bg-surface/50 p-6 text-center transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                <v.Icon className="h-6 w-6" />
              </div>
              <div className="mt-4 font-semibold text-foreground">{v.l}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      <CTABlock />
    </>
  );
}
