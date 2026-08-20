import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabase } from "./supabase-server";

export interface Student {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  program: string | null;
  level: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  student_id: string | null;
  student_name: string | null;
  teacher: string | null;
  topic: string | null;
  scheduled_at: string | null;
  duration_minutes: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  program: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface Stats {
  students: {
    total: number;
    byProgram: Record<string, number>;
    byStatus: Record<string, number>;
    newThisMonth: number;
  };
  lessons: {
    total: number;
    byStatus: Record<string, number>;
    byMonth: { month: string; count: number }[];
    upcoming: Lesson[];
  };
  bookings: { total: number; newCount: number };
}

const ADMIN_COOKIE = "qumra_admin";
const ADMIN_COOKIE_OPTS = { httpOnly: true, sameSite: "strict" as const, secure: true, path: "/" };

const encoder = new TextEncoder();
function bufToHex(buf: Uint8Array) {
  return [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randomSalt() {
  return bufToHex(crypto.getRandomValues(new Uint8Array(16)));
}
async function hashPassword(salt: string, password: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`${salt}:${password}`));
  return bufToHex(new Uint8Array(digest));
}
async function getAdminCredential() {
  const { data, error } = await supabase()
    .from("admin_credentials")
    .select("email, password_hash, salt")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export const isAdmin = createServerOnlyFn((): boolean => {
  return getCookie(ADMIN_COOKIE) === "1";
});

const requireAdmin = createServerOnlyFn((): void => {
  if (getCookie(ADMIN_COOKIE) !== "1") throw new Error("Unauthorized");
});

const studentInput = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")).default(""),
  phone: z.string().max(50).optional().or(z.literal("")).default(""),
  country: z.string().max(100).optional().or(z.literal("")).default(""),
  program: z.string().max(100).optional().or(z.literal("")).default(""),
  level: z.string().max(100).optional().or(z.literal("")).default(""),
  status: z.string().max(50).optional().or(z.literal("")).default("active"),
  notes: z.string().max(2000).optional().or(z.literal("")).default(""),
});

const lessonInput = z.object({
  student_id: z.string().optional().or(z.literal("")).default(""),
  student_name: z.string().max(200).optional().or(z.literal("")).default(""),
  teacher: z.string().max(200).optional().or(z.literal("")).default(""),
  topic: z.string().max(200).optional().or(z.literal("")).default(""),
  scheduled_at: z.string().optional().or(z.literal("")).default(""),
  duration_minutes: z.coerce.number().int().min(5).max(600).default(30),
  status: z.string().max(50).optional().or(z.literal("")).default("scheduled"),
  notes: z.string().max(2000).optional().or(z.literal("")).default(""),
});

const bookingInput = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().optional().or(z.literal("")).default(""),
  phone: z.string().max(50).optional().or(z.literal("")).default(""),
  program: z.string().max(100).optional().or(z.literal("")).default(""),
  message: z.string().max(2000).optional().or(z.literal("")).default(""),
});

function cleanStudent(d: z.infer<typeof studentInput>) {
  return {
    name: d.name,
    email: d.email || null,
    phone: d.phone || null,
    country: d.country || null,
    program: d.program || null,
    level: d.level || null,
    status: d.status || "active",
    notes: d.notes || null,
  };
}

function cleanLesson(d: z.infer<typeof lessonInput>) {
  return {
    student_id: d.student_id || null,
    student_name: d.student_name || null,
    teacher: d.teacher || null,
    topic: d.topic || null,
    scheduled_at: d.scheduled_at || null,
    duration_minutes: d.duration_minutes,
    status: d.status || "scheduled",
    notes: d.notes || null,
  };
}

/* ------------------------------ Auth ------------------------------ */

export const loginFn = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email().max(200), password: z.string().min(1).max(128) }))
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const cred = await getAdminCredential();
    if (!cred || cred.email.toLowerCase() !== email) return false;
    const hash = await hashPassword(cred.salt, data.password);
    if (hash === cred.password_hash) {
      setCookie(ADMIN_COOKIE, "1", ADMIN_COOKIE_OPTS);
      return true;
    }
    return false;
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(ADMIN_COOKIE, { path: "/" });
  return true;
});

export const isAdminFn = createServerFn({ method: "GET" }).handler(async () => isAdmin());

/** Admin: current login email (for the settings page). */
export const getAdminInfoFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const cred = await getAdminCredential();
  return { email: cred?.email ?? "" };
});

/** Admin: change the dashboard password. */
export const changePasswordFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      currentPassword: z.string().min(1).max(128),
      newPassword: z.string().min(6).max(128),
    }),
  )
  .handler(async ({ data }) => {
    requireAdmin();
    const cred = await getAdminCredential();
    if (!cred) throw new Error("Admin credentials are not configured");
    const currentHash = await hashPassword(cred.salt, data.currentPassword);
    if (currentHash !== cred.password_hash) throw new Error("Current password is incorrect");
    const salt = randomSalt();
    const passwordHash = await hashPassword(salt, data.newPassword);
    const { error } = await supabase()
      .from("admin_credentials")
      .update({ password_hash: passwordHash, salt, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return true;
  });

/* ------------------------------ Reads ------------------------------ */

export const listStudentsFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Student[];
});

export const listLessonsFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("lessons")
    .select("*")
    .order("scheduled_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Lesson[];
});

export const listBookingsFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Booking[];
});

export const getStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const db = supabase();

  const [studentsRes, lessonsRes, bookingsRes] = await Promise.all([
    db.from("students").select("*").order("created_at", { ascending: false }),
    db.from("lessons").select("*").order("scheduled_at", { ascending: false }),
    db.from("bookings").select("*").order("created_at", { ascending: false }),
  ]);
  if (studentsRes.error) throw new Error(studentsRes.error.message);
  if (lessonsRes.error) throw new Error(lessonsRes.error.message);
  if (bookingsRes.error) throw new Error(bookingsRes.error.message);

  const students = (studentsRes.data ?? []) as Student[];
  const lessons = (lessonsRes.data ?? []) as Lesson[];
  const bookings = (bookingsRes.data ?? []) as Booking[];

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const byProgram: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  for (const s of students) {
    byProgram[s.program || "unspecified"] = (byProgram[s.program || "unspecified"] ?? 0) + 1;
    byStatus[s.status || "unknown"] = (byStatus[s.status || "unknown"] ?? 0) + 1;
  }

  const lessonByStatus: Record<string, number> = {};
  for (const l of lessons) {
    lessonByStatus[l.status || "unknown"] = (lessonByStatus[l.status || "unknown"] ?? 0) + 1;
  }

  const byMonth: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const count = lessons.filter((l) => {
      if (!l.scheduled_at) return false;
      return l.scheduled_at.startsWith(key);
    }).length;
    byMonth.push({ month: key, count });
  }

  const upcoming = lessons
    .filter((l) => l.scheduled_at && new Date(l.scheduled_at) >= new Date())
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())
    .slice(0, 5);

  const stats: Stats = {
    students: {
      total: students.length,
      byProgram,
      byStatus,
      newThisMonth: students.filter((s) => new Date(s.created_at) >= monthStart).length,
    },
    lessons: {
      total: lessons.length,
      byStatus: lessonByStatus,
      byMonth,
      upcoming,
    },
    bookings: {
      total: bookings.length,
      newCount: bookings.filter((b) => b.status === "new").length,
    },
  };
  return stats;
});

/* --------------------------- Mutations --------------------------- */

export const createStudentFn = createServerFn({ method: "POST" })
  .validator(studentInput)
  .handler(async ({ data }) => {
    requireAdmin();
    const { data: row, error } = await supabase()
      .from("students")
      .insert(cleanStudent(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as Student;
  });

export const updateStudentFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), input: studentInput }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase()
      .from("students")
      .update(cleanStudent(data.input))
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const deleteStudentFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("students").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const createLessonFn = createServerFn({ method: "POST" })
  .validator(lessonInput)
  .handler(async ({ data }) => {
    requireAdmin();
    const { data: row, error } = await supabase()
      .from("lessons")
      .insert(cleanLesson(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as Lesson;
  });

export const updateLessonFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), input: lessonInput }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase()
      .from("lessons")
      .update(cleanLesson(data.input))
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const deleteLessonFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("lessons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), status: z.string().max(50) }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase()
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

export const deleteBookingFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("bookings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

/* -------------------- Public enrollment (no auth) -------------------- */

export const createBookingFn = createServerFn({ method: "POST" })
  .validator(bookingInput)
  .handler(async ({ data }) => {
    const { error } = await supabase()
      .from("bookings")
      .insert({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        program: data.program || null,
        message: data.message || null,
        status: "new",
      });
    if (error) throw new Error(error.message);
    return true;
  });

/* ------------------------- Site content (CMS) ------------------------- */

export interface SiteProgram {
  id: string;
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  image_url: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface HomeContent {
  hero_image: string;
  programs: SiteProgram[];
  testimonials: Testimonial[];
  teachers: Teacher[];
}

export interface Testimonial {
  id: string;
  name_en: string;
  name_ar: string;
  text_en: string;
  text_ar: string;
  image_url: string;
  video_url: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface Teacher {
  id: string;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  spec_en: string;
  spec_ar: string;
  bio_en: string;
  bio_ar: string;
  image_url: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface ContactInfo {
  id: number;
  whatsapp_number: string;
  whatsapp_display: string;
  email_info: string;
  email_support: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
  twitter: string;
  updated_at: string;
}

export interface Course {
  id: string;
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  level_en: string;
  level_ar: string;
  duration_en: string;
  duration_ar: string;
  lessons: number;
  tag_en: string;
  tag_ar: string;
  image_url: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  name_en: string;
  name_ar: string;
  price: string;
  features_en: string[];
  features_ar: string[];
  popular: boolean;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface CatalogContent {
  courses: Course[];
  pricingPlans: PricingPlan[];
}

const programInput = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().min(1).max(200),
  name_ar: z.string().min(1).max(200),
  desc_en: z.string().max(2000).optional().or(z.literal("")).default(""),
  desc_ar: z.string().max(2000).optional().or(z.literal("")).default(""),
  image_url: z.string().max(1000).optional().or(z.literal("")).default(""),
  visible: z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
});

function cleanProgram(d: z.infer<typeof programInput>) {
  return {
    name_en: d.name_en,
    name_ar: d.name_ar,
    desc_en: d.desc_en,
    desc_ar: d.desc_ar,
    image_url: d.image_url,
    visible: d.visible,
    sort_order: d.sort_order,
  };
}

/** Public homepage content (no auth). */
export const getHomeContentFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = supabase();
  const [settingsRes, programsRes, testimonialsRes, teachersRes] = await Promise.all([
    db.from("site_settings").select("hero_image").maybeSingle(),
    db.from("programs").select("*").eq("visible", true).order("sort_order", { ascending: true }),
    db
      .from("testimonials")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true }),
    db.from("teachers").select("*").eq("visible", true).order("sort_order", { ascending: true }),
  ]);
  if (settingsRes.error) throw new Error(settingsRes.error.message);
  if (programsRes.error) throw new Error(programsRes.error.message);
  if (testimonialsRes.error) throw new Error(testimonialsRes.error.message);
  if (teachersRes.error) throw new Error(teachersRes.error.message);
  const content: HomeContent = {
    hero_image: settingsRes.data?.hero_image || "",
    programs: (programsRes.data ?? []) as SiteProgram[],
    testimonials: (testimonialsRes.data ?? []) as Testimonial[],
    teachers: (teachersRes.data ?? []) as Teacher[],
  };
  return content;
});

/** Admin: full program list including hidden ones. */
export const listSiteProgramsFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as SiteProgram[];
});

/** Admin: current site settings. */
export const getSiteSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("site_settings")
    .select("hero_image, programs_video_url")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return {
    hero_image: data?.hero_image || "",
    programs_video_url: (data as { programs_video_url?: string } | null)?.programs_video_url || "",
  };
});

/** Admin: update hero image URL. */
export const updateHeroImageFn = createServerFn({ method: "POST" })
  .validator(z.object({ image_url: z.string().min(1).max(1000) }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase()
      .from("site_settings")
      .update({ hero_image: data.image_url, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return true;
  });

/** Public: programs intro video URL (no auth). */
export const getProgramsVideoFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase()
    .from("site_settings")
    .select("programs_video_url")
    .eq("id", 1)
    .maybeSingle();
  if (error) return { programs_video_url: "" };
  return {
    programs_video_url: (data as { programs_video_url?: string } | null)?.programs_video_url || "",
  };
});

/** Admin: update programs intro video URL. */
export const updateProgramsVideoFn = createServerFn({ method: "POST" })
  .validator(z.object({ video_url: z.string().max(1000).optional().or(z.literal("")).default("") }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase()
      .from("site_settings")
      .update({ programs_video_url: data.video_url, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return true;
  });

/** Admin: create or update a program card. */
export const upsertSiteProgramFn = createServerFn({ method: "POST" })
  .validator(programInput)
  .handler(async ({ data }) => {
    requireAdmin();
    if (data.id) {
      const { data: updated, error } = await supabase()
        .from("programs")
        .update({ ...cleanProgram(data), updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as SiteProgram;
    }
    const { data: created, error } = await supabase()
      .from("programs")
      .insert(cleanProgram(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created as SiteProgram;
  });

/** Admin: delete a program card. */
export const deleteSiteProgramFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("programs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

/** Admin: upload an image file to Supabase Storage and return its public URL. */
export const uploadSiteImageFn = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  requireAdmin();
  const form = data as unknown as FormData;
  const file = form.get("file");
  if (!file || typeof (file as File).arrayBuffer !== "function")
    throw new Error("No file provided");
  const f = file as File;
  const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = await f.arrayBuffer();
  const { data: uploaded, error } = await supabase()
    .storage.from("site-images")
    .upload(key, buf, {
      contentType: f.type || "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(error.message);
  const { data: pub } = supabase().storage.from("site-images").getPublicUrl(uploaded.path);
  return pub.publicUrl;
});

/* ------------------------- Testimonials (CMS) ------------------------- */

const testimonialInput = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().max(200).optional().or(z.literal("")).default(""),
  name_ar: z.string().max(200).optional().or(z.literal("")).default(""),
  text_en: z.string().max(2000).optional().or(z.literal("")).default(""),
  text_ar: z.string().max(2000).optional().or(z.literal("")).default(""),
  image_url: z.string().max(1000).optional().or(z.literal("")).default(""),
  video_url: z.string().max(1000).optional().or(z.literal("")).default(""),
  visible: z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
});

function cleanTestimonial(d: z.infer<typeof testimonialInput>) {
  return {
    name_en: d.name_en,
    name_ar: d.name_ar,
    text_en: d.text_en,
    text_ar: d.text_ar,
    image_url: d.image_url,
    video_url: d.video_url,
    visible: d.visible,
    sort_order: d.sort_order,
  };
}

/** Admin: full testimonial list including hidden ones. */
export const listTestimonialsFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Testimonial[];
});

/** Admin: create or update a testimonial. */
export const upsertTestimonialFn = createServerFn({ method: "POST" })
  .validator(testimonialInput)
  .handler(async ({ data }) => {
    requireAdmin();
    if (data.id) {
      const { data: updated, error } = await supabase()
        .from("testimonials")
        .update({ ...cleanTestimonial(data), updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as Testimonial;
    }
    const { data: created, error } = await supabase()
      .from("testimonials")
      .insert(cleanTestimonial(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created as Testimonial;
  });

/** Admin: delete a testimonial. */
export const deleteTestimonialFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("testimonials").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

/* ------------------------- Teachers (CMS) ------------------------- */

const teacherInput = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().max(200).optional().or(z.literal("")).default(""),
  name_ar: z.string().max(200).optional().or(z.literal("")).default(""),
  role_en: z.string().max(200).optional().or(z.literal("")).default(""),
  role_ar: z.string().max(200).optional().or(z.literal("")).default(""),
  spec_en: z.string().max(200).optional().or(z.literal("")).default(""),
  spec_ar: z.string().max(200).optional().or(z.literal("")).default(""),
  bio_en: z.string().max(2000).optional().or(z.literal("")).default(""),
  bio_ar: z.string().max(2000).optional().or(z.literal("")).default(""),
  image_url: z.string().max(1000).optional().or(z.literal("")).default(""),
  visible: z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
});

function cleanTeacher(d: z.infer<typeof teacherInput>) {
  return {
    name_en: d.name_en,
    name_ar: d.name_ar,
    role_en: d.role_en,
    role_ar: d.role_ar,
    spec_en: d.spec_en,
    spec_ar: d.spec_ar,
    bio_en: d.bio_en,
    bio_ar: d.bio_ar,
    image_url: d.image_url,
    visible: d.visible,
    sort_order: d.sort_order,
  };
}

/** Public: visible teachers (no auth). */
export const getTeachersFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase()
    .from("teachers")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Teacher[];
});

/** Admin: full teacher list including hidden ones. */
export const listTeachersFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("teachers")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Teacher[];
});

/** Admin: create or update a teacher. */
export const upsertTeacherFn = createServerFn({ method: "POST" })
  .validator(teacherInput)
  .handler(async ({ data }) => {
    requireAdmin();
    if (data.id) {
      const { data: updated, error } = await supabase()
        .from("teachers")
        .update({ ...cleanTeacher(data), updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as Teacher;
    }
    const { data: created, error } = await supabase()
      .from("teachers")
      .insert(cleanTeacher(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created as Teacher;
  });

/** Admin: delete a teacher. */
export const deleteTeacherFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("teachers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

/* ------------------------- Contact info (CMS) ------------------------- */

const contactInput = z.object({
  whatsapp_number: z.string().max(50).optional().or(z.literal("")).default(""),
  whatsapp_display: z.string().max(100).optional().or(z.literal("")).default(""),
  email_info: z.string().max(200).optional().or(z.literal("")).default(""),
  email_support: z.string().max(200).optional().or(z.literal("")).default(""),
  address: z.string().max(500).optional().or(z.literal("")).default(""),
  facebook: z.string().max(500).optional().or(z.literal("")).default(""),
  instagram: z.string().max(500).optional().or(z.literal("")).default(""),
  youtube: z.string().max(500).optional().or(z.literal("")).default(""),
  linkedin: z.string().max(500).optional().or(z.literal("")).default(""),
  tiktok: z.string().max(500).optional().or(z.literal("")).default(""),
  twitter: z.string().max(500).optional().or(z.literal("")).default(""),
});

/** Public: site contact info (no auth). */
export const getContactInfoFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase()
    .from("site_contact")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as ContactInfo | null;
});

/** Admin: update site contact info. */
export const updateContactInfoFn = createServerFn({ method: "POST" })
  .validator(contactInput)
  .handler(async ({ data }) => {
    requireAdmin();
    const { data: updated, error } = await supabase()
      .from("site_contact")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated as ContactInfo;
  });

/** Admin: upload a video file to Supabase Storage and return its public URL. */
export const uploadSiteVideoFn = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  requireAdmin();
  const form = data as unknown as FormData;
  const file = form.get("file");
  if (!file || typeof (file as File).arrayBuffer !== "function")
    throw new Error("No file provided");
  const f = file as File;
  const ext = (f.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = await f.arrayBuffer();
  const { data: uploaded, error } = await supabase()
    .storage.from("site-videos")
    .upload(key, buf, {
      contentType: f.type || "video/mp4",
      upsert: false,
    });
  if (error) throw new Error(error.message);
  const { data: pub } = supabase().storage.from("site-videos").getPublicUrl(uploaded.path);
  return pub.publicUrl;
});

/* -------------------- Catalog: courses & pricing (CMS) -------------------- */

const courseInput = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().min(1).max(200),
  name_ar: z.string().min(1).max(200),
  desc_en: z.string().max(2000).optional().or(z.literal("")).default(""),
  desc_ar: z.string().max(2000).optional().or(z.literal("")).default(""),
  level_en: z.string().max(100).optional().or(z.literal("")).default(""),
  level_ar: z.string().max(100).optional().or(z.literal("")).default(""),
  duration_en: z.string().max(100).optional().or(z.literal("")).default(""),
  duration_ar: z.string().max(100).optional().or(z.literal("")).default(""),
  lessons: z.coerce.number().int().min(0).max(10000).default(0),
  tag_en: z.string().max(100).optional().or(z.literal("")).default(""),
  tag_ar: z.string().max(100).optional().or(z.literal("")).default(""),
  image_url: z.string().max(1000).optional().or(z.literal("")).default(""),
  visible: z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
});

function cleanCourse(d: z.infer<typeof courseInput>) {
  return {
    name_en: d.name_en,
    name_ar: d.name_ar,
    desc_en: d.desc_en,
    desc_ar: d.desc_ar,
    level_en: d.level_en,
    level_ar: d.level_ar,
    duration_en: d.duration_en,
    duration_ar: d.duration_ar,
    lessons: d.lessons,
    tag_en: d.tag_en,
    tag_ar: d.tag_ar,
    image_url: d.image_url,
    visible: d.visible,
    sort_order: d.sort_order,
  };
}

const pricingPlanInput = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().min(1).max(200),
  name_ar: z.string().min(1).max(200),
  price: z.string().max(50).optional().or(z.literal("")).default(""),
  features_en: z.array(z.string().max(500)).default([]),
  features_ar: z.array(z.string().max(500)).default([]),
  popular: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
});

function cleanPricingPlan(d: z.infer<typeof pricingPlanInput>) {
  return {
    name_en: d.name_en,
    name_ar: d.name_ar,
    price: d.price,
    features_en: d.features_en,
    features_ar: d.features_ar,
    popular: d.popular,
    visible: d.visible,
    sort_order: d.sort_order,
  };
}

/** Public catalog content (no auth): visible courses and pricing plans. */
export const getCatalogFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = supabase();
  const [coursesRes, plansRes] = await Promise.all([
    db.from("courses").select("*").eq("visible", true).order("sort_order", { ascending: true }),
    db
      .from("pricing_plans")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true }),
  ]);
  if (coursesRes.error) throw new Error(coursesRes.error.message);
  if (plansRes.error) throw new Error(plansRes.error.message);
  const content: CatalogContent = {
    courses: (coursesRes.data ?? []) as Course[],
    pricingPlans: (plansRes.data ?? []) as PricingPlan[],
  };
  return content;
});

/** Admin: full course list including hidden ones. */
export const listCoursesFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("courses")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Course[];
});

/** Admin: create or update a course. */
export const upsertCourseFn = createServerFn({ method: "POST" })
  .validator(courseInput)
  .handler(async ({ data }) => {
    requireAdmin();
    if (data.id) {
      const { data: updated, error } = await supabase()
        .from("courses")
        .update({ ...cleanCourse(data), updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as Course;
    }
    const { data: created, error } = await supabase()
      .from("courses")
      .insert(cleanCourse(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created as Course;
  });

/** Admin: delete a course. */
export const deleteCourseFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

/** Admin: full pricing plan list including hidden ones. */
export const listPricingPlansFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("pricing_plans")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PricingPlan[];
});

/** Admin: create or update a pricing plan. */
export const upsertPricingPlanFn = createServerFn({ method: "POST" })
  .validator(pricingPlanInput)
  .handler(async ({ data }) => {
    requireAdmin();
    if (data.id) {
      const { data: updated, error } = await supabase()
        .from("pricing_plans")
        .update({ ...cleanPricingPlan(data), updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as PricingPlan;
    }
    const { data: created, error } = await supabase()
      .from("pricing_plans")
      .insert(cleanPricingPlan(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created as PricingPlan;
  });

/** Admin: delete a pricing plan. */
export const deletePricingPlanFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("pricing_plans").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

/* ------------------------------ FAQ (CMS) ------------------------------ */

export interface FaqItem {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

const faqInput = z.object({
  id: z.string().uuid().optional(),
  question_en: z.string().min(1).max(500),
  question_ar: z.string().min(1).max(500),
  answer_en: z.string().max(4000).optional().or(z.literal("")).default(""),
  answer_ar: z.string().max(4000).optional().or(z.literal("")).default(""),
  visible: z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
});

function cleanFaq(d: z.infer<typeof faqInput>) {
  return {
    question_en: d.question_en,
    question_ar: d.question_ar,
    answer_en: d.answer_en,
    answer_ar: d.answer_ar,
    visible: d.visible,
    sort_order: d.sort_order,
  };
}

/** Public FAQ items (no auth): visible only, ordered. */
export const getFaqsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase()
    .from("faqs")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as FaqItem[];
});

/** Admin: full FAQ list including hidden ones. */
export const listFaqsFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as FaqItem[];
});

/** Admin: create or update a FAQ item. */
export const upsertFaqFn = createServerFn({ method: "POST" })
  .validator(faqInput)
  .handler(async ({ data }) => {
    requireAdmin();
    if (data.id) {
      const { data: updated, error } = await supabase()
        .from("faqs")
        .update({ ...cleanFaq(data), updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as FaqItem;
    }
    const { data: created, error } = await supabase()
      .from("faqs")
      .insert(cleanFaq(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created as FaqItem;
  });

/** Admin: delete a FAQ item. */
export const deleteFaqFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("faqs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });

/* ---------------------------- Policies (CMS) ---------------------------- */

export interface Policy {
  id: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

const policyInput = z.object({
  id: z.string().uuid().optional(),
  title_en: z.string().min(1).max(300),
  title_ar: z.string().min(1).max(300),
  desc_en: z.string().max(4000).optional().or(z.literal("")).default(""),
  desc_ar: z.string().max(4000).optional().or(z.literal("")).default(""),
  visible: z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().min(-1000).max(1000).default(0),
});

function cleanPolicy(d: z.infer<typeof policyInput>) {
  return {
    title_en: d.title_en,
    title_ar: d.title_ar,
    desc_en: d.desc_en,
    desc_ar: d.desc_ar,
    visible: d.visible,
    sort_order: d.sort_order,
  };
}

/** Public policies (no auth): visible only, ordered. */
export const getPoliciesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase()
    .from("policies")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Policy[];
});

/** Admin: full policy list including hidden ones. */
export const listPoliciesFn = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { data, error } = await supabase()
    .from("policies")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Policy[];
});

/** Admin: create or update a policy. */
export const upsertPolicyFn = createServerFn({ method: "POST" })
  .validator(policyInput)
  .handler(async ({ data }) => {
    requireAdmin();
    if (data.id) {
      const { data: updated, error } = await supabase()
        .from("policies")
        .update({ ...cleanPolicy(data), updated_at: new Date().toISOString() })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated as Policy;
    }
    const { data: created, error } = await supabase()
      .from("policies")
      .insert(cleanPolicy(data))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created as Policy;
  });

/** Admin: delete a policy. */
export const deletePolicyFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    requireAdmin();
    const { error } = await supabase().from("policies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });
