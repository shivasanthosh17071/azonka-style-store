import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import * as usersApi from "@/lib/api/users.api";
import { ApiException } from "@/lib/api/client";

export function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await usersApi.updateProfile(form);
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
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
