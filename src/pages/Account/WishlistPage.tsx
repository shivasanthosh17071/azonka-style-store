import { Link } from "react-router-dom";
import { ProductCard } from "@/components/common/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";

export function WishlistPage() {
  const { products, isLoading } = useWishlist();

  if (isLoading) return <p className="text-sm text-ink-soft">Loading…</p>;

  if (!products.length) {
    return (
      <div className="border border-line p-8 text-center">
        <p className="text-sm text-ink-soft">Your wishlist is empty.</p>
        <Link to="/shop" className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.14em] text-brick underline">
          Discover pieces you'll love
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
