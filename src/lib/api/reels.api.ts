import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type { Reel, ReelPayload } from "@/types";

export const listReels = (includeInactive = false) =>
  apiGet<{ reels: Reel[] }>("/reels", {
    params: includeInactive ? { includeInactive: true } : undefined,
  });

export const createReel = (body: ReelPayload) => apiPost<{ reel: Reel }>("/reels", body);

export const updateReel = (id: string, body: Partial<ReelPayload>) =>
  apiPut<{ reel: Reel }>(`/reels/${id}`, body);

export const deleteReel = (id: string) => apiDelete<undefined>(`/reels/${id}`);
