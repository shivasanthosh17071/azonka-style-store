import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthProvider";
import { useAddresses, useApplyCoupon } from "@/hooks/queries/useMisc";
import { useCreateOrder } from "@/hooks/queries/useOrders";
import * as paymentsApi from "@/lib/api/payments.api";
import { loadRazorpayScript } from "@/lib/razorpay";
import { formatPrice } from "@/lib/format";
import { errorMessage } from "@/lib/api/client";
import type { Address, PaymentMethod } from "@/types";

interface FormState {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = useCart();
  const { data: addresses } = useAddresses();
  const applyCoupon = useApplyCoupon();
  const createOrder = useCreateOrder();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def._id);
      setShowNewAddressForm(false);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (user && !form.email) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name,
        email: user.email,
        phone: f.phone || user.phone || "",
      }));
    }
  }, [user, form.email]);

  if (cart.lines.length === 0) {
    return (
      <div className="section-wrap flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="font-display text-3xl">Your bag is empty.</p>
        <Button
          asChild
          className="mt-6 rounded-none bg-ink text-xs uppercase tracking-[0.15em] hover:bg-brick"
        >
          <a href="/shop">Continue shopping</a>
        </Button>
      </div>
    );
  }

  const selectedAddress = addresses?.find((a) => a._id === selectedAddressId);

  const buildShippingAddress = () => {
    if (selectedAddress && !showNewAddressForm) {
      return {
        name: user?.name || selectedAddress.label,
        phone: selectedAddress.phone,
        line1: selectedAddress.line1,
        line2: selectedAddress.line2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      };
    }
    return {
      name: form.name,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    };
  };

  const validate = () => {
    if (
      (!selectedAddress || showNewAddressForm) &&
      (!form.name ||
        !form.phone ||
        !form.line1 ||
        !form.city ||
        !form.state ||
        form.pincode.length !== 6)
    ) {
      return "Fill in a complete shipping address";
    }
    return null;
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    applyCoupon.mutate(
      { code: couponCode.trim(), fromCart: true },
      {
        onSuccess: (res) => {
          setAppliedCoupon({ code: res.code, discount: res.discount });
          toast.success(`Coupon applied — you save ${formatPrice(res.discount)}`);
        },
        onError: (err) => toast.error(errorMessage(err, "Could not apply coupon")),
      },
    );
  };

  const openConfirm = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setConfirmOpen(true);
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const shippingAddress = buildShippingAddress();
      const { order } = await createOrder.mutateAsync({
        shippingAddress,
        fromCart: true,
        couponCode: appliedCoupon?.code,
        paymentMethod,
      });

      if (paymentMethod === "cod") {
        cart.clear();
        navigate(`/order-confirmation/${order._id}`, { state: { order } });
        return;
      }

      await loadRazorpayScript();
      const rzpOrder = await paymentsApi.createRazorpayOrder(order._id);
      const razorpay = new window.Razorpay({
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        order_id: rzpOrder.razorpayOrderId,
        name: "RAGYAI_m",
        description: `Order ${rzpOrder.orderNumber}`,
        prefill: rzpOrder.prefill,
        theme: { color: "#8a2b26" },
        handler: async (response) => {
          try {
            const verified = await paymentsApi.verifyRazorpayPayment(response as never);
            cart.clear();
            navigate(`/order-confirmation/${order._id}`, { state: { order: verified.order } });
          } catch (err) {
            toast.error(
              errorMessage(
                err,
                "Payment verification failed. Contact support if you were charged.",
              ),
            );
          }
        },
        modal: {
          ondismiss: () => toast.info("Payment cancelled — you can try again from your orders."),
        },
      });
      razorpay.open();
    } catch (err) {
      toast.error(errorMessage(err, "Could not place order"));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmAddress = buildShippingAddress();

  return (
    <div className="section-wrap py-12 sm:py-16">
      <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Checkout</h1>

      <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Shipping address</h2>

            {addresses && addresses.length > 0 && (
              <div className="mt-4 grid gap-3">
                {addresses.map((address: Address) => (
                  <button
                    key={address._id}
                    onClick={() => {
                      setSelectedAddressId(address._id);
                      setShowNewAddressForm(false);
                    }}
                    className={`border p-4 text-left text-sm ${
                      selectedAddressId === address._id && !showNewAddressForm
                        ? "border-brick bg-brick/5"
                        : "border-line"
                    }`}
                  >
                    <p className="font-semibold">{address.label}</p>
                    <p className="text-ink-soft">
                      {address.line1}, {address.line2 ? `${address.line2}, ` : ""}
                      {address.city}, {address.state} — {address.pincode}
                    </p>
                    <p className="text-ink-soft">{address.phone}</p>
                  </button>
                ))}
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className={`border p-4 text-left text-sm font-semibold text-brick ${showNewAddressForm ? "border-brick bg-brick/5" : "border-line"}`}
                >
                  + Use a new address
                </button>
              </div>
            )}

            {(showNewAddressForm || !addresses?.length) && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="line1">Address line 1</Label>
                  <Input
                    id="line1"
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="line2">Address line 2 (optional)</Label>
                  <Input
                    id="line2"
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Payment method</h2>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`flex-1 border p-4 text-left text-sm font-semibold ${paymentMethod === "cod" ? "border-brick bg-brick/5 text-brick" : "border-line"}`}
              >
                Cash on delivery
              </button>
              <button
                onClick={() => setPaymentMethod("razorpay")}
                className={`flex-1 border p-4 text-left text-sm font-semibold ${paymentMethod === "razorpay" ? "border-brick bg-brick/5 text-brick" : "border-line"}`}
              >
                Pay online (Razorpay)
              </button>
            </div>
          </section>
        </div>

        <div className="h-fit space-y-6 border border-line p-6">
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {cart.lines.map((item) => (
              <div key={item.key} className="flex gap-3 text-sm">
                {item.image && (
                  <img src={item.image} alt={item.name} className="size-14 object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="text-xs text-ink-soft">
                    {item.color} · {item.size} · Qty {item.qty}
                  </p>
                </div>
                <span className="shrink-0 font-semibold">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-line pt-4">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button
              variant="outline"
              className="shrink-0 rounded-none"
              onClick={handleApplyCoupon}
              disabled={applyCoupon.isPending}
            >
              Apply
            </Button>
          </div>

          <div className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span>{formatPrice(cart.totals.subtotal)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-brick">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-{formatPrice(appliedCoupon.discount)}</span>
              </div>
            )}
            <p className="text-xs text-ink-soft">
              Final shipping, tax and total are confirmed on the next screen.
            </p>
          </div>

          <Button
            onClick={openConfirm}
            disabled={submitting || createOrder.isPending}
            className="h-12 w-full rounded-none bg-brick text-xs uppercase tracking-[0.16em] hover:bg-brick-dark"
          >
            {paymentMethod === "cod" ? "Place order" : "Proceed to pay"}
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm your order details</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-1 text-left text-sm text-ink">
                <p className="font-semibold">{confirmAddress.name}</p>
                <p>{confirmAddress.phone}</p>
                <p>{user?.email}</p>
                <p className="text-ink-soft">
                  {confirmAddress.line1}
                  {confirmAddress.line2 ? `, ${confirmAddress.line2}` : ""}, {confirmAddress.city},{" "}
                  {confirmAddress.state} — {confirmAddress.pincode}
                </p>
                <p className="pt-2 text-xs text-ink-soft">
                  Please confirm this is the correct delivery address, phone number and email before
                  we place your order.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back and edit</AlertDialogCancel>
            <AlertDialogAction onClick={handlePlaceOrder} className="bg-brick hover:bg-brick-dark">
              Confirm &amp; {paymentMethod === "cod" ? "place order" : "pay"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
