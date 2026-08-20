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
CREATE TABLE IF NOT EXISTS public.site_contact (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp_number text NOT NULL DEFAULT '',
  whatsapp_display text NOT NULL DEFAULT '',
  email_info text NOT NULL DEFAULT '',
  email_support text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  youtube text NOT NULL DEFAULT '',
  linkedin text NOT NULL DEFAULT '',
  tiktok text NOT NULL DEFAULT '',
  twitter text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_contact ENABLE ROW LEVEL SECURITY;
`;

const SEED = `
INSERT INTO public.site_contact (id, whatsapp_number, whatsapp_display, email_info, email_support, facebook, instagram, youtube, linkedin, tiktok, twitter) VALUES
(1, '201011956363', '+20 101 195 6363', 'info@qumraacademy.com', 'support@qumraacademy.com', '', '', '', '', '', '')
ON CONFLICT (id) DO NOTHING;
`;

console.log("== creating site_contact table ==");
console.log((await sql(CREATE)).slice(0, 200) || "ok");
console.log("== seeding site_contact ==");
console.log((await sql(SEED)).slice(0, 200) || "ok");
