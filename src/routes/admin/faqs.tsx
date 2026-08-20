import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { deleteFaqFn, listFaqsFn, upsertFaqFn, type FaqItem } from "@/lib/admin-server";
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
import { HelpCircle, Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/faqs")({ component: FaqsPage });

function FaqsPage() {
  const [items, setItems] = useState<FaqItem[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);

  async function load() {
    try {
      setItems(await listFaqsFn());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load FAQs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(f: FaqItem) {
    if (!window.confirm(`Delete FAQ "${f.question_en}"?`)) return;
    try {
      await deleteFaqFn({ data: { id: f.id } });
      toast.success("FAQ deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">FAQ</h1>
          <p className="text-sm text-muted-foreground">
            Questions and answers shown on the FAQ page — in English and Arabic.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Add question
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No FAQs yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question (EN)</TableHead>
                  <TableHead>Question (AR)</TableHead>
                  <TableHead>Answer (EN)</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="max-w-[240px]">
                      <span className="inline-flex items-start gap-2 font-medium">
                        <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f.question_en}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px]">{f.question_ar}</TableCell>
                    <TableCell className="max-w-[260px] text-muted-foreground">{f.answer_en}</TableCell>
                    <TableCell>
                      {f.visible ? <Badge>Visible</Badge> : <Badge variant="outline">Hidden</Badge>}
                    </TableCell>
                    <TableCell>{f.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(f)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(f)} aria-label="Delete">
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
        <FaqDialog
          title="Add question"
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            try {
              await upsertFaqFn({ data: { ...input, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Question added");
              setCreating(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editing && (
        <FaqDialog
          title="Edit question"
          faq={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await upsertFaqFn({ data: { ...input, id: editing.id, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Question updated");
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

const textareaCls =
  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

interface FaqForm {
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  visible: boolean;
  sort_order: string;
}

function FaqDialog({
  title,
  faq,
  onClose,
  onSave,
}: {
  title: string;
  faq?: FaqItem;
  onClose: () => void;
  onSave: (input: FaqForm) => Promise<void>;
}) {
  const [form, setForm] = useState<FaqForm>({
    question_en: faq?.question_en ?? "",
    question_ar: faq?.question_ar ?? "",
    answer_en: faq?.answer_en ?? "",
    answer_ar: faq?.answer_ar ?? "",
    visible: faq?.visible ?? true,
    sort_order: faq ? String(faq.sort_order) : "0",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FaqForm>(k: K, v: FaqForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.question_en.trim() || !form.question_ar.trim()) {
      toast.error("Question is required in both languages");
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
            <DialogDescription>Question and answer in English and Arabic.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-q-en">Question (English) *</Label>
              <Input id="f-q-en" value={form.question_en} onChange={(e) => set("question_en", e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-q-ar">Question (Arabic) *</Label>
              <Input id="f-q-ar" value={form.question_ar} onChange={(e) => set("question_ar", e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-a-en">Answer (English)</Label>
              <textarea id="f-a-en" value={form.answer_en} onChange={(e) => set("answer_en", e.target.value)} rows={3} className={textareaCls} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-a-ar">Answer (Arabic)</Label>
              <textarea id="f-a-ar" value={form.answer_ar} onChange={(e) => set("answer_ar", e.target.value)} rows={3} className={textareaCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-order">Order</Label>
              <Input id="f-order" type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => set("visible", e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Visible on site
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
