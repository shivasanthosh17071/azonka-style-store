import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { RequireAuth } from "@/routes/RequireAuth";
import { RequireAdmin } from "@/routes/RequireAdmin";
import { HomePage } from "@/pages/Home/HomePage";
import { ShopPage } from "@/pages/Shop/ShopPage";
import { ProductDetailPage } from "@/pages/Product/ProductDetailPage";
import { CartPage } from "@/pages/Cart/CartPage";
import { CheckoutPage } from "@/pages/Checkout/CheckoutPage";
import { OrderConfirmationPage } from "@/pages/OrderConfirmation/OrderConfirmationPage";
import { LoginPage } from "@/pages/Auth/LoginPage";
import { RegisterPage } from "@/pages/Auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/Auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/Auth/ResetPasswordPage";
import { VerifyEmailPage } from "@/pages/Auth/VerifyEmailPage";
import { AccountLayout } from "@/pages/Account/AccountLayout";
import { ProfilePage } from "@/pages/Account/ProfilePage";
import { AddressesPage } from "@/pages/Account/AddressesPage";
import { OrdersListPage } from "@/pages/Account/OrdersListPage";
import { OrderDetailPage } from "@/pages/Account/OrderDetailPage";
import { WishlistPage } from "@/pages/Account/WishlistPage";
import { TrackOrderPage } from "@/pages/TrackOrder/TrackOrderPage";
import { AboutPage } from "@/pages/Static/AboutPage";
import { ContactPage } from "@/pages/Static/ContactPage";
import { FaqPage } from "@/pages/Static/FaqPage";
import { PolicyPage } from "@/pages/Static/PolicyPage";
import { NotFoundPage } from "@/pages/NotFound/NotFoundPage";
import { Loader } from "@/components/common/Loader";

// Admin is a large, separate chunk (charts + every admin page) that regular storefront
// visitors never need — lazy-loaded so it never ships in their initial bundle.
const AdminLayout = lazy(() =>
  import("@/layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const DashboardPage = lazy(() =>
  import("@/pages/Admin/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ProductsListPage = lazy(() =>
  import("@/pages/Admin/Products/ProductsListPage").then((m) => ({ default: m.ProductsListPage })),
);
const ProductFormPage = lazy(() =>
  import("@/pages/Admin/Products/ProductFormPage").then((m) => ({ default: m.ProductFormPage })),
);
const AdminOrdersListPage = lazy(() =>
  import("@/pages/Admin/Orders/OrdersListPage").then((m) => ({ default: m.OrdersListPage })),
);
const AdminOrderDetailPage = lazy(() =>
  import("@/pages/Admin/Orders/OrderDetailPage").then((m) => ({ default: m.OrderDetailPage })),
);
const CustomersListPage = lazy(() =>
  import("@/pages/Admin/Customers/CustomersListPage").then((m) => ({
    default: m.CustomersListPage,
  })),
);
const CustomerDetailPage = lazy(() =>
  import("@/pages/Admin/Customers/CustomerDetailPage").then((m) => ({
    default: m.CustomerDetailPage,
  })),
);
const CouponsPage = lazy(() =>
  import("@/pages/Admin/Coupons/CouponsPage").then((m) => ({ default: m.CouponsPage })),
);
const CategoriesPage = lazy(() =>
  import("@/pages/Admin/Categories/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);
const ReviewsPage = lazy(() =>
  import("@/pages/Admin/Reviews/ReviewsPage").then((m) => ({ default: m.ReviewsPage })),
);
const InventoryPage = lazy(() =>
  import("@/pages/Admin/Inventory/InventoryPage").then((m) => ({ default: m.InventoryPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/Admin/Settings/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);

function AdminFallback() {
  return <Loader fullScreen className="bg-paper" />;
}

export default function App() {
  return (
    <Routes>
      {/* Admin dashboard — its own sidebar layout, deliberately outside RootLayout so the
          customer-facing header/footer/cart-drawer/bottom-tab-bar never render here, and
          lazy-loaded so the storefront's own bundle never grows because of it. */}
      <Route
        path="admin"
        element={
          <RequireAdmin>
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          </RequireAdmin>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsListPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:slug" element={<ProductFormPage />} />
        <Route path="orders" element={<AdminOrdersListPage />} />
        <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
        <Route path="customers" element={<CustomersListPage />} />
        <Route path="customers/:customerId" element={<CustomerDetailPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:categorySlug" element={<ShopPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route
          path="checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route
          path="account"
          element={
            <RequireAuth>
              <AccountLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>
        <Route path="track-order" element={<TrackOrderPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="policies/:policySlug" element={<PolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
