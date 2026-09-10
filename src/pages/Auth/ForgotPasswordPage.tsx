import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as authApi from "@/lib/api/auth.api";
import { errorMessage } from "@/lib/api/client";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!email) {
      toast.error("Enter your email address");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      // Backend intentionally responds the same way whether or not the email exists —
      // an error here means something actually went wrong (rate limit, network), not "no such account".
      toast.error(errorMessage(err, "Could not send reset email"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-4xl font-semibold text-ink">Forgot password</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          {sent
            ? "If that email is registered, a reset link has been sent — check your inbox."
            : "Enter your account email and we'll send you a reset link."}
        </p>

        {!sent ? (
          <div className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" onKeyDown={(e) => e.key === "Enter" && submit()} />
            </div>
            <Button onClick={submit} disabled={loading} className="h-11 w-full rounded-none bg-brick hover:bg-brick-dark">
              Send reset link
            </Button>
          </div>
        ) : (
          <Button asChild className="mt-8 h-11 w-full rounded-none bg-ink hover:bg-brick">
            <Link to="/login">Back to login</Link>
          </Button>
        )}

        <p className="mt-8 text-center text-sm text-ink-soft">
          Already have a reset token?{" "}
          <Link to="/reset-password" className="font-semibold text-brick underline">
            Reset your password
          </Link>
        </p>
      </div>
    </div>
  );
}
