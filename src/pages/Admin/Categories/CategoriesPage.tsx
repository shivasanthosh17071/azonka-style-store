import { useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { useAdminCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/hooks/queries/useAdmin";
import * as uploadApi from "@/lib/api/upload.api";
import { ApiException } from "@/lib/api/client";
import type { Category } from "@/types";
import type { CategoryPayload } from "@/lib/api/categories.api";

const emptyForm = (): CategoryPayload => ({ name: "", parentCategory: null, displayOrder: 0, isActive: true });

export function CategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryPayload>(emptyForm());
  const [uploading, setUploading] = useState(false);

  const topLevel = categories || [];

  const openCreate = (parentId: string | null = null) => {
    setEditing(null);
    setForm({ ...emptyForm(), parentCategory: parentId });
    setOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      image: category.image,
      parentCategory: category.parentCategory || null,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setOpen(true);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const [file] = await uploadApi.uploadImages([files[0]]);
      setForm((f) => ({ ...f, image: { url: file.url, publicId: file.publicId } }));
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing._id, body: form });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(form);
        toast.success("Category created");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Could not save category");
    }
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not delete — it may still have products or sub-categories"),
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Categories</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openCreate(null)} className="rounded-none bg-ink hover:bg-brick">
              <Plus className="size-4" /> New category
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-none sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 rounded-none" />
              </div>
              <div>
                <Label>Parent category</Label>
                <Select value={form.parentCategory || "none"} onValueChange={(v) => setForm({ ...form, parentCategory: v === "none" ? null : v })}>
                  <SelectTrigger className="mt-1 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level)</SelectItem>
                    {topLevel
                      .filter((c) => c._id !== editing?._id)
                      .map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Display order</Label>
                <Input type="number" value={form.displayOrder ?? 0} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className="mt-1 rounded-none" />
              </div>
              <div>
                <Label>Image</Label>
                <div className="mt-1 flex items-center gap-3">
                  {form.image && (
                    <div className="relative size-16">
                      <img src={form.image.url} alt="" className="size-16 object-cover" />
                      <button type="button" aria-label="Remove image" onClick={() => setForm({ ...form, image: undefined })} className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-ink text-primary-foreground">
                        <X className="size-2.5" />
                      </button>
                    </div>
                  )}
                  <label className="grid size-16 cursor-pointer place-items-center border border-dashed border-line text-[10px] text-ink-soft hover:border-brick hover:text-brick">
                    {uploading ? "…" : "+ Add"}
                    <input type="file" accept="image/*" hidden disabled={uploading} onChange={(e) => handleImageUpload(e.target.files)} />
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.isActive ?? true} onCheckedChange={(v) => setForm({ ...form, isActive: v })} /> Active
              </label>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={createCategory.isPending || updateCategory.isPending} className="rounded-none bg-brick hover:bg-brick-dark">
                {editing ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <p className="text-sm text-ink-soft">Loading…</p>}
        {topLevel.map((cat) => (
          <div key={cat._id} className="border border-line bg-background">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {cat.image && <img src={cat.image.url} alt="" className="size-10 object-cover" />}
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-ink-soft">{cat.isActive ? "Active" : "Inactive"} · order {cat.displayOrder}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-none" onClick={() => openCreate(cat._id)}>
                  + Sub-category
                </Button>
                <Button variant="outline" size="sm" className="rounded-none" onClick={() => openEdit(cat)}>
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-none text-destructive hover:bg-destructive/10">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{cat.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>Only possible if it has no products or sub-categories.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(cat._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {cat.children && cat.children.length > 0 && (
              <div className="divide-y divide-line border-t border-line">
                {cat.children.map((child) => (
                  <div key={child._id} className="flex items-center justify-between p-4 pl-10">
                    <div className="flex items-center gap-3">
                      {child.image && <img src={child.image.url} alt="" className="size-8 object-cover" />}
                      <div>
                        <p className="text-sm font-medium">{child.name}</p>
                        <p className="text-xs text-ink-soft">{child.isActive ? "Active" : "Inactive"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-none" onClick={() => openEdit(child)}>
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-none text-destructive hover:bg-destructive/10">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{child.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>Only possible if it has no products.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(child._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
