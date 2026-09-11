import { http } from "./client";
import type { ApiEnvelope, UploadedFile } from "@/types";

export const uploadImages = async (files: File[]): Promise<UploadedFile[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await http.post<ApiEnvelope<{ files: UploadedFile[] }>>("/upload/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data?.files || [];
};

export const uploadVideos = async (
  files: File[],
  onProgress?: (percent: number) => void,
): Promise<UploadedFile[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await http.post<ApiEnvelope<{ files: UploadedFile[] }>>("/upload/video", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return res.data.data?.files || [];
};

export const deleteAsset = (publicId: string) =>
  http.delete(`/upload/${encodeURIComponent(publicId)}`);
