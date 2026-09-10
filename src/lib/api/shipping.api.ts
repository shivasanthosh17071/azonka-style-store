import { apiPost } from "./client";
import type { ServiceabilityResult } from "@/types";

export const checkServiceability = (pincode: string) =>
  apiPost<ServiceabilityResult>("/shipping/check-serviceability", { pincode });
