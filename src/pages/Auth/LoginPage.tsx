import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/hooks/useCart";
import * as authApi from "@/lib/api/auth.api";
import { ApiException } from "@/lib/api/client";

export function LoginPage() {
  const { login, loginWithOtp } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const afterLogin = async () => {
    await cart.mergeGuestCartIntoServer();
    navigate(from, { replace: true });
  };

  const handlePasswordLogin = async () => {
    setPasswordLoading(true);
    try {
      await login(identifier, password);
      await afterLogin();
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Login failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) return;
    setOtpLoading(true);
    try {
      const res = await authApi.sendOtp({ phone, purpose: "login" });
      setOtpSent(true);
      toast.success(res.devOtp ? `OTP sent (dev: ${res.devOtp})` : "OTP sent to your phone");
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Could not send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setOtpLoading(true);
    try {
      await loginWithOtp(phone, otp);
      await afterLogin();
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="section-wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-4xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">Log in to check out faster and track your orders.</p>

        <Tabs defaultValue="otp" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 rounded-none bg-sand">
            <TabsTrigger value="otp" className="rounded-none">
              Mobile OTP
            </TabsTrigger>
            <TabsTrigger value="password" className="rounded-none">
              Email & password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="otp" className="mt-6 space-y-4">
            <div>
              <Label htmlFor="phone">Mobile number</Label>
              <Input
                id="phone"
                inputMode="numeric"
                placeholder="98765 43210"
                value={phone}
                disabled={otpSent}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="mt-1"
              />
            </div>

            {!otpSent ? (
              <Button onClick={handleSendOtp} disabled={phone.length !== 10 || otpLoading} className="h-11 w-full rounded-none bg-ink hover:bg-brick">
                Send OTP
              </Button>
            ) : (
              <>
                <div>
                  <Label>Enter 6-digit OTP</Label>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="mt-2 justify-center">
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || otpLoading} className="h-11 w-full rounded-none bg-brick hover:bg-brick-dark">
                  Verify & continue
                </Button>
                <button onClick={() => setOtpSent(false)} className="w-full text-center text-xs text-ink-soft underline">
                  Change number / resend
                </button>
              </>
            )}
          </TabsContent>

          <TabsContent value="password" className="mt-6 space-y-4">
            <div>
              <Label htmlFor="identifier">Email or phone</Label>
              <Input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </div>
            <Button onClick={handlePasswordLogin} disabled={passwordLoading} className="h-11 w-full rounded-none bg-ink hover:bg-brick">
              Log in
            </Button>
          </TabsContent>
        </Tabs>

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
