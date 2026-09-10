import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useAdminCategories,
  useAdminProduct,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/queries/useAdmin";
import * as uploadApi from "@/lib/api/upload.api";
import { ApiException } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";
import type { Category, ProductImage, ProductVariant } from "@/types";

function flattenCategories(categories: Category[], depth = 0): { id: string; label: string; parentId: string | null }[] {
  return categories.flatMap((c) => [
    { id: c._id, label: `${"— ".repeat(depth)}${c.name}`, parentId: null },
    ...flattenCategories(c.children || [], depth + 1),
  ]);
}

const emptyVariant = (): ProductVariant => ({
  sku: "",
  size: "",
  color: "",
  colorHex: "#111111",
  price: 0,
  mrp: 0,
  stock: 0,
  isActive: true,
});

export function ProductFormPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();
  const { data: existing, isLoading: loadingExisting } = useAdminProduct(slug);
  const { data: categoryTree } = useAdminCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([emptyVariant()]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setDescription(existing.description);
    setCategoryId(typeof existing.category === "object" ? existing.category._id : existing.category);
    setBrand(existing.brand || "");
    setTagsInput((existing.tags || []).join(", "));
    setImages(existing.images);
    setVariants(existing.variants.length ? existing.variants : [emptyVariant()]);
    setIsFeatured(existing.isFeatured);
    setIsBestseller(existing.isBestseller);
    setIsNewArrival(existing.isNewArrival);
    setMetaTitle(existing.seo?.metaTitle || "");
    setMetaDescription(existing.seo?.metaDescription || "");
  }, [existing]);

  const categoryOptions = flattenCategories(categoryTree || []);

  const handleImageUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadApi.uploadImages(Array.from(fileList));
      setImages((prev) => [...prev, ...uploaded.map((f) => ({ url: f.url, publicId: f.publicId }))]);
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Upload failed — check Cloudinary credentials");
    } finally {
      setUploading(false);
    }
  };

  const updateVariant = (index: number, patch: Partial<ProductVariant>) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };

  const handleSubmit = async () => {
    if (!name || !description || !categoryId) {
      toast.error("Name, description and category are required");
      return;
    }
    if (images.length < 2) {
      toast.error("Add at least two images (front + back)");
      return;
    }
    if (!variants.length || variants.some((v) => !v.sku || !v.size || !v.color || v.mrp < v.price)) {
      toast.error("Every variant needs a SKU, size, colour, and MRP ≥ price");
      return;
    }

    const payload = {
      name,
      description,
      category: categoryId,
      brand: brand || undefined,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images,
      variants: variants.map(({ _id, ...v }) => v),
      isFeatured,
      isBestseller,
      isNewArrival,
      seo: metaTitle || metaDescription ? { metaTitle: metaTitle || undefined, metaDescription: metaDescription || undefined } : undefined,
    };

    setSubmitting(true);
    try {
      if (isEdit && existing) {
        await updateProduct.mutateAsync({ id: existing._id, body: payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Could not save product");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loadingExisting) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-semibold text-ink">{isEdit ? "Edit product" : "New product"}</h1>

      <div className="mt-6 space-y-8">
        <section className="border border-line bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Basics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 rounded-none" />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 rounded-none" rows={4} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="mt-1 rounded-none">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Brand</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 rounded-none" />
            </div>
            <div className="sm:col-span-2">
              <Label>Tags (comma separated)</Label>
              <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="mt-1 rounded-none" placeholder="oversized, heavyweight" />
            </div>
          </div>
        </section>

        <section className="border border-line bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Images (min. 2 — front &amp; back)</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img.publicId} className="group relative size-24">
                <img src={img.url} alt="" className="size-24 object-cover" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setImages((prev) => prev.filter((i) => i.publicId !== img.publicId))}
                  className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-ink/80 text-primary-foreground opacity-0 group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <label className="grid size-24 cursor-pointer place-items-center border border-dashed border-line text-xs text-ink-soft hover:border-brick hover:text-brick">
              {uploading ? "Uploading…" : "+ Add"}
              <input type="file" accept="image/*" multiple hidden disabled={uploading} onChange={(e) => handleImageUpload(e.target.files)} />
            </label>
          </div>
        </section>

        <section className="border border-line bg-background p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Variants</h2>
            <Button type="button" variant="outline" size="sm" className="rounded-none" onClick={() => setVariants((prev) => [...prev, emptyVariant()])}>
              <Plus className="size-3.5" /> Add variant
            </Button>
          </div>
          <div className="mt-4 space-y-3 overflow-x-auto">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 border border-line p-3 sm:grid-cols-8 sm:items-end">
                <div className="sm:col-span-2">
                  <Label className="text-[10px]">SKU</Label>
                  <Input value={v.sku} onChange={(e) => updateVariant(i, { sku: e.target.value.toUpperCase() })} className="mt-1 h-8 rounded-none text-sm" />
                </div>
                <div>
                  <Label className="text-[10px]">Size</Label>
                  <Input value={v.size} onChange={(e) => updateVariant(i, { size: e.target.value })} className="mt-1 h-8 rounded-none text-sm" />
                </div>
                <div>
                  <Label className="text-[10px]">Colour</Label>
                  <Input value={v.color} onChange={(e) => updateVariant(i, { color: e.target.value })} className="mt-1 h-8 rounded-none text-sm" />
                </div>
                <div>
                  <Label className="text-[10px]">Hex</Label>
                  <Input type="color" value={v.colorHex || "#111111"} onChange={(e) => updateVariant(i, { colorHex: e.target.value })} className="mt-1 h-8 w-full rounded-none p-1" />
                </div>
                <div>
                  <Label className="text-[10px]">Price</Label>
                  <Input type="number" value={v.price} onChange={(e) => updateVariant(i, { price: Number(e.target.value) })} className="mt-1 h-8 rounded-none text-sm" />
                </div>
                <div>
                  <Label className="text-[10px]">MRP</Label>
                  <Input type="number" value={v.mrp} onChange={(e) => updateVariant(i, { mrp: Number(e.target.value) })} className="mt-1 h-8 rounded-none text-sm" />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="text-[10px]">Stock</Label>
                    <Input type="number" value={v.stock} onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })} className="mt-1 h-8 rounded-none text-sm" />
                  </div>
                  <button
                    type="button"
                    aria-label="Remove variant"
                    onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))}
                    className="mb-1 shrink-0 text-ink-soft hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-line bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Merchandising</h2>
          <div className="mt-4 flex flex-wrap gap-8">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={isBestseller} onCheckedChange={setIsBestseller} /> Bestseller
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={isNewArrival} onCheckedChange={setIsNewArrival} /> New arrival
            </label>
          </div>
        </section>

        <section className="border border-line bg-background p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">SEO (optional)</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <Label>Meta title</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-1 rounded-none" />
            </div>
            <div>
              <Label>Meta description</Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="mt-1 rounded-none" rows={2} />
            </div>
          </div>
        </section>

        {variants.length > 0 && (
          <p className="text-xs text-ink-soft">
            Base price shown to customers will be the cheapest active variant — currently{" "}
            <strong>{formatPrice(Math.min(...variants.filter((v) => v.isActive).map((v) => v.price || Infinity)) || 0)}</strong>.
          </p>
        )}

        <Button onClick={handleSubmit} disabled={submitting} className="h-11 rounded-none bg-brick hover:bg-brick-dark">
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>
    </div>
  );
}
