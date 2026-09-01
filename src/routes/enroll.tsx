import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { createBookingFn } from "@/lib/admin-server";
import { useLang, whatsappUrl } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/enroll")({
  head: () => ({
    meta: [
      { title: "Enroll — Qumra Academy" },
      { name: "description", content: "Book your child's free Quran trial class at Qumra Academy." },
    ],
  }),
  component: EnrollPage,
});

const CHILD_AGES = ["3-5", "6-8", "9-11", "12-14", "15-17", "18+"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Egypt",
  "Saudi Arabia",
  "UAE",
  "Other",
];
const CLASS_TIMES = ["Morning", "Afternoon", "Evening", "Flexible"];

const PHONE_CODES = [
  { code: "+1", label: "+1 (US/Canada)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+20", label: "+20 (Egypt)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+965", label: "+965 (Kuwait)" },
  { code: "+974", label: "+974 (Qatar)" },
  { code: "+973", label: "+973 (Bahrain)" },
  { code: "+968", label: "+968 (Oman)" },
  { code: "+962", label: "+962 (Jordan)" },
  { code: "+961", label: "+961 (Lebanon)" },
  { code: "+212", label: "+212 (Morocco)" },
  { code: "+213", label: "+213 (Algeria)" },
  { code: "+216", label: "+216 (Tunisia)" },
  { code: "+218", label: "+218 (Libya)" },
  { code: "+249", label: "+249 (Sudan)" },
  { code: "+964", label: "+964 (Iraq)" },
  { code: "+90", label: "+90 (Turkey)" },
  { code: "+92", label: "+92 (Pakistan)" },
  { code: "+91", label: "+91 (India)" },
  { code: "+60", label: "+60 (Malaysia)" },
  { code: "+62", label: "+62 (Indonesia)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+49", label: "+49 (Germany)" },
  { code: "+33", label: "+33 (France)" },
];

function EnrollPage() {
  const { lang } = useLang();
  const t = {
    en: {
      badge: "Free Trial",
      title: "Book Your Child's FREE Quran Trial Class",
      subtitle: "Fill the form and our team will contact you to schedule your first lesson.",
      parentName: "Parent Name",
      parentNamePh: "e.g. Sarah Ahamad",
      childName: "Child Name",
      childNamePh: "e.g. Sarah Ahamad",
      childAge: "Child's Age",
      childAgePh: "Select Child's Age",
      currentLevel: "Current Level",
      currentLevelPh: "Select level",
      tutorGender: "Preferred Tutor Gender",
      tutorGenderPh: "No preference",
      country: "Your Country",
      countryPh: "Select Country Name",
      email: "Email Address",
      emailPh: "you@email.com",
      phone: "Whatsapp Number",
      phonePh: "000 000 0000",
      phoneCode: "Code",
      phoneCodePh: "Code",
      classTime: "Preferred Class Time",
      submit: "Start Free Trial",
      sending: "Sending…",
      successTitle: "Request sent!",
      successDesc: "We'll contact you shortly. You can also message us directly on WhatsApp.",
      whatsapp: "Message us on WhatsApp",
      back: "Back to home",
      noPreference: "No preference",
      male: "Male",
      female: "Female",
    },
    ar: {
      badge: "حصة تجريبية مجانية",
      title: "احجزي حصة تجريبية مجانية لطفلك في القرآن",
      subtitle: "املأ النموذج وسيتواصل معك فريقنا لتحديد موعد أول حصة.",
      parentName: "اسم ولي الأمر",
      parentNamePh: "مثال: سارة أحمد",
      childName: "اسم الطفل",
      childNamePh: "مثال: سارة أحمد",
      childAge: "عمر الطفل",
      childAgePh: "اختر عمر الطفل",
      currentLevel: "المستوى الحالي",
      currentLevelPh: "اختر المستوى",
      tutorGender: "جنس المعلم المفضل",
      tutorGenderPh: "لا تفضيل",
      country: "دولتك",
      countryPh: "اختر اسم الدولة",
      email: "البريد الإلكتروني",
      emailPh: "you@email.com",
      phone: "رقم الواتساب",
      phonePh: "000 000 0000",
      phoneCode: "الكود",
      phoneCodePh: "الكود",
      classTime: "الوقت المفضل للحصة",
      submit: "ابدأ الحصة التجريبية",
      sending: "جارٍ الإرسال…",
      successTitle: "تم إرسال طلبك!",
      successDesc: "سنتواصل معك قريبًا. يمكنك أيضًا مراسلتنا مباشرة على الواتساب.",
      whatsapp: "راسلنا على واتساب",
      back: "العودة للرئيسية",
      noPreference: "لا تفضيل",
      male: "ذكر",
      female: "أنثى",
    },
  }[lang];

  const [form, setForm] = useState({
    parent_name: "",
    child_name: "",
    child_age: "",
    current_level: "",
    tutor_gender: "",
    country: "",
    email: "",
    phone_code: "",
    phone: "",
    class_time: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.parent_name.trim()) {
      toast.error(lang === "ar" ? "اسم ولي الأمر مطلوب" : "Parent name is required");
      return;
    }
    if (!form.child_name.trim()) {
      toast.error(lang === "ar" ? "اسم الطفل مطلوب" : "Child name is required");
      return;
    }
    if (!form.phone_code) {
      toast.error(lang === "ar" ? "كود الدولة مطلوب" : "Country code is required");
      return;
    }
    setBusy(true);
    try {
      await createBookingFn({
        data: {
          name: form.parent_name,
          email: form.email,
          phone: `${form.phone_code} ${form.phone}`.trim(),
          program: "",
          message: "",
          parent_name: form.parent_name,
          child_name: form.child_name,
          child_age: form.child_age,
          current_level: form.current_level,
          tutor_gender: form.tutor_gender,
          country: form.country,
          class_time: form.class_time,
        },
      });
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
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
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
          <div className="space-y-1.5">
            <Label htmlFor="en-parent-name">{t.parentName} *</Label>
            <Input
              id="en-parent-name"
              value={form.parent_name}
              onChange={(e) => set("parent_name", e.target.value)}
              placeholder={t.parentNamePh}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="en-child-name">{t.childName} *</Label>
            <Input
              id="en-child-name"
              value={form.child_name}
              onChange={(e) => set("child_name", e.target.value)}
              placeholder={t.childNamePh}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.childAge} *</Label>
            <Select value={form.child_age} onValueChange={(v) => set("child_age", v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.childAgePh} />
              </SelectTrigger>
              <SelectContent>
                {CHILD_AGES.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.currentLevel} *</Label>
            <Select value={form.current_level} onValueChange={(v) => set("current_level", v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.currentLevelPh} />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{t.tutorGender} *</Label>
            <Select value={form.tutor_gender} onValueChange={(v) => set("tutor_gender", v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.noPreference} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No preference">{t.noPreference}</SelectItem>
                <SelectItem value="Male">{t.male}</SelectItem>
                <SelectItem value="Female">{t.female}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t.country} *</Label>
            <Select value={form.country} onValueChange={(v) => set("country", v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.countryPh} />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="en-email">{t.email} *</Label>
            <Input
              id="en-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder={t.emailPh}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="en-phone">{t.phone} *</Label>
            <div className="flex gap-2">
              <Select value={form.phone_code} onValueChange={(v) => set("phone_code", v)}>
                <SelectTrigger className="w-28 shrink-0">
                  <SelectValue placeholder={t.phoneCodePh} />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="en-phone"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder={t.phonePh}
                required
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>{t.classTime} *</Label>
            <div className="flex flex-wrap gap-4">
              {CLASS_TIMES.map((time) => (
                <label key={time} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="class_time"
                    value={time}
                    checked={form.class_time === time}
                    onChange={(e) => set("class_time", e.target.value)}
                    required
                    className="h-4 w-4 accent-primary"
                  />
                  {time}
                </label>
              ))}
            </div>
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
