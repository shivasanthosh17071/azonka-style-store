import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as authApi from "@/lib/api/auth.api";
import { errorMessage } from "@/lib/api/client";
import { useAuth } from "@/context/AuthProvider";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }
    authApi
      .verifyEmail(token)
      .then(async () => {
        setStatus("success");
        await refreshUser().catch(() => {});
      })
      .catch((err) => {
        setStatus("error");
        setMessage(errorMessage(err, "This verification link is invalid or has expired."));
      });
    // Only run once per token — refreshUser/authApi are stable enough for this one-shot effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="section-wrap flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {status === "verifying" && <p className="text-sm text-ink-soft">Verifying your email…</p>}

      {status === "success" && (
        <>
          <CheckCircle2 className="size-12 text-brick" />
          <p className="mt-6 font-display text-3xl">Email verified</p>
          <p className="mt-2 text-sm text-ink-soft">Your account is all set.</p>
          <Button asChild className="mt-6 rounded-none bg-ink text-xs uppercase tracking-[0.15em] hover:bg-brick">
            <Link to="/account/profile">Go to my account</Link>
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="size-12 text-destructive" />
          <p className="mt-6 font-display text-3xl">Verification failed</p>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">{message}</p>
          <Button asChild variant="outline" className="mt-6 rounded-none">
            <Link to="/account/profile">Go to my account</Link>
          </Button>
        </>
      )}
    </div>
  );
}
