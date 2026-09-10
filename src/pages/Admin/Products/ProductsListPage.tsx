import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useAdminProducts, useDeleteProduct } from "@/hooks/queries/useAdmin";
import { formatPrice } from "@/lib/format";
import { ApiException } from "@/lib/api/client";

export function ProductsListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts({ search: search || undefined, page, limit: 20 });
  const deleteProduct = useDeleteProduct();

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id, {
      onSuccess: () => toast.success("Product archived"),
      onError: (err) => toast.error(err instanceof ApiException ? err.message : "Could not archive product"),
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Products</h1>
        <Button asChild className="rounded-none bg-ink hover:bg-brick">
          <Link to="/admin/products/new">
            <Plus className="size-4" /> New product
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-none pl-9"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto border border-line bg-background">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
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
            {!isLoading && data?.products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-soft">
                  No products found.
                </td>
              </tr>
            )}
            {data?.products.map((product) => (
              <tr key={product._id} className="border-b border-line last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {product.images[0] && <img src={product.images[0].url} alt="" className="size-10 shrink-0 object-cover" />}
                    <Link to={`/admin/products/${product.slug}`} className="font-medium text-ink hover:text-brick">
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td className="p-3 text-ink-soft">{typeof product.category === "object" ? product.category.name : "—"}</td>
                <td className="p-3">{formatPrice(product.basePrice)}</td>
                <td className="p-3">{product.totalStock}</td>
                <td className="p-3">
                  {product.isActive ? (
                    <Badge className="rounded-none border-none bg-brick/10 text-brick">Active</Badge>
                  ) : (
                    <Badge className="rounded-none border-none bg-destructive/10 text-destructive">Archived</Badge>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-none">
                      <Link to={`/admin/products/${product.slug}`}>Edit</Link>
                    </Button>
                    {product.isActive && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-none text-destructive hover:bg-destructive/10">
                            Archive
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Archive "{product.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This soft-deletes the product — it disappears from the storefront but order history is preserved. You can't
                              undo this from here yet.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Archive
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button variant="outline" className="rounded-none" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-xs text-ink-soft">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <Button variant="outline" className="rounded-none" disabled={!data.meta.hasNextPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
