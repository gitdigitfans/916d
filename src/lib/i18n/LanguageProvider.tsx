import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang, type Translations } from "./translations";
import { getCachedContact } from "./ContactProvider";

interface Ctx {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Translations;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      localStorage.getItem("qumra-lang")) as Lang | null;
    if (saved === "en" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("qumra-lang", l);
  };

  const value: Ctx = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: translations[lang],
    setLang,
    toggle: () => setLang(lang === "en" ? "ar" : "en"),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const c = useContext(LanguageContext);
  if (!c) throw new Error("useLang must be used inside LanguageProvider");
  return c;
}

export const WHATSAPP_NUMBER = "201011956363";
export const WHATSAPP_DISPLAY = "+20 101 195 6363";
export function whatsappUrl(message: string) {
  const number = getCachedContact().whatsapp_number || WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
