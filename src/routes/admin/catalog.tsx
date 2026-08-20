import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  deleteCourseFn,
  deletePricingPlanFn,
  listCoursesFn,
  listPricingPlansFn,
  upsertCourseFn,
  upsertPricingPlanFn,
  type Course,
  type PricingPlan,
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
import { ImageField } from "@/components/admin/UploadFields";
import { CreditCard, ImageIcon, Pencil, Plus, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/catalog")({ component: CatalogPage });

function CatalogPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  async function load() {
    try {
      const [cs, ps] = await Promise.all([listCoursesFn(), listPricingPlansFn()]);
      setCourses(cs);
      setPlans(ps);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load catalog");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function removeCourse(c: Course) {
    if (!window.confirm(`Delete course "${c.name_en}"?`)) return;
    try {
      await deleteCourseFn({ data: { id: c.id } });
      toast.success("Course deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function removePlan(p: PricingPlan) {
    if (!window.confirm(`Delete plan "${p.name_en}"?`)) return;
    try {
      await deletePricingPlanFn({ data: { id: p.id } });
      toast.success("Plan deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Courses & Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Manage course details, packages and prices shown on the Programs and Pricing pages.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Courses</CardTitle>
          <Button size="sm" onClick={() => setCreatingCourse(true)}>
            <Plus className="h-3.5 w-3.5" /> Add course
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {courses === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : courses.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No courses yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (AR)</TableHead>
                  <TableHead>Level (EN)</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      {c.image_url ? (
                        <img src={c.image_url} alt="" className="h-10 w-14 rounded-md border border-border object-cover" />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{c.name_en}</TableCell>
                    <TableCell>{c.name_ar}</TableCell>
                    <TableCell>{c.level_en}</TableCell>
                    <TableCell>{c.lessons}</TableCell>
                    <TableCell>
                      {c.visible ? <Badge>Visible</Badge> : <Badge variant="outline">Hidden</Badge>}
                    </TableCell>
                    <TableCell>{c.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditingCourse(c)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => removeCourse(c)} aria-label="Delete">
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Pricing Plans</CardTitle>
          <Button size="sm" onClick={() => setCreatingPlan(true)}>
            <Plus className="h-3.5 w-3.5" /> Add plan
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {plans === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : plans.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No pricing plans yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (AR)</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Popular</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" /> {p.name_en}
                      </span>
                    </TableCell>
                    <TableCell>{p.name_ar}</TableCell>
                    <TableCell className="font-semibold">{p.price}</TableCell>
                    <TableCell>
                      {p.popular ? <Badge>Popular</Badge> : <Badge variant="outline">—</Badge>}
                    </TableCell>
                    <TableCell>
                      {p.visible ? <Badge>Visible</Badge> : <Badge variant="outline">Hidden</Badge>}
                    </TableCell>
                    <TableCell>{p.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditingPlan(p)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => removePlan(p)} aria-label="Delete">
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

      {creatingCourse && (
        <CourseDialog
          title="Add course"
          onClose={() => setCreatingCourse(false)}
          onSave={async (input) => {
            try {
              await upsertCourseFn({ data: { ...input, lessons: Number(input.lessons) || 0, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Course added");
              setCreatingCourse(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editingCourse && (
        <CourseDialog
          title="Edit course"
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={async (input) => {
            try {
              await upsertCourseFn({ data: { ...input, id: editingCourse.id, lessons: Number(input.lessons) || 0, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Course updated");
              setEditingCourse(null);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {creatingPlan && (
        <PlanDialog
          title="Add plan"
          onClose={() => setCreatingPlan(false)}
          onSave={async (input) => {
            try {
              await upsertPricingPlanFn({ data: { ...input, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Plan added");
              setCreatingPlan(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editingPlan && (
        <PlanDialog
          title="Edit plan"
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSave={async (input) => {
            try {
              await upsertPricingPlanFn({ data: { ...input, id: editingPlan.id, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Plan updated");
              setEditingPlan(null);
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

interface CourseForm {
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  level_en: string;
  level_ar: string;
  duration_en: string;
  duration_ar: string;
  lessons: string;
  tag_en: string;
  tag_ar: string;
  image_url: string;
  visible: boolean;
  sort_order: string;
}

function CourseDialog({
  title,
  course,
  onClose,
  onSave,
}: {
  title: string;
  course?: Course;
  onClose: () => void;
  onSave: (input: CourseForm) => Promise<void>;
}) {
  const [form, setForm] = useState<CourseForm>({
    name_en: course?.name_en ?? "",
    name_ar: course?.name_ar ?? "",
    desc_en: course?.desc_en ?? "",
    desc_ar: course?.desc_ar ?? "",
    level_en: course?.level_en ?? "",
    level_ar: course?.level_ar ?? "",
    duration_en: course?.duration_en ?? "",
    duration_ar: course?.duration_ar ?? "",
    lessons: course ? String(course.lessons) : "0",
    tag_en: course?.tag_en ?? "",
    tag_ar: course?.tag_ar ?? "",
    image_url: course?.image_url ?? "",
    visible: course?.visible ?? true,
    sort_order: course ? String(course.sort_order) : "0",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof CourseForm>(k: K, v: CourseForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name_en.trim() || !form.name_ar.trim()) {
      toast.error("Name is required in both languages");
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
            <DialogDescription>Course name, details, image and visibility.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name-en">Name (English) *</Label>
              <Input id="c-name-en" value={form.name_en} onChange={(e) => set("name_en", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-name-ar">Name (Arabic) *</Label>
              <Input id="c-name-ar" value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-desc-en">Description (English)</Label>
              <textarea id="c-desc-en" value={form.desc_en} onChange={(e) => set("desc_en", e.target.value)} rows={2} className={textareaCls} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="c-desc-ar">Description (Arabic)</Label>
              <textarea id="c-desc-ar" value={form.desc_ar} onChange={(e) => set("desc_ar", e.target.value)} rows={2} className={textareaCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-level-en">Level (English)</Label>
              <Input id="c-level-en" value={form.level_en} onChange={(e) => set("level_en", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-level-ar">Level (Arabic)</Label>
              <Input id="c-level-ar" value={form.level_ar} onChange={(e) => set("level_ar", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-dur-en">Duration (English)</Label>
              <Input id="c-dur-en" value={form.duration_en} onChange={(e) => set("duration_en", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-dur-ar">Duration (Arabic)</Label>
              <Input id="c-dur-ar" value={form.duration_ar} onChange={(e) => set("duration_ar", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-lessons">Lessons</Label>
              <Input id="c-lessons" type="number" value={form.lessons} onChange={(e) => set("lessons", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-tag-en">Tag (English)</Label>
              <Input id="c-tag-en" value={form.tag_en} onChange={(e) => set("tag_en", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-tag-ar">Tag (Arabic)</Label>
              <Input id="c-tag-ar" value={form.tag_ar} onChange={(e) => set("tag_ar", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-order">Order</Label>
              <Input id="c-order" type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
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
            <div className="space-y-1.5 sm:col-span-2">
              <ImageField value={form.image_url} onChange={(v) => set("image_url", v)} label="Course image" />
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

interface PlanForm {
  name_en: string;
  name_ar: string;
  price: string;
  features_en: string;
  features_ar: string;
  popular: boolean;
  visible: boolean;
  sort_order: string;
}

type PlanSubmit = Omit<PlanForm, "features_en" | "features_ar"> & {
  features_en: string[];
  features_ar: string[];
};

function splitFeatures(s: string) {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function PlanDialog({
  title,
  plan,
  onClose,
  onSave,
}: {
  title: string;
  plan?: PricingPlan;
  onClose: () => void;
  onSave: (input: PlanSubmit) => Promise<void>;
}) {
  const [form, setForm] = useState<PlanForm>({
    name_en: plan?.name_en ?? "",
    name_ar: plan?.name_ar ?? "",
    price: plan?.price ?? "",
    features_en: plan?.features_en.join("\n") ?? "",
    features_ar: plan?.features_ar.join("\n") ?? "",
    popular: plan?.popular ?? false,
    visible: plan?.visible ?? true,
    sort_order: plan ? String(plan.sort_order) : "0",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof PlanForm>(k: K, v: PlanForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name_en.trim() || !form.name_ar.trim()) {
      toast.error("Name is required in both languages");
      return;
    }
    setBusy(true);
    try {
      await onSave({
        name_en: form.name_en,
        name_ar: form.name_ar,
        price: form.price,
        popular: form.popular,
        visible: form.visible,
        sort_order: form.sort_order,
        features_en: splitFeatures(form.features_en),
        features_ar: splitFeatures(form.features_ar),
      });
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
            <DialogDescription>Package name, price, features and visibility.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pl-name-en">Name (English) *</Label>
              <Input id="pl-name-en" value={form.name_en} onChange={(e) => set("name_en", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pl-name-ar">Name (Arabic) *</Label>
              <Input id="pl-name-ar" value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pl-price">Price (e.g. $29)</Label>
              <Input id="pl-price" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="$29" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pl-fe-en">Features (English) — one per line</Label>
              <textarea id="pl-fe-en" value={form.features_en} onChange={(e) => set("features_en", e.target.value)} rows={5} className={textareaCls} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pl-fe-ar">Features (Arabic) — one per line</Label>
              <textarea id="pl-fe-ar" value={form.features_ar} onChange={(e) => set("features_ar", e.target.value)} rows={5} className={textareaCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pl-order">Order</Label>
              <Input id="pl-order" type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(e) => set("popular", e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Mark as popular
              </label>
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
