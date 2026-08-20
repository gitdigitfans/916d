import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  deleteSiteProgramFn,
  getSiteSettingsFn,
  listSiteProgramsFn,
  updateHeroImageFn,
  updateProgramsVideoFn,
  upsertSiteProgramFn,
  type SiteProgram,
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
import { ImageIcon, Pencil, Plus, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/site")({ component: SitePage });

function SitePage() {
  const [hero, setHero] = useState<string | null>(null);
  const [heroBusy, setHeroBusy] = useState(false);
  const [video, setVideo] = useState<string | null>(null);
  const [videoBusy, setVideoBusy] = useState(false);
  const [programs, setPrograms] = useState<SiteProgram[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<SiteProgram | null>(null);

  async function load() {
    try {
      const [settings, progs] = await Promise.all([getSiteSettingsFn(), listSiteProgramsFn()]);
      setHero(settings.hero_image);
      setVideo(settings.programs_video_url);
      setPrograms(progs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load site content");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveHero() {
    if (!hero) return;
    setHeroBusy(true);
    try {
      await updateHeroImageFn({ data: { image_url: hero } });
      toast.success("Hero image saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setHeroBusy(false);
    }
  }

  async function saveVideo() {
    if (video === null) return;
    setVideoBusy(true);
    try {
      await updateProgramsVideoFn({ data: { video_url: video } });
      toast.success("Intro video saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setVideoBusy(false);
    }
  }

  async function remove(p: SiteProgram) {
    if (!window.confirm(`Delete program "${p.name_en}"?`)) return;
    try {
      await deleteSiteProgramFn({ data: { id: p.id } });
      toast.success("Program deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Home Page Content</h1>
        <p className="text-sm text-muted-foreground">Hero image and the &quot;Our Programs&quot; section of the homepage.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Hero Image</CardTitle>
          <Button size="sm" onClick={saveHero} disabled={heroBusy || hero === null}>
            <Save className="h-3.5 w-3.5" /> {heroBusy ? "Saving…" : "Save"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {hero === null ? (
              <div className="h-16 w-28 animate-pulse rounded-lg bg-muted" />
            ) : (
              <img src={hero} alt="Hero" className="h-16 w-28 rounded-lg border border-border object-cover" />
            )}
            <ImageField value={hero ?? ""} onChange={setHero} label="Hero image" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            This is the large image shown on the right side of the homepage hero section.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Programs Intro Video</CardTitle>
          <Button size="sm" onClick={saveVideo} disabled={videoBusy || video === null}>
            <Save className="h-3.5 w-3.5" /> {videoBusy ? "Saving…" : "Save"}
          </Button>
        </CardHeader>
        <CardContent>
          <VideoField
            value={video ?? ""}
            onChange={setVideo}
            label="Intro video"
            hint="Shown at the top of the /programs page. Upload an mp4/webm or paste a YouTube link. Leave empty to keep the default intro video."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Program Cards</CardTitle>
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-3.5 w-3.5" /> Add program
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {programs === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : programs.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No program cards yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (AR)</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="h-10 w-14 rounded-md border border-border object-cover" />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{p.name_en}</TableCell>
                    <TableCell>{p.name_ar}</TableCell>
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
        <ProgramDialog
          title="Add program"
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            try {
              await upsertSiteProgramFn({ data: { ...input, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Program added");
              setCreating(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editing && (
        <ProgramDialog
          title="Edit program"
          program={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await upsertSiteProgramFn({ data: { ...input, id: editing.id, sort_order: Number(input.sort_order) || 0 } });
              toast.success("Program updated");
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

interface ProgramForm {
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  image_url: string;
  visible: boolean;
  sort_order: string;
}

function ProgramDialog({
  title,
  program,
  onClose,
  onSave,
}: {
  title: string;
  program?: SiteProgram;
  onClose: () => void;
  onSave: (input: Omit<ProgramForm, "sort_order"> & { sort_order: string }) => Promise<void>;
}) {
  const [form, setForm] = useState<ProgramForm>({
    name_en: program?.name_en ?? "",
    name_ar: program?.name_ar ?? "",
    desc_en: program?.desc_en ?? "",
    desc_ar: program?.desc_ar ?? "",
    image_url: program?.image_url ?? "",
    visible: program?.visible ?? true,
    sort_order: program ? String(program.sort_order) : "0",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ProgramForm>(k: K, v: ProgramForm[K]) {
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
            <DialogDescription>Program name, description, image and homepage visibility.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="p-name-en">Name (English) *</Label>
              <Input id="p-name-en" value={form.name_en} onChange={(e) => set("name_en", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-name-ar">Name (Arabic) *</Label>
              <Input id="p-name-ar" value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-desc-en">Description (English)</Label>
              <textarea
                id="p-desc-en"
                value={form.desc_en}
                onChange={(e) => set("desc_en", e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-desc-ar">Description (Arabic)</Label>
              <textarea
                id="p-desc-ar"
                value={form.desc_ar}
                onChange={(e) => set("desc_ar", e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-order">Order</Label>
              <Input
                id="p-order"
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
                Show on homepage
              </label>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <ImageField value={form.image_url} onChange={(v) => set("image_url", v)} label="Card image" />
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
