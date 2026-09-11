import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import * as authApi from "@/lib/api/auth.api";
import { ApiException, errorMessage } from "@/lib/api/client";

// Mirrors the backend's zod rules exactly (backend/src/validators/common.js) so a user
// never gets past client-side checks only to be rejected by the server with a vague 422.
const EMAIL_RE = /^\S+@\S+\.\S+$/;
const hasLetter = (s: string) => /[a-zA-Z]/.test(s);
const hasDigit = (s: string) => /\d/.test(s);

type FieldErrors = Partial<Record<"name" | "email" | "password" | "confirmPassword", string>>;

export function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (form.name.trim().length < 2) errors.name = "Enter your full name";
    if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address";
    if (form.password.length < 8 || form.password.length > 72) {
      errors.password = "Password must be 8-72 characters";
    } else if (!hasLetter(form.password) || !hasDigit(form.password)) {
      errors.password = "Password must contain at least one letter and one number";
    }
    if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords don't match";
    return errors;
  };

  const submit = async () => {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      const email = form.email.trim().toLowerCase();
      await register({ name: form.name.trim(), email, password: form.password });
      setSentTo(email);
    } catch (err) {
      if (err instanceof ApiException && err.status === 409) {
        setFieldErrors({ email: err.message });
      } else {
        toast.error(errorMessage(err, "Could not create account"));
      }
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!sentTo) return;
    setResending(true);
    try {
      await authApi.resendVerificationEmail({ email: sentTo });
      toast.success("Verification email sent again");
    } catch (err) {
      toast.error(errorMessage(err, "Could not resend the email"));
    } finally {
      setResending(false);
    }
  };

  if (sentTo) {
    return (
      <div className="section-wrap flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="size-12 text-brick" />
        <h1 className="mt-6 font-display text-3xl">Check your inbox</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          We sent a verification link to <span className="font-semibold text-ink">{sentTo}</span>.
          Click it to activate your account — you'll need to verify before you can log in.
        </p>
        <Button
          onClick={resend}
          disabled={resending}
          variant="outline"
          className="mt-6 rounded-none text-xs uppercase tracking-[0.15em]"
        >
          Resend verification email
        </Button>
        <Button asChild className="mt-3 h-11 w-full max-w-sm rounded-none bg-ink hover:bg-brick">
          <Link to="/login">Back to login</Link>
        </Button>
      </div>
    );
  }

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
              aria-invalid={!!fieldErrors.name}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1"
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1"
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password ? (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>
            ) : (
              <p className="mt-1 text-xs text-ink-soft">
                At least 8 characters, with a letter and a number.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="mt-1"
              aria-invalid={!!fieldErrors.confirmPassword}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.confirmPassword}</p>
            )}
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
