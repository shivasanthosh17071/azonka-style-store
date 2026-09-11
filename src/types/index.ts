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
  code?: string;
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
  phone?: string;
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
  _id?: string;
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
  seo?: { metaTitle?: string; metaDescription?: string };
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  category: string;
  subCategory?: string | null;
  brand?: string;
  tags?: string[];
  images: ProductImage[];
  variants: Omit<ProductVariant, "_id">[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
  seo?: { metaTitle?: string; metaDescription?: string };
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
  includeInactive?: boolean;
}

/* ---------- reviews ---------- */

export interface Review {
  _id: string;
  product: string | { _id: string; name: string; slug: string; images: ProductImage[] };
  user: { _id: string; name: string; email?: string } | string;
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

/* ---------- reels ---------- */

export interface ReelProductRef {
  _id: string;
  name: string;
  slug: string;
  images: ProductImage[];
  basePrice: number;
}

export interface Reel {
  _id: string;
  video: { url: string; publicId: string };
  caption?: string;
  product?: ReelProductRef | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReelPayload {
  video: { url: string; publicId: string };
  caption?: string;
  product?: string | null;
  displayOrder?: number;
  isActive?: boolean;
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
  usedCount?: number;
  remainingUses?: number | null;
  isExpired?: boolean;
  validFrom?: string;
  validUntil: string;
  isActive: boolean;
}

export interface CouponPayload {
  code: string;
  description?: string;
  discountType: "flat" | "percent";
  discountValue: number;
  minOrderValue?: number;
  maxDiscountCap?: number | null;
  usageLimit?: number | null;
  perUserLimit?: number;
  validFrom?: string;
  validUntil: string;
  isActive?: boolean;
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

/* ---------- admin: dashboard ---------- */

export const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["out_for_delivery", "returned"],
  out_for_delivery: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

export interface RevenueBucket {
  revenue: number;
  orders: number;
}

export interface DashboardSummary {
  today: RevenueBucket;
  week: RevenueBucket;
  month: RevenueBucket;
  averageOrderValue: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalCustomers: number;
  lifetimeRevenue: number;
}

export interface SalesChartPoint {
  period: string;
  revenue: number;
  orders: number;
  units: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  slug?: string;
  image?: string;
}

export interface CategorySplitRow {
  category: string;
  revenue: number;
  units: number;
}

/* ---------- admin: customers ---------- */

export interface CustomerRow {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  orderCount: number;
  totalSpend: number;
  lastOrderAt?: string;
}

export interface CustomerDetail {
  customer: User;
  orders: Pick<
    Order,
    "_id" | "orderNumber" | "totalAmount" | "orderStatus" | "paymentStatus" | "createdAt" | "items"
  >[];
  stats: { orderCount: number; totalSpend: number; averageOrderValue: number };
}

/* ---------- admin: inventory ---------- */

export interface LowStockRow {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
}

/* ---------- admin: settings ---------- */

export interface StoreSettings {
  _id: string;
  business: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    gstin?: string;
    instagram?: string;
  };
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingBannerText?: string;
  taxPercent: number;
  lowStockThreshold: number;
  codEnabled: boolean;
  codConfirmWindowHours: number;
  nonServiceablePincodes: string[];
  servicePincodePrefixes: string[];
  metroPincodePrefixes: string[];
}

export interface PublicSettings {
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingBannerText: string;
  instagram: string;
}

export interface SettingsResponse {
  settings: StoreSettings;
  paymentKeys: {
    razorpayKeyId: string | null;
    razorpaySecretSet: boolean;
    webhookSecretSet: boolean;
  };
}

/* ---------- admin: uploads ---------- */

export interface UploadedFile {
  url: string;
  publicId: string;
  bytes?: number;
  format?: string;
}
