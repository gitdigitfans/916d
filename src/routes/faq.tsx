import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/qumra/Section";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { CTABlock } from "@/components/qumra/CTABlock";
import { getFaqsFn, type FaqItem } from "@/lib/admin-server";

export const Route = createFileRoute("/faq")({
  loader: async () => {
    try {
      return await getFaqsFn();
    } catch {
      return null;
    }
  },
  head: () => ({
    meta: [
      { title: "FAQ — Qumra Academy" },
      { name: "description", content: "Answers to common questions about Qumra Academy's online Quran and Arabic classes." },
      { property: "og:title", content: "FAQ — Qumra Academy" },
      { property: "og:description", content: "Trials, one-to-one classes, ages, and languages." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FAQ,
});

function FAQ() {
  const { t, lang } = useLang();
  const items = Route.useLoaderData();
  const [open, setOpen] = useState<number | null>(0);

  const faqs: { q: string; a: string }[] = items?.length
    ? items.map((it: FaqItem) => ({
        q: lang === "ar" ? it.question_ar : it.question_en,
        a: lang === "ar" ? it.answer_ar : it.answer_en,
      }))
    : t.faq.items;

  return (
    <>
      <Section eyebrow="FAQ" title={t.faq.title} center>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((it, i) => (
            <button
              key={i}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full rounded-2xl border border-border bg-surface/50 p-5 text-start transition hover:border-primary/60"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">{it.q}</span>
                {open === i ? <Minus className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
              </div>
              {open === i && <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>}
            </button>
          ))}
        </div>
      </Section>
      <CTABlock />
    </>
  );
}
