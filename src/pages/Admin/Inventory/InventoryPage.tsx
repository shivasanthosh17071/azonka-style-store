import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLowStock, useUpdateVariantStock } from "@/hooks/queries/useAdmin";
import { ApiException } from "@/lib/api/client";

export function InventoryPage() {
  const [threshold, setThreshold] = useState(5);
  const { data, isLoading } = useLowStock(threshold);
  const updateStock = useUpdateVariantStock();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const handleSave = (productId: string, variantId: string) => {
    const key = `${productId}:${variantId}`;
    const value = drafts[key];
    if (value === undefined || value === "") return;
    updateStock.mutate(
      { productId, variantId, body: { stock: Number(value) } },
      {
        onSuccess: () => {
          toast.success("Stock updated");
          setDrafts((d) => {
            const next = { ...d };
            delete next[key];
            return next;
          });
        },
        onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not update stock"),
      },
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Inventory</h1>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="threshold" className="text-ink-soft">
            Threshold
          </label>
          <Input id="threshold" type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value) || 0)} className="w-20 rounded-none" />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-line bg-background">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-3">Product</th>
              <th className="p-3">Variant</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-right">Update</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-soft">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && data?.variants.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-soft">
                  Nothing at or under this threshold.
                </td>
              </tr>
            )}
            {data?.variants.map((v) => {
              const key = `${v.productId}:${v.variantId}`;
              return (
                <tr key={key} className="border-b border-line last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {v.image && <img src={v.image} alt="" className="size-9 shrink-0 object-cover" />}
                      <Link to={`/admin/products/${v.slug}`} className="font-medium text-ink hover:text-brick">
                        {v.name}
                      </Link>
                    </div>
                  </td>
                  <td className="p-3 text-ink-soft">
                    {v.color} / {v.size}
                  </td>
                  <td className="p-3 text-ink-soft">{v.sku}</td>
                  <td className="p-3">
                    <span className={v.stock === 0 ? "font-bold text-destructive" : "font-bold text-brick"}>{v.stock}</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Input
                        type="number"
                        placeholder="New stock"
                        value={drafts[key] ?? ""}
                        onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                        className="w-24 rounded-none"
                      />
                      <Button size="sm" variant="outline" className="rounded-none" onClick={() => handleSave(v.productId, v.variantId)}>
                        Save
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
