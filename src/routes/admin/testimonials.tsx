import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  deleteTestimonialFn,
  listTestimonialsFn,
  upsertTestimonialFn,
  type Testimonial,
} from "@/lib/admin-server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImageField, VideoField } from "@/components/admin/UploadFields";
import { Pencil, Play, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/testimonials")({ component: TestimonialsPage });

function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  async function load() {
    try {
      setItems(await listTestimonialsFn());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load testimonials");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(t: Testimonial) {
    if (!window.confirm(`Delete this testimonial?`)) return;
    try {
      await deleteTestimonialFn({ data: { id: t.id } });
      toast.success("Testimonial deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-sm text-muted-foreground">
            Student opinions on the homepage — quotes, photos and videos.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Add testimonial
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {items === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No testimonials yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      {t.video_url ? (
                        <span className="inline-flex h-10 w-14 items-center justify-center rounded-md border border-border bg-primary/10 text-primary">
                          <Play className="h-4 w-4" />
                        </span>
                      ) : t.image_url ? (
                        <img src={t.image_url} alt="" className="h-10 w-14 rounded-md border border-border object-cover" />
                      ) : (
                        <span className="flex h-10 w-14 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                          <QuoteIcon />
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-2 text-sm">{t.text_en || t.text_ar || "—"}</p>
                    </TableCell>
                    <TableCell className="text-sm">{t.name_en || t.name_ar || "—"}</TableCell>
                    <TableCell>
                      {t.visible ? <Badge>Visible</Badge> : <Badge variant="outline">Hidden</Badge>}
                    </TableCell>
                    <TableCell>{t.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(t)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(t)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {creating && (
        <TestimonialDialog
          title="Add testimonial"
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            try {
              await upsertTestimonialFn({ data: { ...input, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Testimonial added");
              setCreating(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editing && (
        <TestimonialDialog
          title="Edit testimonial"
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await upsertTestimonialFn({ data: { ...input, id: editing.id, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Testimonial updated");
              setEditing(null);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}
    </div>
  );
}

interface FormState {
  name_en: string;
  name_ar: string;
  text_en: string;
  text_ar: string;
  image_url: string;
  video_url: string;
  visible: boolean;
  sort_order: string;
}

function TestimonialDialog({
  title,
  item,
  onClose,
  onSave,
}: {
  title: string;
  item?: Testimonial;
  onClose: () => void;
  onSave: (input: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>({
    name_en: item?.name_en ?? "",
    name_ar: item?.name_ar ?? "",
    text_en: item?.text_en ?? "",
    text_ar: item?.text_ar ?? "",
    image_url: item?.image_url ?? "",
    video_url: item?.video_url ?? "",
    visible: item?.visible ?? true,
    sort_order: item ? String(item.sort_order) : "0",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.text_en.trim() && !form.text_ar.trim() && !form.video_url.trim()) {
      toast.error("Add a quote or a video");
      return;
    }
    setBusy(true);
    try {
      await onSave(form);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Quote text (EN/AR), optional photo and optional video. Showing on homepage when visible.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="t-text-en">Quote (English)</Label>
              <textarea
                id="t-text-en"
                value={form.text_en}
                onChange={(e) => set("text_en", e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-text-ar">Quote (Arabic)</Label>
              <textarea
                id="t-text-ar"
                value={form.text_ar}
                onChange={(e) => set("text_ar", e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-name-en">Author (English)</Label>
              <Input id="t-name-en" value={form.name_en} onChange={(e) => set("name_en", e.target.value)} placeholder="Parent · UK" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-name-ar">Author (Arabic)</Label>
              <Input id="t-name-ar" value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} placeholder="ولي أمر · المملكة المتحدة" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <ImageField value={form.image_url} onChange={(v) => set("image_url", v)} label="Photo (optional)" hint="Student photo or any image shown with the quote." />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <VideoField value={form.video_url} onChange={(v) => set("video_url", v)} label="Video (optional)" hint="Upload a clip or paste an mp4 / webm / YouTube link. If set, it replaces the photo." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-order">Order</Label>
              <Input id="t-order" type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => set("visible", e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Show on homepage
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function QuoteIcon() {
  return <span className="text-muted-foreground">&quot;&quot;</span>;
}
