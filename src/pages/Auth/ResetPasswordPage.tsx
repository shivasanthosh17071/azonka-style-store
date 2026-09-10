import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as authApi from "@/lib/api/auth.api";
import { errorMessage } from "@/lib/api/client";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!token) {
      toast.error("Paste the reset token from your email");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      toast.success("Password updated — log in with your new password");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(errorMessage(err, "Reset token is invalid or has expired"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-4xl font-semibold text-ink">Reset password</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">Paste the token from your email and choose a new password.</p>

        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="token">Reset token</Label>
            <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1" onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          <Button onClick={submit} disabled={loading} className="h-11 w-full rounded-none bg-brick hover:bg-brick-dark">
            Reset password
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-ink-soft">
          Need a new token?{" "}
          <Link to="/forgot-password" className="font-semibold text-brick underline">
            Request another
          </Link>
        </p>
      </div>
    </div>
  );
}
