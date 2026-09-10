import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  FolderTree,
  Star,
  AlertTriangle,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";

const NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Coupons", to: "/admin/coupons", icon: Ticket },
  { label: "Categories", to: "/admin/categories", icon: FolderTree },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Inventory", to: "/admin/inventory", icon: AlertTriangle },
  { label: "Settings", to: "/admin/settings", icon: SettingsIcon },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="font-display text-2xl font-bold text-primary-foreground">
          RAGYAI<span className="text-brick">_m</span>
        </p>
        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/50">Admin</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brick text-primary-foreground"
                  : "text-primary-foreground/65 hover:bg-white/5 hover:text-primary-foreground"
              }`
            }
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-primary-foreground/65 hover:text-primary-foreground"
        >
          <ExternalLink className="size-3.5" /> View store
        </a>
        <div className="mt-2 flex items-center justify-between px-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-primary-foreground">{user?.name}</p>
            <p className="truncate text-[10px] text-primary-foreground/50">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Log out" onClick={() => logout()} className="text-primary-foreground/65 hover:text-primary-foreground">
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-ink sm:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink/40 sm:hidden" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-72 bg-ink shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-3">
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-primary-foreground">
                <X className="size-5" />
              </Button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="sm:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-background/95 px-4 backdrop-blur sm:hidden">
          <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <p className="font-display text-lg font-bold">
            RAGYAI<span className="text-brick">_m</span> Admin
          </p>
        </header>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
