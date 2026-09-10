import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdminCoupons, useCreateCoupon, useDeleteCoupon, useUpdateCoupon } from "@/hooks/queries/useAdmin";
import { formatDate, formatPrice } from "@/lib/format";
import { ApiException } from "@/lib/api/client";
import type { Coupon, CouponPayload } from "@/types";

const emptyForm = (): CouponPayload => ({
  code: "",
  description: "",
  discountType: "percent",
  discountValue: 10,
  minOrderValue: 0,
  maxDiscountCap: null,
  usageLimit: null,
  perUserLimit: 1,
  validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
  isActive: true,
});

export function CouponsPage() {
  const { data, isLoading } = useAdminCoupons({ limit: 50 });
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponPayload>(emptyForm());

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscountCap: coupon.maxDiscountCap ?? null,
      usageLimit: coupon.usageLimit ?? null,
      perUserLimit: coupon.perUserLimit,
      validUntil: coupon.validUntil.slice(0, 10),
      isActive: coupon.isActive,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue || !form.validUntil) {
      toast.error("Code, discount value and expiry are required");
      return;
    }
    try {
      if (editing) {
        await updateCoupon.mutateAsync({ id: editing._id, body: form });
        toast.success("Coupon updated");
      } else {
        await createCoupon.mutateAsync(form);
        toast.success("Coupon created");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Could not save coupon");
    }
  };

  const handleDelete = (id: string) => {
    deleteCoupon.mutate(id, {
      onSuccess: () => toast.success("Coupon deleted"),
      onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not delete coupon"),
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Coupons</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="rounded-none bg-ink hover:bg-brick">
              <Plus className="size-4" /> New coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit coupon" : "New coupon"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="mt-1 rounded-none" disabled={Boolean(editing)} />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 rounded-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Discount type</Label>
                  <Select value={form.discountType} onValueChange={(v) => setForm({ ...form, discountType: v as "flat" | "percent" })}>
                    <SelectTrigger className="mt-1 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percent</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Value</Label>
                  <Input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="mt-1 rounded-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Min order value</Label>
                  <Input type="number" value={form.minOrderValue ?? 0} onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })} className="mt-1 rounded-none" />
                </div>
                <div>
                  <Label>Max discount cap</Label>
                  <Input
                    type="number"
                    value={form.maxDiscountCap ?? ""}
                    onChange={(e) => setForm({ ...form, maxDiscountCap: e.target.value ? Number(e.target.value) : null })}
                    className="mt-1 rounded-none"
                    placeholder="No cap"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Usage limit (total)</Label>
                  <Input
                    type="number"
                    value={form.usageLimit ?? ""}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : null })}
                    className="mt-1 rounded-none"
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <Label>Per-user limit</Label>
                  <Input type="number" value={form.perUserLimit ?? 1} onChange={(e) => setForm({ ...form, perUserLimit: Number(e.target.value) })} className="mt-1 rounded-none" />
                </div>
              </div>
              <div>
                <Label>Valid until</Label>
                <Input type="date" value={form.validUntil.slice(0, 10)} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="mt-1 rounded-none" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.isActive ?? true} onCheckedChange={(v) => setForm({ ...form, isActive: v })} /> Active
              </label>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={createCoupon.isPending || updateCoupon.isPending} className="rounded-none bg-brick hover:bg-brick-dark">
                {editing ? "Save changes" : "Create coupon"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 overflow-x-auto border border-line bg-background">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Usage</th>
              <th className="p-3">Expires</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-soft">
                  Loading…
                </td>
              </tr>
            )}
            {data?.coupons.map((c) => (
              <tr key={c._id} className="border-b border-line last:border-0">
                <td className="p-3 font-medium">{c.code}</td>
                <td className="p-3">{c.discountType === "percent" ? `${c.discountValue}%` : formatPrice(c.discountValue)}</td>
                <td className="p-3 text-ink-soft">
                  {c.usedCount ?? 0}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                </td>
                <td className="p-3 text-ink-soft">{formatDate(c.validUntil)}</td>
                <td className="p-3">
                  {c.isExpired ? (
                    <Badge className="rounded-none border-none bg-destructive/10 text-destructive">Expired</Badge>
                  ) : c.isActive ? (
                    <Badge className="rounded-none border-none bg-brick/10 text-brick">Active</Badge>
                  ) : (
                    <Badge className="rounded-none border-none bg-sand text-ink-soft">Inactive</Badge>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="rounded-none" onClick={() => openEdit(c)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-none text-destructive hover:bg-destructive/10" onClick={() => handleDelete(c._id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
