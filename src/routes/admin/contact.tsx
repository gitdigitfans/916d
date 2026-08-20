import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { getContactInfoFn, updateContactInfoFn } from "@/lib/admin-server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/contact")({ component: ContactPage });

interface FormState {
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
}

const empty: FormState = {
  whatsapp_number: "",
  whatsapp_display: "",
  email_info: "",
  email_support: "",
  address: "",
  facebook: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  tiktok: "",
  twitter: "",
};

function ContactPage() {
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const info = await getContactInfoFn();
      setForm(info ? { ...empty, ...info } : empty);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load contact info");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    try {
      await updateContactInfoFn({ data: form });
      toast.success("Contact info saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const sections: {
    title: string;
    desc: string;
    fields: { key: keyof FormState; label: string; placeholder: string }[];
  }[] = [
    {
      title: "WhatsApp",
      desc: "Used for the WhatsApp buttons all over the site (header, hero, floating bubble, courses…).",
      fields: [
        {
          key: "whatsapp_number",
          label: "Number (international, digits only)",
          placeholder: "201011956363",
        },
        { key: "whatsapp_display", label: "Display text", placeholder: "+20 101 195 6363" },
      ],
    },
    {
      title: "Emails",
      desc: "Shown on the contact page and in the footer.",
      fields: [
        { key: "email_info", label: "Info email", placeholder: "info@qumraacademy.com" },
        { key: "email_support", label: "Support email", placeholder: "support@qumraacademy.com" },
      ],
    },
    {
      title: "Address",
      desc: "Shown on the contact page.",
      fields: [
        { key: "address", label: "Address", placeholder: "30 N Gould St, STE 4257, Sheridan, United States" },
      ],
    },
    {
      title: "Social Media",
      desc: "Links shown as icons in the footer. Leave empty to hide an icon.",
      fields: [
        { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/qumra" },
        { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/qumra" },
        { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@qumra" },
        { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/qumra" },
        { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@qumra" },
        { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/qumra" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Info</h1>
        <p className="text-sm text-muted-foreground">
          WhatsApp number, emails and social media links used across the site.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-base">{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {s.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={`ct-${f.key}`}>{f.label}</Label>
                  <Input
                    id={`ct-${f.key}`}
                    value={form?.[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" disabled={busy || form === null}>
            <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
