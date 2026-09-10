import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAdminSettings, useUpdateSettings } from "@/hooks/queries/useAdmin";
import { ApiException } from "@/lib/api/client";
import type { StoreSettings } from "@/types";

const toCsv = (arr: string[] | undefined) => (arr || []).join(", ");
const fromCsv = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);

export function SettingsPage() {
  const { data, isLoading } = useAdminSettings();
  const updateSettings = useUpdateSettings();

  const [form, setForm] = useState<Partial<StoreSettings> | null>(null);
  const [pincodeCsv, setPincodeCsv] = useState({ nonServiceable: "", servicePrefixes: "", metroPrefixes: "" });

  useEffect(() => {
    if (!data) return;
    setForm(data.settings);
    setPincodeCsv({
      nonServiceable: toCsv(data.settings.nonServiceablePincodes),
      servicePrefixes: toCsv(data.settings.servicePincodePrefixes),
      metroPrefixes: toCsv(data.settings.metroPincodePrefixes),
    });
  }, [data]);

  if (isLoading || !form) return <p className="text-sm text-ink-soft">Loading…</p>;

  const save = async () => {
    try {
      await updateSettings.mutateAsync({
        ...form,
        nonServiceablePincodes: fromCsv(pincodeCsv.nonServiceable),
        servicePincodePrefixes: fromCsv(pincodeCsv.servicePrefixes),
        metroPincodePrefixes: fromCsv(pincodeCsv.metroPrefixes),
      });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Could not save settings");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink">Settings</h1>

      <section className="mt-6 border border-line bg-background p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Business info</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={form.business?.name || ""} onChange={(e) => setForm({ ...form, business: { ...form.business, name: e.target.value } })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.business?.email || ""} onChange={(e) => setForm({ ...form, business: { ...form.business, email: e.target.value } })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.business?.phone || ""} onChange={(e) => setForm({ ...form, business: { ...form.business, phone: e.target.value } })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input value={form.business?.instagram || ""} onChange={(e) => setForm({ ...form, business: { ...form.business, instagram: e.target.value } })} className="mt-1 rounded-none" />
          </div>
          <div className="sm:col-span-2">
            <Label>Address</Label>
            <Input value={form.business?.address || ""} onChange={(e) => setForm({ ...form, business: { ...form.business, address: e.target.value } })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>GSTIN</Label>
            <Input value={form.business?.gstin || ""} onChange={(e) => setForm({ ...form, business: { ...form.business, gstin: e.target.value } })} className="mt-1 rounded-none" />
          </div>
        </div>
      </section>

      <section className="mt-6 border border-line bg-background p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Shipping &amp; tax</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Shipping fee (₹)</Label>
            <Input type="number" value={form.shippingFee ?? 0} onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value) })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>Free shipping threshold (₹)</Label>
            <Input type="number" value={form.freeShippingThreshold ?? 0} onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>Tax (%)</Label>
            <Input type="number" value={form.taxPercent ?? 0} onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>Low stock threshold</Label>
            <Input type="number" value={form.lowStockThreshold ?? 5} onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })} className="mt-1 rounded-none" />
          </div>
        </div>
      </section>

      <section className="mt-6 border border-line bg-background p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Cash on delivery</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.codEnabled ?? true} onCheckedChange={(v) => setForm({ ...form, codEnabled: v })} /> COD enabled
          </label>
          <div className="max-w-xs">
            <Label>Auto-release window (hours)</Label>
            <Input type="number" value={form.codConfirmWindowHours ?? 24} onChange={(e) => setForm({ ...form, codConfirmWindowHours: Number(e.target.value) })} className="mt-1 rounded-none" />
            <p className="mt-1 text-xs text-ink-soft">Unconfirmed COD orders auto-release their reserved stock after this many hours.</p>
          </div>
        </div>
      </section>

      <section className="mt-6 border border-line bg-background p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Delivery zones (rule-based, until Shiprocket)</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label>Non-serviceable pincodes (comma separated)</Label>
            <Input value={pincodeCsv.nonServiceable} onChange={(e) => setPincodeCsv({ ...pincodeCsv, nonServiceable: e.target.value })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>Serviceable pincode prefixes (empty = serve everywhere)</Label>
            <Input value={pincodeCsv.servicePrefixes} onChange={(e) => setPincodeCsv({ ...pincodeCsv, servicePrefixes: e.target.value })} className="mt-1 rounded-none" />
          </div>
          <div>
            <Label>Metro pincode prefixes (faster delivery estimate)</Label>
            <Input value={pincodeCsv.metroPrefixes} onChange={(e) => setPincodeCsv({ ...pincodeCsv, metroPrefixes: e.target.value })} className="mt-1 rounded-none" />
          </div>
        </div>
      </section>

      <section className="mt-6 border border-line bg-background p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Payment keys</h2>
        <p className="mt-1 text-xs text-ink-soft">Read-only — set via the backend .env file, not here.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="rounded-none border-none bg-sand text-ink-soft">
            Razorpay key: {data?.paymentKeys.razorpayKeyId || "not set"}
          </Badge>
          <Badge className={`rounded-none border-none ${data?.paymentKeys.razorpaySecretSet ? "bg-brick/10 text-brick" : "bg-destructive/10 text-destructive"}`}>
            Secret {data?.paymentKeys.razorpaySecretSet ? "configured" : "missing"}
          </Badge>
          <Badge className={`rounded-none border-none ${data?.paymentKeys.webhookSecretSet ? "bg-brick/10 text-brick" : "bg-destructive/10 text-destructive"}`}>
            Webhook {data?.paymentKeys.webhookSecretSet ? "configured" : "missing"}
          </Badge>
        </div>
      </section>

      <Button onClick={save} disabled={updateSettings.isPending} className="mt-6 h-11 rounded-none bg-brick hover:bg-brick-dark">
        Save settings
      </Button>
    </div>
  );
}
