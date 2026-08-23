import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { deleteBlogPostFn, listBlogPostsFn, upsertBlogPostFn, type BlogPost } from "@/lib/admin-server";
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

export const Route = createFileRoute("/admin/blog")({ component: BlogPage });

function BlogPage() {
  const [items, setItems] = useState<BlogPost[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  async function load() {
    try {
      setItems(await listBlogPostsFn());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load blog posts");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(p: BlogPost) {
    if (!window.confirm(`Delete "${p.title_en || p.title_ar}"?`)) return;
    try {
      await deleteBlogPostFn({ data: { id: p.id } });
      toast.success("Post deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground">
            Articles and news shown on the public blog page.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Add post
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {items === null ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No blog posts yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt=""
                          className="h-12 w-16 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <span className="flex h-12 w-16 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {p.title_en || p.title_ar || "—"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {p.slug || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.author || "—"}</TableCell>
                    <TableCell>
                      {p.visible ? <Badge>Visible</Badge> : <Badge variant="outline">Hidden</Badge>}
                    </TableCell>
                    <TableCell>{p.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditing(p)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(p)}
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
        <BlogPostDialog
          title="Add blog post"
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            try {
              await upsertBlogPostFn({
                data: { ...input, sort_order: Number(input.sort_order) || 0 },
              });
              toast.success("Post added");
              setCreating(false);
              load();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Save failed");
            }
          }}
        />
      )}

      {editing && (
        <BlogPostDialog
          title="Edit blog post"
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            try {
              await upsertBlogPostFn({
                data: { ...input, id: editing.id, sort_order: Number(input.sort_order) || 0 },
              });
              toast.success("Post updated");
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
  title_en: string;
  title_ar: string;
  slug: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string;
  body_ar: string;
  image_url: string;
  author: string;
  visible: boolean;
  sort_order: string;
}

function BlogPostDialog({
  title,
  item,
  onClose,
  onSave,
}: {
  title: string;
  item?: BlogPost;
  onClose: () => void;
  onSave: (input: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>({
    title_en: item?.title_en ?? "",
    title_ar: item?.title_ar ?? "",
    slug: item?.slug ?? "",
    excerpt_en: item?.excerpt_en ?? "",
    excerpt_ar: item?.excerpt_ar ?? "",
    body_en: item?.body_en ?? "",
    body_ar: item?.body_ar ?? "",
    image_url: item?.image_url ?? "",
    author: item?.author ?? "",
    visible: item?.visible ?? true,
    sort_order: item ? String(item.sort_order) : "0",
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.title_en.trim() && !form.title_ar.trim()) {
      toast.error("Add a title (English or Arabic)");
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
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Bilingual blog post with title, excerpt, body and image.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bp-title-en">Title (English)</Label>
              <Input
                id="bp-title-en"
                value={form.title_en}
                onChange={(e) => set("title_en", e.target.value)}
                placeholder="How to Learn Quran Online"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-title-ar">Title (Arabic)</Label>
              <Input
                id="bp-title-ar"
                value={form.title_ar}
                onChange={(e) => set("title_ar", e.target.value)}
                placeholder="كيف تتعلّم القرآن أونلاين"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="bp-slug">Slug (auto-generated if empty)</Label>
              <Input
                id="bp-slug"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="how-to-learn-quran-online"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-excerpt-en">Excerpt (English)</Label>
              <textarea
                id="bp-excerpt-en"
                value={form.excerpt_en}
                onChange={(e) => set("excerpt_en", e.target.value)}
                rows={2}
                placeholder="Short summary..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-excerpt-ar">Excerpt (Arabic)</Label>
              <textarea
                id="bp-excerpt-ar"
                value={form.excerpt_ar}
                onChange={(e) => set("excerpt_ar", e.target.value)}
                rows={2}
                placeholder="ملخص قصير..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-body-en">Body (English)</Label>
              <textarea
                id="bp-body-en"
                value={form.body_en}
                onChange={(e) => set("body_en", e.target.value)}
                rows={8}
                placeholder="Full article content in English..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-body-ar">Body (Arabic)</Label>
              <textarea
                id="bp-body-ar"
                value={form.body_ar}
                onChange={(e) => set("body_ar", e.target.value)}
                rows={8}
                placeholder="المقال الكامل بالعربية..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <ImageField
                value={form.image_url}
                onChange={(v) => set("image_url", v)}
                label="Featured Image"
                hint="Upload or paste an image URL for the blog post."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-author">Author</Label>
              <Input
                id="bp-author"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                placeholder="Qumra Academy"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp-order">Order</Label>
              <Input
                id="bp-order"
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
