import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

const LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const TONE: Record<OrderStatus, string> = {
  placed: "bg-sand text-ink",
  confirmed: "bg-sand text-ink",
  packed: "bg-sand text-ink",
  shipped: "bg-brick/10 text-brick",
  out_for_delivery: "bg-brick/10 text-brick",
  delivered: "bg-brick text-primary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  returned: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge className={`rounded-none border-none text-[10px] font-bold uppercase tracking-wide ${TONE[status]}`}>{LABELS[status]}</Badge>;
}
