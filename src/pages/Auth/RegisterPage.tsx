import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { ApiException } from "@/lib/api/client";

export function RegisterPage() {
  const { register } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || form.phone.length !== 10 || form.password.length < 8) {
      toast.error("Fill in all fields — password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      await cart.mergeGuestCartIntoServer();
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-4xl font-semibold text-ink">Create an account</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">Faster checkout, order tracking and a saved wishlist.</p>

        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Mobile number</Label>
            <Input
              id="phone"
              inputMode="numeric"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1" />
          </div>
          <Button onClick={submit} disabled={loading} className="h-11 w-full rounded-none bg-brick hover:bg-brick-dark">
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
