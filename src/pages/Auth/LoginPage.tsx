import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { errorMessage } from "@/lib/api/client";

export function LoginPage() {
  const { login } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      toast.error("Enter your email and password");
      return;
    }
    setLoading(true);
    try {
      await login(identifier, password);
      await cart.mergeGuestCartIntoServer();
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(errorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-4xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">Log in to check out faster and track your orders.</p>

        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="identifier">Email</Label>
            <Input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-1" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-brick underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <Button onClick={handleLogin} disabled={loading} className="h-11 w-full rounded-none bg-ink hover:bg-brick">
            Log in
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-ink-soft">
          New here?{" "}
          <Link to="/register" className="font-semibold text-brick underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
