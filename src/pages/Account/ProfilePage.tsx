import { useState } from "react";
import { toast } from "sonner";
import { MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import * as usersApi from "@/lib/api/users.api";
import * as authApi from "@/lib/api/auth.api";
import { errorMessage } from "@/lib/api/client";

export function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await usersApi.updateProfile(form);
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(errorMessage(err, "Could not update profile"));
    } finally {
      setSaving(false);
    }
  };

  const resendVerification = async () => {
    setResending(true);
    try {
      await authApi.resendVerificationEmail();
      toast.success("Verification email sent — check your inbox");
    } catch (err) {
      toast.error(errorMessage(err, "Could not send verification email"));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
      {user && !user.isEmailVerified && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-brick/30 bg-brick/5 p-4">
          <div className="flex items-center gap-2 text-sm text-ink">
            <MailWarning className="size-4 shrink-0 text-brick" />
            Your email isn't verified yet.
          </div>
          <Button variant="outline" size="sm" onClick={resendVerification} disabled={resending} className="rounded-none">
            Resend verification email
          </Button>
        </div>
      )}

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="mt-1" />
      </div>
      <Button onClick={save} disabled={saving} className="rounded-none bg-ink hover:bg-brick">
        Save changes
      </Button>
      <Button variant="outline" onClick={() => logout()} className="ml-3 rounded-none sm:hidden">
        Log out
      </Button>
    </div>
  );
}
