import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { RequireAuth } from "@/routes/RequireAuth";
import { HomePage } from "@/pages/Home/HomePage";
import { ShopPage } from "@/pages/Shop/ShopPage";
import { ProductDetailPage } from "@/pages/Product/ProductDetailPage";
import { CartPage } from "@/pages/Cart/CartPage";
import { CheckoutPage } from "@/pages/Checkout/CheckoutPage";
import { OrderConfirmationPage } from "@/pages/OrderConfirmation/OrderConfirmationPage";
import { LoginPage } from "@/pages/Auth/LoginPage";
import { RegisterPage } from "@/pages/Auth/RegisterPage";
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

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:categorySlug" element={<ShopPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
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
