import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { uploadSiteImageFn, uploadSiteVideoFn } from "@/lib/admin-server";
import { ImageIcon, Link2, Upload, VideoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ImageField({
  value,
  onChange,
  label,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadSiteImageFn({ data: fd as never });
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-16 w-28 rounded-lg border border-border object-cover" />
        ) : (
          <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50">
          <Upload className="h-3.5 w-3.5" />
          {busy ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={onFile}
            disabled={busy}
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image link"
          className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function VideoField({
  value,
  onChange,
  label,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadSiteVideoFn({ data: fd as never });
      onChange(url);
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <video src={value} className="h-16 w-28 rounded-lg border border-border object-cover" muted controls />
        ) : (
          <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            <VideoIcon className="h-5 w-5" />
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50">
          <Upload className="h-3.5 w-3.5" />
          {busy ? "Uploading…" : "Upload video"}
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            onChange={onFile}
            disabled={busy}
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste a video link (mp4 / webm / YouTube)"
          className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
