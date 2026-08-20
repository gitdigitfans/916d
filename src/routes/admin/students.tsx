import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  createStudentFn,
  deleteStudentFn,
  listStudentsFn,
  updateStudentFn,
  type Student,
} from "@/lib/admin-server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/admin/students")({ component: StudentsPage });

const PROGRAMS = ["Quran", "Tajweed", "Islamic Studies", "Arabic Language", "Kids Program"];
const STATUSES = ["active", "paused", "inactive"];

interface FormState {
  name: string;
  email: string;
  phone: string;
  country: string;
  program: string;
  level: string;
  status: string;
  notes: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  country: "",
  program: "",
  level: "",
  status: "active",
  notes: "",
};

function StudentsPage() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Student | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      setStudents(await listStudentsFn());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load students");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(s: Student) {
    if (!window.confirm(`Delete student "${s.name}"?`)) return;
    try {
      await deleteStudentFn({ data: { id: s.id } });
      toast.success("Student deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const filtered = (students ?? []).filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [s.name, s.email, s.phone, s.country, s.program].some((v) => v?.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-muted-foreground">
            {students ? `${students.length} registered` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-48 pl-9"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {students === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No students found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">{s.email || "—"}</div>
                      <div className="text-xs text-muted-foreground">{s.phone || "—"}</div>
                    </TableCell>
                    <TableCell>{s.program || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "active" ? "default" : "outline"}>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(s)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(s)} aria-label="Delete">
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
        <StudentDialog
          title="Add student"
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            try {
              await createStudentFn({ data: input });
              toast.success("Student added");
              setCreating(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editing && (
        <StudentDialog
          title="Edit student"
          student={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await updateStudentFn({ data: { id: editing.id, input } });
              toast.success("Student updated");
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

function StudentDialog({
  title,
  student,
  onClose,
  onSave,
}: {
  title: string;
  student?: Student;
  onClose: () => void;
  onSave: (input: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>({
    name: student?.name ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    country: student?.country ?? "",
    program: student?.program ?? "",
    level: student?.level ?? "",
    status: student?.status ?? "active",
    notes: student?.notes ?? "",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
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
            <DialogDescription>Student contact and program details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">Name *</Label>
              <Input id="s-name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-status">Status</Label>
              <select
                id="s-status"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-email">Email</Label>
              <Input id="s-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-phone">Phone</Label>
              <Input id="s-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-country">Country</Label>
              <Input id="s-country" value={form.country} onChange={(e) => set("country", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-level">Level</Label>
              <Input id="s-level" value={form.level} onChange={(e) => set("level", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="s-program">Program</Label>
              <select
                id="s-program"
                value={form.program}
                onChange={(e) => set("program", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">— None —</option>
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="s-notes">Notes</Label>
              <textarea
                id="s-notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
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
