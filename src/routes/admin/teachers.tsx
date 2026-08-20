import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { deleteTeacherFn, listTeachersFn, upsertTeacherFn, type Teacher } from "@/lib/admin-server";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageField } from "@/components/admin/UploadFields";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/teachers")({ component: TeachersPage });

function TeachersPage() {
  const [items, setItems] = useState<Teacher[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);

  async function load() {
    try {
      setItems(await listTeachersFn());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load teachers");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(t: Teacher) {
    if (!window.confirm(`Delete "${t.name_en || t.name_ar}"?`)) return;
    try {
      await deleteTeacherFn({ data: { id: t.id } });
      toast.success("Teacher deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-sm text-muted-foreground">
            Instructor cards shown on the homepage and the teachers page — photo, name and bio.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Add teacher
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {items === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No teachers yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      {t.image_url ? (
                        <img
                          src={t.image_url}
                          alt=""
                          className="h-12 w-9 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <span className="flex h-12 w-9 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{t.name_en || t.name_ar || "—"}</TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">
                      <p className="line-clamp-2">{t.role_en || t.role_ar || "—"}</p>
                    </TableCell>
                    <TableCell>
                      {t.visible ? <Badge>Visible</Badge> : <Badge variant="outline">Hidden</Badge>}
                    </TableCell>
                    <TableCell>{t.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditing(t)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(t)}
                          aria-label="Delete"
                        >
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
        <TeacherDialog
          title="Add teacher"
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            try {
              await upsertTeacherFn({
                data: { ...input, sort_order: Number(input.sort_order) || 0 },
              });
              toast.success("Teacher added");
              setCreating(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editing && (
        <TeacherDialog
          title="Edit teacher"
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await upsertTeacherFn({
                data: { ...input, id: editing.id, sort_order: Number(input.sort_order) || 0 },
              });
              toast.success("Teacher updated");
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
  role_en: string;
  role_ar: string;
  spec_en: string;
  spec_ar: string;
  bio_en: string;
  bio_ar: string;
  image_url: string;
  visible: boolean;
  sort_order: string;
}

function TeacherDialog({
  title,
  item,
  onClose,
  onSave,
}: {
  title: string;
  item?: Teacher;
  onClose: () => void;
  onSave: (input: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>({
    name_en: item?.name_en ?? "",
    name_ar: item?.name_ar ?? "",
    role_en: item?.role_en ?? "",
    role_ar: item?.role_ar ?? "",
    spec_en: item?.spec_en ?? "",
    spec_ar: item?.spec_ar ?? "",
    bio_en: item?.bio_en ?? "",
    bio_ar: item?.bio_ar ?? "",
    image_url: item?.image_url ?? "",
    visible: item?.visible ?? true,
    sort_order: item ? String(item.sort_order) : "0",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name_en.trim() && !form.name_ar.trim()) {
      toast.error("Add a name (English or Arabic)");
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
              Photo plus bilingual name, role, specialty and bio. Shown on the homepage and teachers
              page.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tc-name-en">Name (English)</Label>
              <Input
                id="tc-name-en"
                value={form.name_en}
                onChange={(e) => set("name_en", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-name-ar">Name (Arabic)</Label>
              <Input
                id="tc-name-ar"
                value={form.name_ar}
                onChange={(e) => set("name_ar", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-role-en">Role (English)</Label>
              <Input
                id="tc-role-en"
                value={form.role_en}
                onChange={(e) => set("role_en", e.target.value)}
                placeholder="Senior Quran & Arabic Instructor"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-role-ar">Role (Arabic)</Label>
              <Input
                id="tc-role-ar"
                value={form.role_ar}
                onChange={(e) => set("role_ar", e.target.value)}
                placeholder="معلم قرآن ولغة عربية أول"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-spec-en">Specialty (English)</Label>
              <Input
                id="tc-spec-en"
                value={form.spec_en}
                onChange={(e) => set("spec_en", e.target.value)}
                placeholder="Ijazah"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-spec-ar">Specialty (Arabic)</Label>
              <Input
                id="tc-spec-ar"
                value={form.spec_ar}
                onChange={(e) => set("spec_ar", e.target.value)}
                placeholder="الإجازة"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-bio-en">Bio (English)</Label>
              <textarea
                id="tc-bio-en"
                value={form.bio_en}
                onChange={(e) => set("bio_en", e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-bio-ar">Bio (Arabic)</Label>
              <textarea
                id="tc-bio-ar"
                value={form.bio_ar}
                onChange={(e) => set("bio_ar", e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <ImageField
                value={form.image_url}
                onChange={(v) => set("image_url", v)}
                label="Photo"
                hint="Upload a teacher photo or paste an image link."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tc-order">Order</Label>
              <Input
                id="tc-order"
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", e.target.value)}
              />
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => set("visible", e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Show on site
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
