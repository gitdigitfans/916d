import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { deletePolicyFn, listPoliciesFn, upsertPolicyFn, type Policy } from "@/lib/admin-server";
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
import { Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/policies")({ component: PoliciesPage });

function PoliciesPage() {
  const [items, setItems] = useState<Policy[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Policy | null>(null);

  async function load() {
    try {
      setItems(await listPoliciesFn());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load policies");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(p: Policy) {
    if (!window.confirm(`Delete policy "${p.title_en}"?`)) return;
    try {
      await deletePolicyFn({ data: { id: p.id } });
      toast.success("Policy deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Policies</h1>
          <p className="text-sm text-muted-foreground">
            Academy policies shown on the Policies page — in English and Arabic.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Add policy
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Academy Policies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No policies yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title (EN)</TableHead>
                  <TableHead>Title (AR)</TableHead>
                  <TableHead>Description (EN)</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[200px]">
                      <span className="inline-flex items-start gap-2 font-medium">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p.title_en}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[160px]">{p.title_ar}</TableCell>
                    <TableCell className="max-w-[280px] text-muted-foreground">{p.desc_en}</TableCell>
                    <TableCell>
                      {p.visible ? <Badge>Visible</Badge> : <Badge variant="outline">Hidden</Badge>}
                    </TableCell>
                    <TableCell>{p.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(p)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(p)} aria-label="Delete">
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
        <PolicyDialog
          title="Add policy"
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            try {
              await upsertPolicyFn({ data: { ...input, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Policy added");
              setCreating(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editing && (
        <PolicyDialog
          title="Edit policy"
          policy={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await upsertPolicyFn({ data: { ...input, id: editing.id, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Policy updated");
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

interface PolicyForm {
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  visible: boolean;
  sort_order: string;
}

function PolicyDialog({
  title,
  policy,
  onClose,
  onSave,
}: {
  title: string;
  policy?: Policy;
  onClose: () => void;
  onSave: (input: PolicyForm) => Promise<void>;
}) {
  const [form, setForm] = useState<PolicyForm>({
    title_en: policy?.title_en ?? "",
    title_ar: policy?.title_ar ?? "",
    desc_en: policy?.desc_en ?? "",
    desc_ar: policy?.desc_ar ?? "",
    visible: policy?.visible ?? true,
    sort_order: policy ? String(policy.sort_order) : "0",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof PolicyForm>(k: K, v: PolicyForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.title_en.trim() || !form.title_ar.trim()) {
      toast.error("Title is required in both languages");
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
            <DialogDescription>Policy title and description in English and Arabic.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="po-t-en">Title (English) *</Label>
              <Input id="po-t-en" value={form.title_en} onChange={(e) => set("title_en", e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="po-t-ar">Title (Arabic) *</Label>
              <Input id="po-t-ar" value={form.title_ar} onChange={(e) => set("title_ar", e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="po-d-en">Description (English)</Label>
              <textarea id="po-d-en" value={form.desc_en} onChange={(e) => set("desc_en", e.target.value)} rows={3} className={textareaCls} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="po-d-ar">Description (Arabic)</Label>
              <textarea id="po-d-ar" value={form.desc_ar} onChange={(e) => set("desc_ar", e.target.value)} rows={3} className={textareaCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="po-order">Order</Label>
              <Input id="po-order" type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
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
