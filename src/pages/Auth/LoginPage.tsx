import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/hooks/useCart";
import * as authApi from "@/lib/api/auth.api";
import { ApiException, errorMessage } from "@/lib/api/client";

export function LoginPage() {
  const { login } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async () => {
    setUnverified(false);
    setFormError(null);
    if (!identifier || !password) {
      setFormError("Enter your email and password");
      return;
    }
    setLoading(true);
    try {
      await login(identifier, password);
      await cart.mergeGuestCartIntoServer();
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiException && err.code === "EMAIL_NOT_VERIFIED") {
        setUnverified(true);
      } else {
        toast.error(errorMessage(err, "Login failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!identifier.includes("@")) return;
    setResending(true);
    try {
      await authApi.resendVerificationEmail({ email: identifier.trim().toLowerCase() });
      toast.success("Verification email sent — check your inbox");
    } catch (err) {
      toast.error(errorMessage(err, "Could not resend the email"));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="section-wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-4xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Log in to check out faster and track your orders.
        </p>

        {unverified && (
          <div className="mt-6 border border-brick/30 bg-brick/5 p-4 text-sm text-ink">
            <p>Your email isn't verified yet. Check your inbox for the verification link.</p>
            {identifier.includes("@") && (
              <button
                type="button"
                onClick={resend}
                disabled={resending}
                className="mt-2 font-semibold text-brick underline disabled:opacity-60"
              >
                Resend verification email
              </button>
            )}
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="identifier">Email</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1"
            />
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
          {formError && <p className="text-xs text-destructive">{formError}</p>}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="h-11 w-full rounded-none bg-ink hover:bg-brick"
          >
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
