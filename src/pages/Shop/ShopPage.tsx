import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/common/ProductCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { BottomSheet } from "@/components/common/BottomSheet";
import { useProducts } from "@/hooks/queries/useProducts";
import type { ProductListParams } from "@/types";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FAFAFA" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Sand", hex: "#D9C7A7" },
];
const SORTS: { value: NonNullable<ProductListParams["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "discount", label: "Biggest Discount" },
];

function FilterPanel({
  selectedSizes,
  selectedColors,
  minPrice,
  maxPrice,
  onToggleSize,
  onToggleColor,
  onPriceChange,
  onClear,
}: {
  selectedSizes: string[];
  selectedColors: string[];
  minPrice: string;
  maxPrice: string;
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onPriceChange: (min: string, max: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">Size</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onToggleSize(size)}
              className={`grid size-9 place-items-center border text-xs font-medium ${
                selectedSizes.includes(size) ? "border-brick bg-brick text-primary-foreground" : "border-line text-ink-soft"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">Colour</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <button key={c.name} onClick={() => onToggleColor(c.name)} className="flex items-center gap-2" aria-pressed={selectedColors.includes(c.name)}>
              <span
                className={`size-6 rounded-full border-2 ${selectedColors.includes(c.name) ? "border-brick" : "border-line"}`}
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-xs text-ink-soft">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">Price</h3>
        <div className="mt-3 flex items-center gap-2">
          <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => onPriceChange(e.target.value, maxPrice)} />
          <span className="text-ink-soft">–</span>
          <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => onPriceChange(minPrice, e.target.value)} />
        </div>
      </div>
      <Button variant="outline" className="w-full rounded-none" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}

export function ShopPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(1);

  const search = searchParams.get("search") || undefined;
  const sort = (searchParams.get("sort") as ProductListParams["sort"]) || "newest";
  const selectedSizes = useMemo(() => (searchParams.get("size") || "").split(",").filter(Boolean), [searchParams]);
  const selectedColors = useMemo(() => (searchParams.get("color") || "").split(",").filter(Boolean), [searchParams]);
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const isFeatured = searchParams.get("isFeatured") === "true" || undefined;
  const isBestseller = searchParams.get("isBestseller") === "true" || undefined;
  const isNewArrival = searchParams.get("isNewArrival") === "true" || undefined;

  useEffect(() => setPage(1), [categorySlug, searchParams]);

  const params: ProductListParams = {
    page,
    limit: 12,
    category: categorySlug,
    search,
    sort,
    size: selectedSizes.length ? selectedSizes.join(",") : undefined,
    color: selectedColors.length ? selectedColors.join(",") : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    isFeatured,
    isBestseller,
    isNewArrival,
  };

  const { data, isLoading, isFetching } = useProducts(params);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const toggleListParam = (key: "size" | "color", value: string, current: string[]) => {
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateParam(key, next.length ? next.join(",") : null);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    setSearchParams(next, { replace: true });
  };

  const heading = categorySlug
    ? categorySlug.replace(/-/g, " ")
    : search
      ? `Results for "${search}"`
      : "Shop all";

  return (
    <div className="section-wrap py-12 sm:py-16">
      <SectionHeading eyebrow="The full range" title={heading} copy="Every fit, every colourway, all in one place." />

      <div className="mt-10 flex items-center justify-between gap-4 border-b border-line pb-4">
        <Button variant="outline" className="rounded-none sm:hidden" onClick={() => setSheetOpen(true)}>
          <SlidersHorizontal className="size-4" /> Filters
        </Button>
        <p className="hidden text-xs text-ink-soft sm:block">{data?.meta.total ?? 0} products</p>
        <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
          <SelectTrigger className="w-[190px] rounded-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 grid gap-10 sm:grid-cols-[220px_1fr]">
        <aside className="hidden sm:block">
          <FilterPanel
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onToggleSize={(s) => toggleListParam("size", s, selectedSizes)}
            onToggleColor={(c) => toggleListParam("color", c, selectedColors)}
            onPriceChange={(min, max) => {
              const next = new URLSearchParams(searchParams);
              min ? next.set("minPrice", min) : next.delete("minPrice");
              max ? next.set("maxPrice", max) : next.delete("maxPrice");
              setSearchParams(next, { replace: true });
            }}
            onClear={clearFilters}
          />
        </aside>

        <div>
          <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : data?.products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>

          {!isLoading && data?.products.length === 0 && (
            <div className="py-20 text-center text-sm text-ink-soft">No products match these filters yet.</div>
          )}

          {data && data.meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
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
      </div>

      <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} title="Filters">
        <FilterPanel
          selectedSizes={selectedSizes}
          selectedColors={selectedColors}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onToggleSize={(s) => toggleListParam("size", s, selectedSizes)}
          onToggleColor={(c) => toggleListParam("color", c, selectedColors)}
          onPriceChange={(min, max) => {
            const next = new URLSearchParams(searchParams);
            min ? next.set("minPrice", min) : next.delete("minPrice");
            max ? next.set("maxPrice", max) : next.delete("maxPrice");
            setSearchParams(next, { replace: true });
          }}
          onClear={clearFilters}
        />
      </BottomSheet>
    </div>
  );
}
