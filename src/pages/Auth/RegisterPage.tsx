import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { errorMessage } from "@/lib/api/client";

// Mirrors the backend's zod rules exactly (backend/src/validators/common.js) so a user
// never gets past client-side checks only to be rejected by the server with a vague 422.
const EMAIL_RE = /^\S+@\S+\.\S+$/;
const hasLetter = (s: string) => /[a-zA-Z]/.test(s);
const hasDigit = (s: string) => /\d/.test(s);

export function RegisterPage() {
  const { register } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (form.name.trim().length < 2) return "Enter your full name";
    if (!EMAIL_RE.test(form.email)) return "Enter a valid email address";
    if (form.password.length < 8 || form.password.length > 72)
      return "Password must be 8-72 characters";
    if (!hasLetter(form.password) || !hasDigit(form.password))
      return "Password must contain at least one letter and one number";
    if (form.password !== form.confirmPassword) return "Passwords don't match";
    return null;
  };

  const submit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      await cart.mergeGuestCartIntoServer();
      toast.success("Account created — check your email to verify it");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(errorMessage(err, "Could not create account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-4xl font-semibold text-ink">
          Create an account
        </h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Faster checkout, order tracking and a saved wishlist.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-ink-soft">
              At least 8 characters, with a letter and a number.
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="mt-1"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
          <Button
            onClick={submit}
            disabled={loading}
            className="h-11 w-full rounded-none bg-brick hover:bg-brick-dark"
          >
            Create account
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brick underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
