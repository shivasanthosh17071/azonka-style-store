import { Outlet } from "react-router-dom";
import { TopUtilityBar } from "@/components/layout/TopUtilityBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { CartDrawer } from "@/components/layout/CartDrawer";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background pb-16 text-ink sm:pb-0">
      <TopUtilityBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
      <BottomTabBar />
      <CartDrawer />
    </div>
  );
}
