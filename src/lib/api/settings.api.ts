import { apiGet, apiPut } from "./client";
import type { SettingsResponse, StoreSettings } from "@/types";

export const getSettings = () => apiGet<SettingsResponse>("/admin/settings");

export const updateSettings = (body: Partial<StoreSettings>) =>
  apiPut<{ settings: StoreSettings }>("/admin/settings", body);
