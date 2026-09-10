export interface PolicyContent {
  title: string;
  body: string[];
}

export const POLICIES: Record<string, PolicyContent> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the information needed to process your orders and improve your shopping experience — your name, contact details, shipping address and order history.",
      "We never sell your personal data. Payment details are handled directly by our payment partner (Razorpay) and are never stored on our servers.",
      "You can request a copy of your data or ask us to delete your account at any time by writing to hello@ragyaim.in.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    body: [
      "We ship across India. Orders are typically dispatched within 1–2 business days of confirmation.",
      "Metro cities usually receive orders within 3 days; other locations within 5–7 days.",
      "Shipping is free on orders over ₹999 — a flat fee applies below that threshold, shown at checkout before you pay.",
      "You'll receive tracking details by SMS and email as soon as your order ships.",
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    body: [
      "Orders can be cancelled free of charge any time before they're packed for shipping, from your Account → Orders page.",
      "Cash-on-delivery orders that aren't confirmed within 24 hours are automatically released back to stock.",
      "Once an order has shipped, it can no longer be cancelled — please refer to our Refund & Returns policy instead.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By using this website you agree to shop only for personal, non-commercial use and to provide accurate information at checkout.",
      "Product prices, discounts and availability are subject to change without notice. Prices shown at checkout are final.",
      "We reserve the right to cancel any order suspected of fraud or abuse of promotional offers.",
    ],
  },
  "refund-returns": {
    title: "Refund & Returns Policy",
    body: [
      "Unworn items with tags attached can be returned within 7 days of delivery for a full refund or exchange.",
      "Prepaid orders are refunded to the original payment method within 5–7 business days of us receiving the returned item.",
      "To start a return, reach out on hello@ragyaim.in with your order number — we'll arrange a pickup where available.",
    ],
  },
};
