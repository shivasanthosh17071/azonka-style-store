import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as authApi from "@/lib/api/auth.api";
import { errorMessage } from "@/lib/api/client";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }
    authApi
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage(errorMessage(err, "This verification link is invalid or has expired."));
      });
  }, [token]);

  const resend = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }
    setResending(true);
    try {
      await authApi.resendVerificationEmail({ email: email.trim().toLowerCase() });
      toast.success("If that email is registered and unverified, a new link is on its way");
    } catch (err) {
      toast.error(errorMessage(err, "Could not send the email"));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="section-wrap flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {status === "verifying" && <p className="text-sm text-ink-soft">Verifying your email…</p>}

      {status === "success" && (
        <>
          <CheckCircle2 className="size-12 text-brick" />
          <p className="mt-6 font-display text-3xl">Email verified</p>
          <p className="mt-2 text-sm text-ink-soft">You can now log in to your account.</p>
          <Button
            asChild
            className="mt-6 rounded-none bg-ink text-xs uppercase tracking-[0.15em] hover:bg-brick"
          >
            <Link to="/login">Go to login</Link>
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="size-12 text-destructive" />
          <p className="mt-6 font-display text-3xl">Verification failed</p>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">{message}</p>

          <div className="mt-6 w-full max-w-xs space-y-3 text-left">
            <div>
              <Label htmlFor="resend-email">Request a new link</Label>
              <Input
                id="resend-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && resend()}
              />
            </div>
            <Button
              onClick={resend}
              disabled={resending}
              className="h-11 w-full rounded-none bg-ink hover:bg-brick"
            >
              Resend verification email
            </Button>
          </div>

          <Button asChild variant="outline" className="mt-4 rounded-none">
            <Link to="/login">Back to login</Link>
          </Button>
        </>
      )}
    </div>
  );
}
