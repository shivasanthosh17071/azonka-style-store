import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/common/StarRating";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();
  const wished = isWishlisted(product._id);

  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const sizeHasStock = (size: string) =>
    product.variants.some((v) => v.size === size && v.isActive && v.stock > 0);

  const categoryName = typeof product.category === "object" ? product.category.name : "";

  const onWishlistClick = () => {
    const ok = toggle(product._id);
    if (!ok) navigate("/login");
  };

  return (
    <article className="group min-w-0">
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-sand">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          loading="lazy"
          width={900}
          height={900}
          className="aspect-square w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        {product.images[1] && (
          <img
            src={product.images[1].url}
            alt=""
            aria-hidden
            loading="lazy"
            width={900}
            height={900}
            className="absolute inset-0 aspect-square w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {product.discountPercent > 0 && (
          <span className="absolute left-3 top-3 bg-brick px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
            Sale
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            onWishlistClick();
          }}
          className="absolute right-2 top-2 bg-background/85 text-ink hover:bg-background hover:text-brick"
        >
          <Heart className={`size-4 ${wished ? "fill-brick text-brick" : ""}`} />
        </Button>
      </Link>
      <div className="pt-4">
        {categoryName && <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{categoryName}</p>}
        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-1.5 text-sm font-semibold text-ink hover:text-brick">{product.name}</h3>
        </Link>
        <div className="mt-2">
          <StarRating value={product.ratingsAverage} count={product.ratingsCount} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brick">{formatPrice(product.basePrice)}</span>
          {product.discountPercent > 0 && (
            <>
              <span className="text-xs text-ink-soft line-through">{formatPrice(product.baseMrp)}</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-brick">{product.discountPercent}% off</span>
            </>
          )}
        </div>
        {sizes.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5" aria-label="Available sizes">
            {sizes.map((size) => (
              <span
                key={size}
                className={`grid size-6 place-items-center border text-[10px] font-medium ${
                  sizeHasStock(size) ? "border-line text-ink-soft" : "border-line text-ink-soft/40"
                }`}
              >
                {size}
              </span>
            ))}
          </div>
        )}
        <Button
          asChild
          className="mt-4 h-10 w-full rounded-none bg-ink text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground hover:bg-brick"
        >
          <Link to={`/product/${product.slug}`}>{product.inStock ? "Select options" : "Sold out"}</Link>
        </Button>
      </div>
    </article>
  );
}
