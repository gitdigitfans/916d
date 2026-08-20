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

const CREATE_FAQS = `
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en text NOT NULL DEFAULT '',
  question_ar text NOT NULL DEFAULT '',
  answer_en text NOT NULL DEFAULT '',
  answer_ar text NOT NULL DEFAULT '',
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
`;

const SEED_FAQS = `
INSERT INTO public.faqs (question_en, question_ar, answer_en, answer_ar, visible, sort_order) VALUES
('Do you offer free trial classes?', 'هل توفرون حصص تجريبية مجانية؟', 'Yes, every new student can book a free trial lesson.', 'نعم، يمكن لكل طالب جديد حجز حصة تجريبية مجانية.', true, 0),
('Are classes one-on-one?', 'هل الحصص فردية؟', 'Yes, private lessons are available for all programs.', 'نعم، دروس خاصة متاحة لكل البرامج.', true, 1),
('Can children join?', 'هل يمكن للأطفال الالتحاق؟', 'Absolutely. We offer specialized programs designed for children.', 'بالتأكيد. لدينا برامج مصممة خصيصًا للأطفال.', true, 2),
('Which countries do you serve?', 'أي دول تخدمون؟', 'Students from all around the world are welcome.', 'نرحّب بالطلاب من كل دول العالم.', true, 3),
('What languages are used during lessons?', 'ما اللغات المستخدمة في الحصص؟', 'English and Arabic.', 'اللغة الإنجليزية واللغة العربية.', true, 4)
ON CONFLICT DO NOTHING;
`;

console.log("== creating faqs table ==");
console.log((await sql(CREATE_FAQS)).slice(0, 200) || "ok");
console.log("== seeding faqs ==");
console.log((await sql(SEED_FAQS)).slice(0, 200) || "ok");
