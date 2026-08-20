import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";

export function FloatingWhatsApp() {
  const { lang } = useLang();
  const msg =
    lang === "ar"
      ? "السلام عليكم، أرغب في معرفة المزيد عن أكاديمية قمرة."
      : "Hello Qumra Academy, I'd like to know more about your programs.";
  return (
    <a
      href={whatsappUrl(msg)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 end-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/40 transition hover:scale-105"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12a11.9 11.9 0 001.6 6L0 24l6.24-1.63A12 12 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.48-8.52zM12 21.8a9.78 9.78 0 01-5-1.37l-.36-.22-3.7.97.99-3.6-.23-.37A9.83 9.83 0 1121.83 12 9.79 9.79 0 0112 21.8zm5.36-7.34c-.29-.15-1.73-.85-2-.95s-.46-.15-.66.14-.76.95-.93 1.14-.34.22-.63.07a8.03 8.03 0 01-2.36-1.46 8.87 8.87 0 01-1.63-2.03c-.17-.29 0-.44.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.59-.9-2.17-.24-.57-.48-.5-.66-.5h-.56c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.4s1.02 2.78 1.16 2.97c.15.19 2 3.05 4.85 4.28.68.29 1.2.47 1.61.6.68.22 1.29.19 1.78.11.54-.08 1.73-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z" />
      </svg>
    </a>
  );
}
