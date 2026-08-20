import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/qumra/Section";
import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";
import { getCatalogFn } from "@/lib/admin-server";
import { CTABlock } from "@/components/qumra/CTABlock";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  loader: async () => {
    try {
      return await getCatalogFn();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: "Pricing — Qumra Academy" },
      { name: "description", content: "Flexible pricing plans for Quran, Arabic, and Islamic Studies at Qumra Academy." },
      { property: "og:title", content: "Pricing — Qumra Academy" },
      { property: "og:description", content: "Starter, Standard, and Premium plans." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

function Pricing() {
  const { t, lang } = useLang();
  const catalog = Route.useLoaderData();

  const fallbackPlans = [
    { key: "starter", price: "$29", popular: false, name: t.pricing.plans.starter.name, features: t.pricing.plans.starter.features },
    { key: "standard", price: "$49", popular: true, name: t.pricing.plans.standard.name, features: t.pricing.plans.standard.features },
    { key: "premium", price: "$89", popular: false, name: t.pricing.plans.premium.name, features: t.pricing.plans.premium.features },
  ];

  const plans =
    catalog?.pricingPlans?.length
      ? catalog.pricingPlans.map((p) => ({
          name: lang === "ar" ? p.name_ar : p.name_en,
          price: p.price,
          popular: p.popular,
          features: lang === "ar" ? p.features_ar : p.features_en,
        }))
      : fallbackPlans;

  const msg = lang === "ar" ? "أرغب في الاشتراك في باقة" : "I'd like to subscribe to a plan";
  return (
    <>
      <Section eyebrow="Pricing" title={t.pricing.title} subtitle={t.pricing.subtitle} center>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                p.popular
                  ? "border-primary bg-gradient-to-b from-primary/15 to-surface glow-primary"
                  : "border-border bg-surface/50"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  {t.pricing.popular}
                </div>
              )}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-primary">{p.price}</span>
                <span className="text-sm text-muted-foreground">{t.pricing.perMonth}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={whatsappUrl(`${msg}: ${p.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  p.popular
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-primary text-primary hover:bg-primary/10"
                }`}
              >
                {t.pricing.cta}
              </a>
            </div>
          ))}
        </div>
      </Section>
      <CTABlock />
    </>
  );
}
