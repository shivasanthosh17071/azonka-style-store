import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, Minus, Plus, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StarRating } from "@/components/common/StarRating";
import { ProductCard } from "@/components/common/ProductCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { Loader } from "@/components/common/Loader";
import { useProduct, useRelatedProducts } from "@/hooks/queries/useProducts";
import { useReviews, useCreateReview } from "@/hooks/queries/useReviews";
import { useCheckServiceability } from "@/hooks/queries/useMisc";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/context/AuthProvider";
import { useCartUI } from "@/context/CartUIProvider";
import { formatDate, formatPrice } from "@/lib/format";
import { errorMessage } from "@/lib/api/client";

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, refetch: refetchProduct } = useProduct(slug);
  const { data: related } = useRelatedProducts(product?._id);
  const { data: reviewData } = useReviews(product?._id);
  const cart = useCart();
  const wishlist = useWishlist();
  const { isAuthenticated } = useAuth();
  const { openDrawer } = useCartUI();

  const colors = useMemo(
    () => Array.from(new Set(product?.variants.map((v) => v.color) || [])),
    [product],
  );
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [pincode, setPincode] = useState("");
  const serviceability = useCheckServiceability();

  useEffect(() => {
    if (product && !selectedColor) setSelectedColor(colors[0] || null);
  }, [product, colors, selectedColor]);

  if (isLoading) {
    return <Loader />;
  }
  if (!product) {
    return (
      <div className="section-wrap py-16 text-center text-sm text-ink-soft">Product not found.</div>
    );
  }

  const sizesForColor = product.variants.filter((v) => v.color === selectedColor);
  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  );
  const maxQty = Math.min(20, selectedVariant?.stock ?? 20);
  const wished = wishlist.isWishlisted(product._id);

  const addToCart = async () => {
    if (!selectedVariant) return false;

    // The guest cart is local-only (never touches the server), so it never gets the
    // stock/isActive re-check that the authenticated add-to-cart endpoint already does
    // (cart.controller.js). Refetch the product right before adding to catch a variant
    // that's sold out (or gone) since this page loaded.
    if (!isAuthenticated) {
      const { data: fresh } = await refetchProduct();
      const freshVariant = fresh?.variants.find((v) => v.sku === selectedVariant.sku);
      if (!freshVariant?.isActive || freshVariant.stock < qty) {
        toast.error("Sorry, that size just sold out.");
        return false;
      }
    }

    try {
      await cart.addItem({
        productId: product._id,
        sku: selectedVariant.sku,
        qty,
        snapshot: {
          name: product.name,
          slug: product.slug,
          image: product.images[0]?.url,
          size: selectedVariant.size,
          color: selectedVariant.color,
          price: selectedVariant.price,
        },
      });
      return true;
    } catch {
      // useCart's addItem already toasts the specific reason (e.g. "Only 2 left in stock").
      return false;
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      if (await addToCart()) openDrawer();
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setAdding(true);
    try {
      if (await addToCart()) navigate("/checkout");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="section-wrap py-10 sm:py-16">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-14">
        <div>
          <div className="overflow-hidden bg-sand">
            <img
              src={product.images[activeImage]?.url}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(i)}
                  className={`size-16 shrink-0 overflow-hidden border-2 ${i === activeImage ? "border-brick" : "border-transparent"}`}
                >
                  <img src={img.url} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {typeof product.category === "object" && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-2">
            <StarRating value={product.ratingsAverage} count={product.ratingsCount} size="md" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-brick">
              {formatPrice(selectedVariant?.price ?? product.basePrice)}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-sm text-ink-soft line-through">
                  {formatPrice(selectedVariant?.mrp ?? product.baseMrp)}
                </span>
                <span className="text-xs font-bold uppercase text-brick">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          {colors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                Colour: {selectedColor}
              </h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {colors.map((color) => {
                  const swatch = product.variants.find((v) => v.color === color)?.colorHex;
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize(null);
                      }}
                      className={`size-8 rounded-full border-2 ${selectedColor === color ? "border-brick" : "border-line"}`}
                      style={{ backgroundColor: swatch || "#ccc" }}
                      aria-label={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">Size</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizesForColor.map((v) => (
                <button
                  key={v.sku}
                  disabled={!v.isActive || v.stock === 0}
                  onClick={() => {
                    setSelectedSize(v.size);
                    setQty(1);
                  }}
                  className={`grid h-10 min-w-10 place-items-center border px-3 text-xs font-medium ${
                    selectedSize === v.size
                      ? "border-brick bg-brick text-primary-foreground"
                      : "border-line text-ink-soft"
                  } ${!v.isActive || v.stock === 0 ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {selectedVariant && selectedVariant.stock <= 5 && (
              <p className="mt-2 text-xs font-medium text-brick">
                Only {selectedVariant.stock} left in stock
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-line">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-10 place-items-center text-ink-soft"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                className="grid size-10 place-items-center text-ink-soft"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => (wishlist.toggle(product._id) ? null : navigate("/login"))}
            >
              <Heart className={`size-5 ${wished ? "fill-brick text-brick" : "text-ink"}`} />
            </Button>
          </div>

          <div className="mt-6 hidden gap-3 sm:flex">
            <Button
              disabled={!selectedVariant || adding}
              onClick={handleAddToCart}
              className="h-12 flex-1 rounded-none bg-ink text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-brick"
            >
              {/* {console.log(selectedVariant)} */}
              {selectedVariant ? "Add to cart" : "Select a size"}
            </Button>
            <Button
              disabled={!selectedVariant || adding}
              onClick={handleBuyNow}
              variant="outline"
              className="h-12 flex-1 rounded-none border-brick text-[11px] font-bold uppercase tracking-[0.14em] text-brick hover:bg-brick/10"
            >
              Buy now
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-2 border border-line p-4">
            <Truck className="size-4 shrink-0 text-brick" />
            <Input
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="h-9 rounded-none"
            />
            <Button
              variant="outline"
              className="h-9 shrink-0 rounded-none"
              disabled={pincode.length !== 6}
              onClick={() => serviceability.mutate(pincode)}
            >
              Check
            </Button>
          </div>
          {serviceability.data && (
            <p className="mt-2 text-xs text-ink-soft">
              {serviceability.data.serviceable
                ? `Delivers in ~${serviceability.data.estimatedDays} days${serviceability.data.codAvailable ? " · COD available" : ""}`
                : serviceability.data.reason}
            </p>
          )}

          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="text-ink-soft">{product.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="size-chart">
              <AccordionTrigger>Size chart</AccordionTrigger>
              <AccordionContent className="text-ink-soft">
                Fits true to size. S: 38&quot; chest · M: 40&quot; · L: 42&quot; · XL: 44&quot; ·
                XXL: 46&quot;. Measured flat, laid across the chest.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>Care instructions</AccordionTrigger>
              <AccordionContent className="text-ink-soft">
                Machine wash cold with like colours. Do not bleach. Tumble dry low. Warm iron if
                needed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-20 flex gap-3 border-t border-line bg-background p-3 sm:hidden">
        <Button
          disabled={!selectedVariant || adding}
          onClick={handleAddToCart}
          className="h-11 flex-1 rounded-none bg-ink text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-brick"
        >
          {selectedVariant ? "Add to cart" : "Select a size"}
        </Button>
        <Button
          disabled={!selectedVariant || adding}
          onClick={handleBuyNow}
          className="h-11 flex-1 rounded-none bg-brick text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-brick-dark"
        >
          Buy now
        </Button>
      </div>

      <ReviewsSection
        productId={product._id}
        isAuthenticated={isAuthenticated}
        reviews={reviewData}
      />

      {related && related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-3xl font-semibold text-ink">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsSection({
  productId,
  isAuthenticated,
  reviews,
}: {
  productId: string;
  isAuthenticated: boolean;
  reviews: ReturnType<typeof useReviews>["data"];
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview(productId);

  const submit = () => {
    createReview.mutate(
      { rating, comment },
      {
        onSuccess: () => setComment(""),
        onError: (err) => toast.error(errorMessage(err, "Could not submit your review")),
      },
    );
  };

  return (
    <div className="mt-20 border-t border-line pt-12">
      <h2 className="font-display text-3xl font-semibold text-ink">Customer reviews</h2>
      {reviews && reviews.reviews.length === 0 && (
        <p className="mt-4 text-sm text-ink-soft">No reviews yet — be the first.</p>
      )}
      <div className="mt-6 grid gap-4">
        {reviews?.reviews.map((r) => (
          <div key={r._id} className="border-b border-line pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">
                {typeof r.user === "object" ? r.user.name : "Customer"}
              </p>
              <StarRating value={r.rating} />
            </div>
            {r.isVerifiedPurchase && (
              <p className="text-[10px] font-semibold uppercase text-brick">Verified purchase</p>
            )}
            {r.comment && <p className="mt-2 text-sm text-ink-soft">{r.comment}</p>}
            <p className="mt-1 text-xs text-ink-soft/70">{formatDate(r.createdAt)}</p>
          </div>
        ))}
      </div>

      {isAuthenticated && reviews?.viewerCanReview ? (
        <div className="mt-8 max-w-md">
          <h3 className="text-sm font-bold">Write a review</h3>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                <Star className={`size-6 ${n <= rating ? "fill-brick text-brick" : "text-line"}`} />
              </button>
            ))}
          </div>
          <Textarea
            className="mt-3"
            placeholder="Share your thoughts on the fit, fabric and quality…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            onClick={submit}
            disabled={createReview.isPending}
            className="mt-3 rounded-none bg-ink hover:bg-brick"
          >
            Submit review
          </Button>
        </div>
      ) : isAuthenticated ? (
        <p className="mt-6 text-sm text-ink-soft">
          Only customers who've received this product can write a review.
        </p>
      ) : (
        <p className="mt-6 text-sm text-ink-soft">
          <a href="/login" className="font-semibold text-brick underline">
            Log in
          </a>{" "}
          to leave a review.
        </p>
      )}
    </div>
  );
}
