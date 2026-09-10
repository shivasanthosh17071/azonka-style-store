import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-ink">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-ink">Page not found</h2>
        <p className="mt-2 text-sm text-ink-soft">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="mt-6 rounded-none bg-ink text-xs uppercase tracking-[0.15em] hover:bg-brick">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
