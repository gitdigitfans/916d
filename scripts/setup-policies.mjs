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

const CREATE_POLICIES = `
CREATE TABLE IF NOT EXISTS public.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL DEFAULT '',
  title_ar text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  desc_ar text NOT NULL DEFAULT '',
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
`;

const SEED_POLICIES = `
INSERT INTO public.policies (title_en, title_ar, desc_en, desc_ar, visible, sort_order) VALUES
('Attendance', 'الحضور', 'Students are expected to attend all scheduled classes on time.', 'الالتزام بحضور كل الحصص في مواعيدها.', true, 0),
('Cancellation', 'الإلغاء', 'Classes may be rescheduled with at least 24 hours'' notice.', 'يمكن إعادة جدولة الحصص بإشعار قبل 24 ساعة على الأقل.', true, 1),
('Late Attendance', 'التأخر', 'Students arriving more than 15 minutes late may lose the session.', 'الطالب الذي يتأخر أكثر من 15 دقيقة قد يفقد الحصة.', true, 2),
('Teacher Replacement', 'استبدال المعلم', 'Teachers may be replaced when necessary while maintaining the same educational standards.', 'يمكن استبدال المعلم عند الحاجة مع الحفاظ على نفس الجودة.', true, 3),
('Refund Policy', 'الاسترداد', 'Refunds are subject to academy terms and conditions.', 'الاسترداد يخضع لشروط وأحكام الأكاديمية.', true, 4),
('Respect Policy', 'الاحترام', 'Students and teachers are expected to maintain respectful communication throughout all sessions.', 'الالتزام بالتواصل المحترم بين الطلاب والمعلمين طوال الحصص.', true, 5)
ON CONFLICT DO NOTHING;
`;

console.log("== creating policies table ==");
console.log((await sql(CREATE_POLICIES)).slice(0, 200) || "ok");
console.log("== seeding policies ==");
console.log((await sql(SEED_POLICIES)).slice(0, 200) || "ok");
