import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Music2,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { useContact } from "@/lib/i18n/ContactProvider";
import { Logo } from "./Logo";

export function Footer() {
  const { t, lang } = useLang();
  const contact = useContact();
  const year = new Date().getFullYear();

  const socials = [
    { Icon: Facebook, href: contact.facebook },
    { Icon: Instagram, href: contact.instagram },
    { Icon: Youtube, href: contact.youtube },
    { Icon: Linkedin, href: contact.linkedin },
    { Icon: Music2, href: contact.tiktok },
    { Icon: Twitter, href: contact.twitter },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-border/50 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo dark />
          <p className="text-sm leading-relaxed text-muted-foreground">{t.footer.about}</p>
          {socials.length > 0 && (
            <div className="flex gap-2">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            {t.footer.quickLinks}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: "/", label: t.nav.home },
              { to: "/about", label: t.nav.about },
              { to: "/pricing", label: t.nav.pricing },
              { to: "/policies", label: t.nav.policies },
              { to: "/faq", label: t.nav.faq },
              { to: "/contact", label: t.nav.contact },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-foreground/75 transition hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            {t.footer.programsT}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              t.programs.quran.name,
              t.programs.islamic.name,
              t.programs.arabic.name,
              t.programs.kids.name,
            ].map((p) => (
              <li key={p}>
                <Link to="/programs" className="text-foreground/75 transition hover:text-primary">
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            {t.footer.newsletter}
          </h4>
          <p className="mb-3 text-sm text-muted-foreground">{t.footer.newsletterDesc}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
              if (input?.value)
                window.location.href = `mailto:${contact.email_info || "info@qumraacademy.com"}?subject=Subscribe&body=${input.value}`;
            }}
            className="flex gap-2"
          >
            <input
              name="email"
              type="email"
              required
              placeholder={lang === "ar" ? "بريدك الإلكتروني" : "your@email.com"}
              className="min-w-0 flex-1 rounded-full border border-border bg-background/50 px-3.5 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
            >
              {t.footer.subscribe}
            </button>
          </form>
          <div className="mt-4 space-y-2 text-sm">
            {contact.email_info && (
              <a
                href={`mailto:${contact.email_info}`}
                className="flex items-center gap-2 text-foreground/75 hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" /> {contact.email_info}
              </a>
            )}
            {contact.email_support && (
              <a
                href={`mailto:${contact.email_support}`}
                className="flex items-center gap-2 text-foreground/75 hover:text-primary"
              >
                <MessageCircle className="h-3.5 w-3.5" /> {contact.email_support}
              </a>
            )}
            {contact.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/75 hover:text-primary"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {contact.address}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} Qumra Academy · {t.footer.rights}
          </p>
          <p>Read · Understand · Ascend</p>
        </div>
      </div>
    </footer>
  );
}
