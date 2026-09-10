import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddresses, useAddressMutations } from "@/hooks/queries/useMisc";
import { ApiException } from "@/lib/api/client";

const emptyForm = { label: "Home", line1: "", line2: "", city: "", state: "", pincode: "", phone: "", isDefault: false };

export function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const { add, remove } = useAddressMutations();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const submit = async () => {
    if (!form.line1 || !form.city || !form.state || form.pincode.length !== 6 || form.phone.length !== 10) {
      toast.error("Fill in a complete address");
      return;
    }
    try {
      await add.mutateAsync(form);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Address added");
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Could not add address");
    }
  };

  if (isLoading) return <p className="text-sm text-ink-soft">Loading…</p>;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses?.map((address) => (
          <div key={address._id} className="border border-line p-4">
            <div className="flex items-start justify-between">
              <p className="text-sm font-bold">
                {address.label} {address.isDefault && <span className="ml-2 text-[10px] font-bold uppercase text-brick">Default</span>}
              </p>
              <button onClick={() => remove.mutate(address._id)} aria-label="Delete address" className="text-ink-soft hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              {address.line1}, {address.line2 ? `${address.line2}, ` : ""}
              {address.city}, {address.state} — {address.pincode}
            </p>
            <p className="text-sm text-ink-soft">{address.phone}</p>
          </div>
        ))}
      </div>

      {!showForm ? (
        <Button variant="outline" onClick={() => setShowForm(true)} className="mt-6 rounded-none">
          <Plus className="size-4" /> Add new address
        </Button>
      ) : (
        <div className="mt-6 grid max-w-lg gap-4 border border-line p-4 sm:grid-cols-2">
          <div>
            <Label>Label</Label>
            <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="mt-1" />
          </div>
          <div className="sm:col-span-2">
            <Label>Address line 1</Label>
            <Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="mt-1" />
          </div>
          <div className="sm:col-span-2">
            <Label>Address line 2 (optional)</Label>
            <Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>City</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>State</Label>
            <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Pincode</Label>
            <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className="mt-1" />
          </div>
          <div className="flex items-end gap-3 sm:col-span-2">
            <Button onClick={submit} disabled={add.isPending} className="rounded-none bg-ink hover:bg-brick">
              Save address
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
