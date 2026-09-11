import { useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useAdminReels,
  useCreateReel,
  useDeleteReel,
  useUpdateReel,
} from "@/hooks/queries/useAdmin";
import { useProducts } from "@/hooks/queries/useProducts";
import * as uploadApi from "@/lib/api/upload.api";
import { errorMessage } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";
import { videoPosterUrl } from "@/lib/cloudinary";
import type { Reel, ReelPayload } from "@/types";

interface FormState {
  video: { url: string; publicId: string } | null;
  caption: string;
  productId: string | null;
  productLabel: string;
  displayOrder: number;
  isActive: boolean;
}

const emptyForm = (): FormState => ({
  video: null,
  caption: "",
  productId: null,
  productLabel: "",
  displayOrder: 0,
  isActive: true,
});

function ProductPicker({
  value,
  onSelect,
  onClear,
}: {
  value: string;
  onSelect: (id: string, label: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const { data } = useProducts({ search: query, limit: 6 }, query.trim().length > 1);
  const results = query.trim().length > 1 ? data?.products || [] : [];

  if (value) {
    return (
      <div className="mt-1 flex items-center justify-between border border-line px-3 py-2 text-sm">
        <span className="truncate">{value}</span>
        <button type="button" onClick={onClear} aria-label="Remove tagged product">
          <X className="size-4 text-ink-soft hover:text-destructive" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a product to tag…"
        className="mt-1"
      />
      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full border border-line bg-background shadow-lg">
          {results.map((p) => (
            <button
              key={p._id}
              type="button"
              onClick={() => {
                onSelect(p._id, p.name);
                setQuery("");
              }}
              className="flex w-full items-center gap-2 p-2 text-left text-sm hover:bg-sand"
            >
              {p.images[0] && <img src={p.images[0].url} alt="" className="size-8 object-cover" />}
              <span className="truncate">{p.name}</span>
              <span className="ml-auto shrink-0 text-xs text-ink-soft">
                {formatPrice(p.basePrice)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReelCard({ reel, onEdit }: { reel: Reel; onEdit: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const updateReel = useUpdateReel();
  const deleteReel = useDeleteReel();

  return (
    <div className="border border-line bg-background">
      <div
        className="relative aspect-[9/16] overflow-hidden bg-ink"
        onMouseEnter={() => videoRef.current?.play().catch(() => {})}
        onMouseLeave={() => {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }}
      >
        <video
          ref={videoRef}
          src={reel.video.url}
          poster={videoPosterUrl(reel.video.url)}
          muted
          loop
          playsInline
          className="size-full object-cover"
        />
        {!reel.isActive && (
          <span className="absolute left-2 top-2 bg-ink/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
            Hidden
          </span>
        )}
      </div>
      <div className="space-y-2 p-3">
        {reel.caption && <p className="truncate text-sm font-medium">{reel.caption}</p>}
        {reel.product && <p className="truncate text-xs text-brick">Shop: {reel.product.name}</p>}
        <label className="flex items-center gap-2 text-xs text-ink-soft">
          <Switch
            checked={reel.isActive}
            onCheckedChange={(v) => updateReel.mutate({ id: reel._id, body: { isActive: v } })}
          />
          {reel.isActive ? "Visible" : "Hidden"}
        </label>
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 rounded-none" onClick={onEdit}>
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this reel?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the video from Cloudinary too. This can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deleteReel.mutate(reel._id, {
                      onSuccess: () => toast.success("Reel deleted"),
                      onError: (err) => toast.error(errorMessage(err, "Could not delete reel")),
                    })
                  }
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export function ReelsPage() {
  const { data: reels, isLoading } = useAdminReels();
  const createReel = useCreateReel();
  const updateReel = useUpdateReel();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (reel: Reel) => {
    setEditing(reel);
    setForm({
      video: reel.video,
      caption: reel.caption || "",
      productId: reel.product?._id || null,
      productLabel: reel.product?.name || "",
      displayOrder: reel.displayOrder,
      isActive: reel.isActive,
    });
    setOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const [uploaded] = await uploadApi.uploadVideos([file], setProgress);
      setForm((f) => ({ ...f, video: { url: uploaded.url, publicId: uploaded.publicId } }));
    } catch (err) {
      toast.error(errorMessage(err, "Could not upload video"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.video) {
      toast.error("Upload a video first");
      return;
    }
    const body: ReelPayload = {
      video: form.video,
      caption: form.caption.trim() || undefined,
      product: form.productId,
      displayOrder: form.displayOrder,
      isActive: form.isActive,
    };
    try {
      if (editing) {
        await updateReel.mutateAsync({ id: editing._id, body });
        toast.success("Reel updated");
      } else {
        await createReel.mutateAsync(body);
        toast.success("Reel posted");
      }
      setOpen(false);
    } catch (err) {
      toast.error(errorMessage(err, "Could not save reel"));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Reels</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="rounded-none bg-ink hover:bg-brick">
              <Plus className="size-4" /> New reel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit reel" : "New reel"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Video</Label>
                {form.video ? (
                  <div className="relative mt-1 aspect-[9/16] w-32 overflow-hidden bg-ink">
                    <video
                      src={form.video.url}
                      className="size-full object-cover"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, video: null })}
                      className="absolute right-1 top-1 rounded-full bg-ink/80 p-1"
                      aria-label="Remove video"
                    >
                      <X className="size-3 text-primary-foreground" />
                    </button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={handleFileChange}
                    className="mt-1"
                    disabled={uploading}
                  />
                )}
                {uploading && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden bg-sand">
                    <div
                      className="h-full bg-brick transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div>
                <Label>Caption</Label>
                <Input
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  maxLength={200}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label>Tag a product (optional)</Label>
                <ProductPicker
                  value={form.productLabel}
                  onSelect={(id, label) => setForm({ ...form, productId: id, productLabel: label })}
                  onClear={() => setForm({ ...form, productId: null, productLabel: "" })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Display order</Label>
                  <Input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <label className="mt-6 flex items-center gap-2 text-sm">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                  />{" "}
                  Visible
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={uploading || createReel.isPending || updateReel.isPending}
                className="rounded-none bg-brick hover:bg-brick-dark"
              >
                {editing ? "Save changes" : "Post reel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="mt-6 text-sm text-ink-soft">Loading…</p>}
      {!isLoading && !reels?.length && (
        <p className="mt-6 text-sm text-ink-soft">No reels yet — post your first one.</p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {reels?.map((reel) => (
          <ReelCard key={reel._id} reel={reel} onEdit={() => openEdit(reel)} />
        ))}
      </div>
    </div>
  );
}
