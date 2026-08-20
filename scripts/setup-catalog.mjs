const API = `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_ID || "YOUR_PROJECT_ID"}`;
const TOKEN = process.env.SUPABASE_PAT || "PASTE_YOUR_SUPABASE_PAT_HERE";

async function sql(query) {
  const res = await fetch(`${API}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status}: ${text}`);
  return text;
}

const CREATE_COURSES = `
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL DEFAULT '',
  name_ar text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  desc_ar text NOT NULL DEFAULT '',
  level_en text NOT NULL DEFAULT '',
  level_ar text NOT NULL DEFAULT '',
  duration_en text NOT NULL DEFAULT '',
  duration_ar text NOT NULL DEFAULT '',
  lessons int NOT NULL DEFAULT 0,
  tag_en text NOT NULL DEFAULT '',
  tag_ar text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
`;

const CREATE_PLANS = `
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL DEFAULT '',
  name_ar text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  features_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  features_ar jsonb NOT NULL DEFAULT '[]'::jsonb,
  popular boolean NOT NULL DEFAULT false,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
`;

const SEED_COURSES = `
INSERT INTO public.courses (name_en, name_ar, desc_en, desc_ar, level_en, level_ar, duration_en, duration_ar, lessons, tag_en, tag_ar, visible, sort_order) VALUES
('Noorani Qaida', 'القاعدة النورانية', 'Master Arabic letters, vowels, and rules to start reading the Quran with confidence.', 'إتقان الحروف والحركات والقواعد الأساسية لبدء قراءة القرآن بثقة.', 'Beginner', 'مبتدئ', '2 months', 'شهران', 24, 'Quran', 'قرآن', true, 0),
('Quran Recitation with Tajweed', 'تلاوة القرآن بأحكام التجويد', 'Learn to recite the Quran correctly with proper Tajweed rules and application.', 'تعلّم تلاوة القرآن بصورة صحيحة مع تطبيق أحكام التجويد.', 'Intermediate', 'متوسط', '6 months', '6 أشهر', 72, 'Quran', 'قرآن', true, 1),
('Quran Memorization (Hifz)', 'حفظ القرآن الكريم', 'Structured Hifz program with revision plans and one-to-one tracking.', 'برنامج حفظ منظّم مع خطط مراجعة ومتابعة فردية.', 'All Levels', 'كل المستويات', 'Ongoing', 'مستمر', 100, 'Hifz', 'حفظ', true, 2),
('Ijazah Certification', 'الإجازة في القرآن الكريم', 'Advanced program leading to an authenticated Ijazah in Quran recitation.', 'برنامج متقدّم يؤهلك للحصول على إجازة معتمدة في تلاوة القرآن.', 'Advanced', 'متقدم', '12+ months', '12+ شهر', 150, 'Certification', 'إجازة', true, 3),
('Arabic Language A1–B2', 'اللغة العربية A1–B2', 'Speak, read, and write Modern Standard Arabic through a practical curriculum.', 'تحدّث واقرأ واكتب العربية الفصحى عبر منهج عملي متدرّج.', 'All Levels', 'كل المستويات', '8 months', '8 أشهر', 80, 'Arabic', 'عربية', true, 4),
('Islamic Studies Essentials', 'أساسيات الدراسات الإسلامية', 'Aqeedah, Fiqh, Seerah, and daily Islamic practice — clear and authentic.', 'العقيدة والفقه والسيرة والتطبيق اليومي — بشكل واضح وأصيل.', 'Beginner', 'مبتدئ', '4 months', '4 أشهر', 48, 'Islamic', 'إسلامي', true, 5),
('Kids Quran & Arabic', 'قرآن وعربية للأطفال', 'Fun, interactive classes designed for children aged 5–12.', 'حصص ممتعة وتفاعلية مصممة للأطفال من 5 إلى 12 سنة.', 'Kids', 'أطفال', 'Flexible', 'مرنة', 60, 'Kids', 'أطفال', true, 6),
('Tafsir of Juz Amma', 'تفسير جزء عمّ', 'Understand the meanings of the final Juz — verse by verse.', 'فهم معاني الجزء الأخير من القرآن — آية آية.', 'Intermediate', 'متوسط', '3 months', '3 أشهر', 30, 'Tafsir', 'تفسير', true, 7)
ON CONFLICT DO NOTHING;
`;

const SEED_PLANS = `
INSERT INTO public.pricing_plans (name_en, name_ar, price, features_en, features_ar, popular, visible, sort_order) VALUES
('Starter', 'المبتدئ', '$29', '["2 Classes per Week","30 Minutes per Session","Live Online Classes","Monthly Progress Report"]'::jsonb, '["حصتان أسبوعيًا","30 دقيقة لكل حصة","حصص أونلاين مباشرة","تقرير تقدم شهري"]'::jsonb, false, true, 0),
('Standard', 'المتوسط', '$49', '["3 Classes per Week","45 Minutes per Session","Personalized Learning Plan","Monthly Assessment"]'::jsonb, '["3 حصص أسبوعيًا","45 دقيقة لكل حصة","خطة تعلم مخصصة","تقييم شهري"]'::jsonb, true, true, 1),
('Premium', 'المتقدم', '$89', '["5 Classes per Week","60 Minutes per Session","Dedicated Teacher","Priority Support","Weekly Reports","Personalized Curriculum"]'::jsonb, '["5 حصص أسبوعيًا","60 دقيقة لكل حصة","معلم مخصّص","دعم فوري","تقارير أسبوعية","منهج مخصص"]'::jsonb, false, true, 2)
ON CONFLICT DO NOTHING;
`;

console.log("== creating courses table ==");
console.log((await sql(CREATE_COURSES)).slice(0, 200) || "ok");
console.log("== creating pricing_plans table ==");
console.log((await sql(CREATE_PLANS)).slice(0, 200) || "ok");
console.log("== seeding courses ==");
console.log((await sql(SEED_COURSES)).slice(0, 200) || "ok");
console.log("== seeding pricing plans ==");
console.log((await sql(SEED_PLANS)).slice(0, 200) || "ok");
