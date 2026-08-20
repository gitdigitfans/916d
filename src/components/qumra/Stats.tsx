import { useLang } from "@/lib/i18n/LanguageProvider";
import { GraduationCap, Users, Globe2, BookOpen, HeartHandshake, Headphones } from "lucide-react";

export function Stats() {
  const { t } = useLang();
  const stats = [
    { n: "5000+", l: t.stats.classes, Icon: BookOpen },
    { n: "1000+", l: t.stats.students, Icon: Users },
    { n: "20+", l: t.stats.teachers, Icon: GraduationCap },
    { n: "30+", l: t.stats.countries, Icon: Globe2 },
    { n: "95%", l: t.stats.satisfaction, Icon: HeartHandshake },
    { n: "24/7", l: t.stats.support, Icon: Headphones },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((s) => (
        <div key={s.l} className="rounded-2xl border border-border bg-surface/60 p-5 text-center">
          <s.Icon className="mx-auto h-6 w-6 text-primary" />
          <div className="mt-2 text-2xl font-bold text-foreground">{s.n}</div>
          <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
        </div>
      ))}
    </div>
  );
}
