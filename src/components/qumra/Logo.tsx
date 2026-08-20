import { useLang } from "@/lib/i18n/LanguageProvider";
import lightLogoSrc from "@/assets/qumra-logo-light.png";
import darkLogoSrc from "@/assets/qumra-logo-clean.png";

export function Logo({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { t } = useLang();
  return (
    <div className="flex items-center">
      <img
        src={dark ? darkLogoSrc : lightLogoSrc}
        alt="Qumra Academy"
        className={`${compact ? "h-9" : "h-12 md:h-14"} w-auto drop-shadow-[0_2px_12px_rgba(125,211,252,0.55)]`}
        loading="eager"
        decoding="async"
      />
      <span className="sr-only">{t.nav.home}</span>
    </div>
  );
}
