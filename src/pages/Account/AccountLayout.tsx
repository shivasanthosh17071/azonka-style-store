import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Profile", to: "/account/profile" },
  { label: "Addresses", to: "/account/addresses" },
  { label: "Orders", to: "/account/orders" },
  { label: "Wishlist", to: "/account/wishlist" },
];

export function AccountLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="section-wrap py-12 sm:py-16">
      <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">My account</h1>
      {user && <p className="mt-2 text-sm text-ink-soft">{user.name} · {user.email}</p>}

      <div className="mt-10 grid gap-10 sm:grid-cols-[200px_1fr]">
        <aside>
          <nav className="flex gap-2 overflow-x-auto sm:grid sm:gap-1 sm:overflow-visible">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `shrink-0 border-b-2 px-1 py-2 text-xs font-bold uppercase tracking-[0.12em] sm:border-b-0 sm:border-l-2 sm:px-3 ${
                    isActive ? "border-brick text-brick" : "border-transparent text-ink-soft hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Button variant="outline" onClick={() => logout()} className="mt-6 hidden w-full rounded-none sm:flex">
            Log out
          </Button>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
