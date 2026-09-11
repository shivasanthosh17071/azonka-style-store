import { apiPost } from "./client";

export const submitContact = (body: { name: string; email: string; message: string }) =>
  apiPost<undefined>("/contact", body);
