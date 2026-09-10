// Shared domain types, mirroring the backend's Mongoose schemas and API.md response shapes 1:1.

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: { field?: string; message: string }[];
}

/* ---------- users ---------- */

export interface Address {
  _id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export type UserRole = "customer" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses: Address[];
  wishlist?: string[] | Product[];
  compareList?: string[] | Product[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ---------- catalogue ---------- */

export interface CategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface Category extends CategoryRef {
  image?: { url: string; publicId: string };
  parentCategory?: string | null;
  displayOrder: number;
  isActive: boolean;
  children?: Category[];
}

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  mrp: number;
  stock: number;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: CategoryRef | string;
  subCategory?: CategoryRef | string | null;
  brand?: string;
  tags: string[];
  images: ProductImage[];
  videos?: { url: string; publicId: string }[];
  variants: ProductVariant[];
  basePrice: number;
  baseMrp: number;
  discountPercent: number;
  totalStock: number;
  inStock: boolean;
  ratingsAverage: number;
  ratingsCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "rating" | "popular" | "discount";
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  inStock?: boolean;
}

/* ---------- reviews ---------- */

export interface Review {
  _id: string;
  product: string;
  user: { _id: string; name: string } | string;
  rating: number;
  comment?: string;
  images?: { url: string }[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export type RatingBreakdown = Record<"1" | "2" | "3" | "4" | "5", number>;

/* ---------- cart ---------- */

export interface CartLineItem {
  _id: string;
  product: { _id: string; name: string; slug: string; image?: string };
  variant: { size: string; color: string; sku: string };
  qty: number;
  price: number;
  priceAtAdd: number;
  priceChanged: boolean;
  stock: number;
  inStock: boolean;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
}

export interface HydratedCart {
  items: CartLineItem[];
  totals: CartTotals;
  removedUnavailable?: number;
}

/* ---------- coupons ---------- */

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "flat" | "percent";
  discountValue: number;
  minOrderValue: number;
  maxDiscountCap?: number | null;
  usageLimit?: number | null;
  perUserLimit: number;
  validFrom?: string;
  validUntil: string;
  isActive: boolean;
}

export interface ApplyCouponResult {
  code: string;
  description?: string;
  discountType: "flat" | "percent";
  subtotal: number;
  discount: number;
  payable: number;
}

/* ---------- orders ---------- */

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod = "razorpay" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  product: string;
  productName: string;
  image?: string;
  variant: { size: string; color: string; sku: string };
  qty: number;
  price: number;
}

export interface ShippingAddressInput {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Courier {
  name?: string;
  awbNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: { _id: string; name: string; email: string; phone: string } | null;
  guestInfo?: { name: string; email: string; phone: string };
  items: OrderItem[];
  shippingAddress: ShippingAddressInput;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  couponApplied?: { code: string; discountValue: number };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    refundId?: string;
    refundedAmount?: number;
    paidAt?: string;
  };
  orderStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  courier?: Courier;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackedOrder {
  orderNumber: string;
  orderStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  courier?: Courier;
  items: { productName: string; variant: OrderItem["variant"]; qty: number; image?: string }[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  placedAt: string;
}

export interface CreateOrderPayload {
  items?: { product: string; sku: string; qty: number }[];
  fromCart?: boolean;
  shippingAddress: ShippingAddressInput;
  addressId?: string;
  guestInfo?: { name: string; email: string; phone: string };
  couponCode?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

/* ---------- payments ---------- */

export interface RazorpayOrderResult {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  orderNumber: string;
  prefill: { name: string; contact: string; email?: string };
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/* ---------- shipping ---------- */

export interface ServiceabilityResult {
  pincode: string;
  serviceable: boolean;
  reason?: string;
  codAvailable?: boolean;
  estimatedDays?: number;
  shippingFee?: number;
  freeShippingThreshold?: number;
}
