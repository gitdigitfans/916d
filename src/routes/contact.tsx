import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/qumra/Section";
import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";
import { useContact } from "@/lib/i18n/ContactProvider";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Qumra Academy" },
      {
        name: "description",
        content: "Contact Qumra Academy for enrolment, free trials, or general questions.",
      },
      { property: "og:title", content: "Contact — Qumra Academy" },
      { property: "og:description", content: "Get in touch via email or WhatsApp." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const { t, lang } = useLang();
  const contact = useContact();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text =
      lang === "ar"
        ? `الاسم: ${f.get("name")}\nالبريد: ${f.get("email")}\nالبرنامج: ${f.get("program")}\n\n${f.get("message")}`
        : `Name: ${f.get("name")}\nEmail: ${f.get("email")}\nProgram: ${f.get("program")}\n\n${f.get("message")}`;
    window.open(whatsappUrl(text), "_blank");
  }

  const items = [
    {
      Icon: Mail,
      label: t.contact.email,
      val: contact.email_info,
      href: `mailto:${contact.email_info}`,
    },
    {
      Icon: Mail,
      label: t.contact.support,
      val: contact.email_support,
      href: `mailto:${contact.email_support}`,
    },
    {
      Icon: Phone,
      label: t.contact.whatsapp,
      val: contact.whatsapp_display,
      href: whatsappUrl("Hello Qumra"),
    },
    {
      Icon: MapPin,
      label: t.contact.address,
      val: contact.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
    },
  ].filter((c) => c.val);

  const socials = [
    { Icon: Facebook, href: contact.facebook },
    { Icon: Instagram, href: contact.instagram },
    { Icon: Music2, href: contact.tiktok },
  ].filter((s) => s.href);

  return (
    <Section eyebrow="Contact" title={t.contact.title} subtitle={t.contact.subtitle} center>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {items.map((c) => (
            <a
              key={c.val}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface/50 p-5 transition hover:border-primary/60"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <c.Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {c.label}
                </div>
                <div className="mt-0.5 font-semibold">{c.val}</div>
              </div>
            </a>
          ))}
          {socials.length > 0 && (
            <div className="pt-2">
              <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {t.contact.follow}
              </div>
              <div className="flex gap-2">
                {socials.map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-border bg-surface/50 p-6 sm:p-8"
        >
          {(["name", "email"] as const).map((k) => (
            <input
              key={k}
              name={k}
              type={k === "email" ? "email" : "text"}
              required
              placeholder={t.contact.form[k]}
              className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
            />
          ))}
          <select
            name="program"
            required
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="">{t.contact.form.program}</option>
            <option>{t.programs.quran.name}</option>
            <option>{t.programs.islamic.name}</option>
            <option>{t.programs.arabic.name}</option>
            <option>{t.programs.kids.name}</option>
          </select>
          <textarea
            name="message"
            rows={5}
            required
            placeholder={t.contact.form.message}
            className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            {t.contact.form.submit}
          </button>
        </form>
      </div>
    </Section>
  );
}
