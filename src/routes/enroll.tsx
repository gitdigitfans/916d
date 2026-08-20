import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { createBookingFn } from "@/lib/admin-server";
import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/enroll")({
  head: () => ({
    meta: [
      { title: "Enroll — Qumra Academy" },
      { name: "description", content: "Book a free trial or enroll in Qumra Academy programs." },
    ],
  }),
  component: EnrollPage,
});

const PROGRAMS = ["Quran", "Tajweed", "Islamic Studies", "Arabic Language", "Kids Program"];

function EnrollPage() {
  const { lang } = useLang();
  const t = {
    en: {
      badge: "Free Trial",
      title: "Book your free trial",
      subtitle: "Fill the form and our team will contact you to schedule your first lesson.",
      name: "Full name",
      namePh: "Your name",
      email: "Email",
      phone: "WhatsApp number",
      program: "Program",
      programPh: "Select a program",
      message: "Message (optional)",
      messagePh: "Tell us about the student, age, and goals…",
      submit: "Send request",
      sending: "Sending…",
      successTitle: "Request sent!",
      successDesc: "We'll contact you shortly. You can also message us directly on WhatsApp.",
      whatsapp: "Message us on WhatsApp",
      back: "Back to home",
    },
    ar: {
      badge: "حصة تجريبية مجانية",
      title: "احجز حصتك التجريبية المجانية",
      subtitle: "املأ النموذج وسيتواصل معك فريقنا لتحديد موعد أول حصة.",
      name: "الاسم الكامل",
      namePh: "اسمك",
      email: "البريد الإلكتروني",
      phone: "رقم الواتساب",
      program: "البرنامج",
      programPh: "اختر البرنامج",
      message: "رسالة (اختياري)",
      messagePh: "أخبرنا عن الطالب وعمره وأهدافه…",
      submit: "إرسال الطلب",
      sending: "جارٍ الإرسال…",
      successTitle: "تم إرسال طلبك!",
      successDesc: "سنتواصل معك قريبًا. يمكنك أيضًا مراسلتنا مباشرة على الواتساب.",
      whatsapp: "راسلنا على واتساب",
      back: "العودة للرئيسية",
    },
  }[lang];

  const [form, setForm] = useState({ name: "", email: "", phone: "", program: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error(lang === "ar" ? "الاسم مطلوب" : "Name is required");
      return;
    }
    setBusy(true);
    try {
      await createBookingFn({ data: form });
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : lang === "ar" ? "حدث خطأ" : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">{t.successTitle}</h1>
        <p className="mt-3 text-muted-foreground">{t.successDesc}</p>
        <a
          href={whatsappUrl(lang === "ar" ? "السلام عليكم، أرسلت طلب حجز حصة تجريبية." : "Hello, I've sent a free trial booking request.")}
          target="_blank"
          rel="noopener noreferrer"
          className="glow-primary mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" /> {t.whatsapp}
        </a>
        <Link to="/" className="mt-4 text-sm font-semibold text-primary hover:underline">
          {t.back}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
          {t.badge}
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{t.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.subtitle}</p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-3xl border border-border bg-surface/40 p-6 shadow-xl sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="en-name">{t.name} *</Label>
            <Input id="en-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t.namePh} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="en-email">{t.email}</Label>
            <Input id="en-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="en-phone">{t.phone}</Label>
            <Input id="en-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="en-program">{t.program}</Label>
            <select
              id="en-program"
              value={form.program}
              onChange={(e) => set("program", e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">{t.programPh}</option>
              {PROGRAMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="en-message">{t.message}</Label>
            <textarea
              id="en-message"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder={t.messagePh}
              rows={4}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={busy}>
          {busy ? t.sending : t.submit}
        </Button>
      </form>
      <Toaster position="top-center" />
    </section>
  );
}
