import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminCustomers } from "@/hooks/queries/useAdmin";
import { formatDate, formatPrice } from "@/lib/format";

export function CustomersListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminCustomers({ search: search || undefined, page, limit: 20 });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Customers</h1>

      <div className="relative mt-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
        <Input
          placeholder="Search name, email, phone…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="rounded-none pl-9"
        />
      </div>

      <div className="mt-4 overflow-x-auto border border-line bg-background">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-3">Customer</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Last order</th>
              <th className="p-3 text-right">Lifetime spend</th>
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
            {!isLoading && data?.customers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-soft">
                  No customers found.
                </td>
              </tr>
            )}
            {data?.customers.map((c) => (
              <tr key={c._id} className="border-b border-line last:border-0">
                <td className="p-3">
                  <Link to={`/admin/customers/${c._id}`} className="font-medium text-brick hover:underline">
                    {c.name}
                  </Link>
                  <p className="text-xs text-ink-soft">
                    {c.email} · {c.phone}
                  </p>
                </td>
                <td className="p-3 text-ink-soft">{formatDate(c.createdAt)}</td>
                <td className="p-3">{c.orderCount}</td>
                <td className="p-3 text-ink-soft">{c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}</td>
                <td className="p-3 text-right font-semibold">{formatPrice(c.totalSpend)}</td>
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
