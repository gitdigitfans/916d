import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  createLessonFn,
  deleteLessonFn,
  listLessonsFn,
  listStudentsFn,
  updateLessonFn,
  type Lesson,
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
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/lessons")({ component: LessonsPage });

const STATUSES = ["scheduled", "done", "cancelled"];

interface FormState {
  student_id: string;
  student_name: string;
  teacher: string;
  topic: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  notes: string;
}

const emptyForm: FormState = {
  student_id: "",
  student_name: "",
  teacher: "",
  topic: "",
  scheduled_at: "",
  duration_minutes: 30,
  status: "scheduled",
  notes: "",
};

function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      const [ls, ss] = await Promise.all([listLessonsFn(), listStudentsFn()]);
      setLessons(ls);
      setStudents(ss);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load lessons");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(l: Lesson) {
    if (!window.confirm(`Delete lesson for "${l.student_name || l.student_id}"?`)) return;
    try {
      await deleteLessonFn({ data: { id: l.id } });
      toast.success("Lesson deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const sorted = [...(lessons ?? [])].sort((a, b) => {
    const ta = a.scheduled_at ? new Date(a.scheduled_at).getTime() : 0;
    const tb = b.scheduled_at ? new Date(b.scheduled_at).getTime() : 0;
    return tb - ta;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Lessons</h1>
          <p className="text-sm text-muted-foreground">{lessons ? `${lessons.length} total` : "Loading…"}</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {lessons === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : sorted.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No lessons yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.student_name || l.student_id || "—"}</TableCell>
                    <TableCell>{l.teacher || "—"}</TableCell>
                    <TableCell>{l.topic || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {l.scheduled_at ? new Date(l.scheduled_at).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>{l.duration_minutes} min</TableCell>
                    <TableCell>
                      <Badge variant={l.status === "done" ? "default" : l.status === "cancelled" ? "destructive" : "outline"}>
                        {l.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(l)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(l)} aria-label="Delete">
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
        <LessonDialog
          title="Add lesson"
          students={students}
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            try {
              await createLessonFn({ data: input });
              toast.success("Lesson added");
              setCreating(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editing && (
        <LessonDialog
          title="Edit lesson"
          students={students}
          lesson={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await updateLessonFn({ data: { id: editing.id, input } });
              toast.success("Lesson updated");
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

function LessonDialog({
  title,
  lesson,
  students,
  onClose,
  onSave,
}: {
  title: string;
  lesson?: Lesson;
  students: Student[];
  onClose: () => void;
  onSave: (input: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>({
    student_id: lesson?.student_id ?? "",
    student_name: lesson?.student_name ?? "",
    teacher: lesson?.teacher ?? "",
    topic: lesson?.topic ?? "",
    scheduled_at: lesson?.scheduled_at ? toLocalInput(lesson.scheduled_at) : "",
    duration_minutes: lesson?.duration_minutes ?? 30,
    status: lesson?.status ?? "scheduled",
    notes: lesson?.notes ?? "",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function pickStudent(id: string) {
    const s = students.find((x) => x.id === id);
    set("student_id", id);
    if (s) set("student_name", s.name);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
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
            <DialogDescription>Schedule or update a lesson.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="l-student">Student</Label>
              <select
                id="l-student"
                value={form.student_id}
                onChange={(e) => pickStudent(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">— None —</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-name">Student name</Label>
              <Input id="l-name" value={form.student_name} onChange={(e) => set("student_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-teacher">Teacher</Label>
              <Input id="l-teacher" value={form.teacher} onChange={(e) => set("teacher", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-topic">Topic</Label>
              <Input id="l-topic" value={form.topic} onChange={(e) => set("topic", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-duration">Duration (minutes)</Label>
              <Input
                id="l-duration"
                type="number"
                min={5}
                max={600}
                value={form.duration_minutes}
                onChange={(e) => set("duration_minutes", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-when">Scheduled time</Label>
              <Input
                id="l-when"
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => set("scheduled_at", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-status">Status</Label>
              <select
                id="l-status"
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
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="l-notes">Notes</Label>
              <textarea
                id="l-notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
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

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
