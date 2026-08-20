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

const CREATE = `
CREATE TABLE IF NOT EXISTS public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL DEFAULT '',
  name_ar text NOT NULL DEFAULT '',
  role_en text NOT NULL DEFAULT '',
  role_ar text NOT NULL DEFAULT '',
  spec_en text NOT NULL DEFAULT '',
  spec_ar text NOT NULL DEFAULT '',
  bio_en text NOT NULL DEFAULT '',
  bio_ar text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
`;

const SEED = `
INSERT INTO public.teachers (name_en, name_ar, role_en, role_ar, spec_en, spec_ar, bio_en, bio_ar, image_url, visible, sort_order) VALUES
('Hossam Ashraf', 'حسام أشرف', 'Senior Quran & Arabic Instructor', 'معلم قرآن ولغة عربية أول', 'Islamic Studies in English', 'دراسات إسلامية بالإنجليزية', 'My mission is to guide students to a deep understanding of the Quran, master Arabic, and gain profound Islamic knowledge.', 'رسالتي هي توجيه الطلاب إلى فهم عميق للقرآن وإتقان اللغة العربية وبناء معرفة إسلامية راسخة.', 'https://learn-quran-grow.lovable.app/__l5e/assets-v1/35174749-beca-44c3-9d92-2032e1b0b6df/hossam.jpg', true, 0),
('Mohamed Alaa''', 'محمد علاء', 'Quran & Arabic Instructor', 'معلم قرآن ولغة عربية', 'Arabic for Non-Native Speakers', 'العربية لغير الناطقين بها', 'I empower students to learn the Quran, excel in Arabic, and recite the Holy Book while fostering a strong connection with their faith.', 'أسعى لتمكين الطلاب من تعلّم القرآن والتفوق في العربية مع بناء علاقة قوية مع دينهم.', 'https://learn-quran-grow.lovable.app/__l5e/assets-v1/cdf8c943-0a6a-48c3-b78c-c9ba469658e6/mohamed.jpg', true, 1),
('Salma Abdelaziz', 'سلمى عبد العزيز', 'Quran & Tajweed Instructor', 'معلمة قرآن وتجويد', 'Ijazah', 'الإجازة', 'I''m dedicated to helping my students achieve fluent Quran recitation with proper Tajweed and build a strong Arabic foundation.', 'أساعد طلابي على تحقيق تلاوة طليقة للقرآن بأحكام التجويد وبناء أساس قوي في اللغة العربية.', 'https://learn-quran-grow.lovable.app/__l5e/assets-v1/0d526d9c-9f9b-4860-905c-24d8e64a9ab0/salma.jpg', true, 2)
ON CONFLICT DO NOTHING;
`;

console.log("== creating teachers table ==");
console.log((await sql(CREATE)).slice(0, 200) || "ok");
console.log("== seeding teachers ==");
console.log((await sql(SEED)).slice(0, 200) || "ok");
