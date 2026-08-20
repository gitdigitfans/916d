import { createClient } from "@supabase/supabase-js";

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
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL DEFAULT '',
  name_ar text NOT NULL DEFAULT '',
  text_en text NOT NULL DEFAULT '',
  text_ar text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
`;

const SEED = `
INSERT INTO public.testimonials (name_en, name_ar, text_en, text_ar, image_url, video_url, visible, sort_order) VALUES
('Parent · UK', 'ولي أمر · المملكة المتحدة', 'Excellent teachers and flexible scheduling. Highly recommended.', 'معلمون ممتازون وجدول مرن. أنصح بها بشدة.', '', '', true, 0),
('Parent · USA', 'ولي أمر · الولايات المتحدة', 'My children improved their Quran recitation in just a few months.', 'أطفالي تحسّنت تلاوتهم للقرآن في أشهر قليلة.', '', '', true, 1),
('Student · Canada', 'طالب · كندا', 'Professional instructors and a wonderful learning experience.', 'معلمون محترفون وتجربة تعلّم رائعة.', '', '', true, 2)
ON CONFLICT DO NOTHING;
`;

console.log("== creating table ==");
console.log((await sql(CREATE)).slice(0, 200) || "ok");
console.log("== seeding ==");
console.log((await sql(SEED)).slice(0, 200) || "ok");

const client = createClient(
  `https://${process.env.SUPABASE_PROJECT_ID || "YOUR_PROJECT_ID"}.supabase.co`,
  process.env.SUPABASE_ANON_KEY || "PASTE_YOUR_ANON_KEY_HERE"
);

console.log("== creating videos bucket ==");
const { data, error } = await client.storage.createBucket("site-videos", {
  public: true,
  fileSizeLimit: 52428800,
  allowedMimeTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
});
if (error) {
  console.log("createBucket error:", error.message);
  const list = await client.storage.listBuckets();
  console.log("existing buckets:", list.data?.map((b) => b.name));
} else {
  console.log("bucket created:", data);
}
