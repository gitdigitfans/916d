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

const encoder = new TextEncoder();
function bufToHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randomSalt() {
  return bufToHex(crypto.getRandomValues(new Uint8Array(16)));
}
async function hashPassword(salt, password) {
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bufToHex(digest);
}

const EMAIL = "admin@gmail.com";
const PASSWORD = "123456";
const salt = randomSalt();
const hash = await hashPassword(salt, PASSWORD);

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email text NOT NULL,
  password_hash text NOT NULL,
  salt text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
`;

const SEED = `
INSERT INTO public.admin_credentials (id, email, password_hash, salt)
VALUES (1, '${EMAIL}', '${hash}', '${salt}')
ON CONFLICT (id) DO NOTHING;
`;

console.log("== creating admin_credentials table ==");
console.log((await sql(CREATE_TABLE)).slice(0, 200) || "ok");
console.log("== seeding admin credentials ==");
console.log((await sql(SEED)).slice(0, 200) || "ok");
console.log(`seeded email=${EMAIL} (password already hashed, salt=${salt.slice(0, 8)}…)`);
