import { Link } from "@tanstack/react-router";
import { Menu, X, Languages } from "lucide-react";
import { useState } from "react";
import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";
import { Logo } from "./Logo";

export function Header() {
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/programs", label: t.nav.programs },
    { to: "/teachers", label: t.nav.teachers },
    { to: "/pricing", label: t.nav.pricing },
    { to: "/enroll", label: t.nav.enroll },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-sky-300"
              activeProps={{ className: "text-sky-300 bg-white/10" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:border-sky-300 hover:text-sky-300"
            aria-label="Toggle language"
          >
            <Languages className="h-3.5 w-3.5" />
            {lang === "en" ? "عربي" : "EN"}
          </button>
          <a
            href={whatsappUrl(
              lang === "ar"
                ? "السلام عليكم، أرغب في حجز حصة تجريبية مجانية مع أكاديمية قمرة."
                : "Hello Qumra Academy, I'd like to book a free trial lesson.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 sm:inline-flex"
          >
            {t.nav.bookTrial}
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/85 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-900/95 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-sky-300"
                activeProps={{ className: "text-sky-300 bg-white/10" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
