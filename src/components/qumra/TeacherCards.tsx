import { useLang } from "@/lib/i18n/LanguageProvider";
import { MihrabFrame } from "./MihrabFrame";
import type { Teacher } from "@/lib/admin-server";
import hossam from "@/assets/qumra/hossam.jpg.asset.json";
import salma from "@/assets/qumra/salma.jpg.asset.json";
import mohamed from "@/assets/qumra/mohamed.jpg.asset.json";

const fallbackTeachers: Teacher[] = [
  {
    id: "hossam",
    name_en: "Hossam Ashraf",
    name_ar: "حسام أشرف",
    role_en: "Senior Quran & Arabic Instructor",
    role_ar: "معلم قرآن ولغة عربية أول",
    spec_en: "Islamic Studies in English",
    spec_ar: "دراسات إسلامية بالإنجليزية",
    bio_en:
      "My mission is to guide students to a deep understanding of the Quran, master Arabic, and gain profound Islamic knowledge.",
    bio_ar:
      "رسالتي هي توجيه الطلاب إلى فهم عميق للقرآن وإتقان اللغة العربية وبناء معرفة إسلامية راسخة.",
    image_url: hossam.url,
    visible: true,
    sort_order: 0,
    created_at: "",
  },
  {
    id: "mohamed",
    name_en: "Mohamed Alaa'",
    name_ar: "محمد علاء",
    role_en: "Quran & Arabic Instructor",
    role_ar: "معلم قرآن ولغة عربية",
    spec_en: "Arabic for Non-Native Speakers",
    spec_ar: "العربية لغير الناطقين بها",
    bio_en:
      "I empower students to learn the Quran, excel in Arabic, and recite the Holy Book while fostering a strong connection with their faith.",
    bio_ar: "أسعى لتمكين الطلاب من تعلّم القرآن والتفوق في العربية مع بناء علاقة قوية مع دينهم.",
    image_url: mohamed.url,
    visible: true,
    sort_order: 1,
    created_at: "",
  },
  {
    id: "salma",
    name_en: "Salma Abdelaziz",
    name_ar: "سلمى عبد العزيز",
    role_en: "Quran & Tajweed Instructor",
    role_ar: "معلمة قرآن وتجويد",
    spec_en: "Ijazah",
    spec_ar: "الإجازة",
    bio_en:
      "I'm dedicated to helping my students achieve fluent Quran recitation with proper Tajweed and build a strong Arabic foundation.",
    bio_ar:
      "أساعد طلابي على تحقيق تلاوة طليقة للقرآن بأحكام التجويد وبناء أساس قوي في اللغة العربية.",
    image_url: salma.url,
    visible: true,
    sort_order: 2,
    created_at: "",
  },
];

export function TeacherCards({ items }: { items?: Teacher[] | null }) {
  const { lang } = useLang();
  const list = items && items.length > 0 ? items : fallbackTeachers;
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((t) => {
        const name = lang === "ar" ? t.name_ar || t.name_en : t.name_en || t.name_ar;
        const role = lang === "ar" ? t.role_ar || t.role_en : t.role_en || t.role_ar;
        const spec = lang === "ar" ? t.spec_ar || t.spec_en : t.spec_en || t.spec_ar;
        const bio = lang === "ar" ? t.bio_ar || t.bio_en : t.bio_en || t.bio_ar;
        return (
          <div
            key={t.id}
            className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-surface-elevated p-6 text-center transition hover:border-primary/60"
          >
            <div className="starfield absolute inset-0 opacity-30" />
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px]">
              <MihrabFrame className="h-full w-full">
                <img src={t.image_url} alt={name} className="h-full w-full object-cover" />
              </MihrabFrame>
            </div>
            <h3 className="relative mt-5 text-xl font-bold text-primary">{name}</h3>
            <div className="relative mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {role}
            </div>
            <div className="relative mt-3 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {spec}
            </div>
            <p className="relative mt-4 text-sm leading-relaxed text-foreground/80">{bio}</p>
          </div>
        );
      })}
    </div>
  );
}
