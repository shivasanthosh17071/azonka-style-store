import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-sm text-ink-soft">Loading…</div>;
  }
  if (status === "guest") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <p className="font-display text-3xl text-ink">Access denied</p>
        <p className="max-w-sm text-sm text-ink-soft">
          This account doesn't have admin access. Log in with a store-owner account to use the dashboard.
        </p>
        <Link to="/" className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-brick underline">
          Back to store
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
