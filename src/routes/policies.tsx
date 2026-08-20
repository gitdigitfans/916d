import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/qumra/Section";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { ShieldCheck } from "lucide-react";
import { getPoliciesFn, type Policy } from "@/lib/admin-server";

export const Route = createFileRoute("/policies")({
  loader: async () => {
    try {
      return await getPoliciesFn();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: "Policies — Qumra Academy" },
      { name: "description", content: "Qumra Academy attendance, cancellation, refund, and respect policies." },
      { property: "og:title", content: "Policies — Qumra Academy" },
      { property: "og:description", content: "Academy policies and code of conduct." },
      { property: "og:url", content: "/policies" },
    ],
    links: [{ rel: "canonical", href: "/policies" }],
  }),
  component: Policies,
});

function Policies() {
  const { t, lang } = useLang();
  const items = Route.useLoaderData();

  const policies: { t: string; d: string }[] = items?.length
    ? items.map((p: Policy) => ({
        t: lang === "ar" ? p.title_ar : p.title_en,
        d: lang === "ar" ? p.desc_ar : p.desc_en,
      }))
    : t.policies.items;

  return (
    <Section eyebrow="Policies" title={t.policies.title} center>
      <div className="grid gap-4 md:grid-cols-2">
        {policies.map((p) => (
          <div key={p.t} className="rounded-2xl border border-border bg-surface/50 p-6">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{p.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
