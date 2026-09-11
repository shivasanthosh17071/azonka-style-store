import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiEnvelope, PaginationMeta } from "@/types";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://ragyai-backend.onrender.com/api/v1";

export const http = axios.create({
  baseURL,
  withCredentials: true, // sends the httpOnly refresh cookie, scoped to /auth
});

/** Module-level token holder so the interceptor doesn't need React context. */
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

export class ApiException extends Error {
  status?: number;
  errors?: { field?: string; message: string }[];
  constructor(message: string, status?: number, errors?: { field?: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Field-level validation errors (422s) are far more useful to a user than the generic
 * "Validation failed" envelope message — this surfaces the first specific one when present.
 */
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiException) {
    if (err.errors?.length) return err.errors.map((e) => e.message).join(" · ");
    return err.message || fallback;
  }
  return fallback;
}

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const AUTH_EXEMPT = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/send-otp",
  "/auth/verify-otp",
];

let refreshPromise: Promise<string | null> | null = null;

const doRefresh = async (): Promise<string | null> => {
  try {
    const res = await http.post<ApiEnvelope<{ accessToken: string }>>("/auth/refresh-token");
    const token = res.data.data?.accessToken ?? null;
    setAccessToken(token);
    return token;
  } catch {
    setAccessToken(null);
    window.dispatchEvent(new CustomEvent("auth:session-expired"));
    return null;
  }
};

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const url = original?.url || "";
    const isExempt = AUTH_EXEMPT.some((path) => url.includes(path));

    if (error.response?.status === 401 && original && !original._retry && !isExempt) {
      original._retry = true;
      if (!refreshPromise) refreshPromise = doRefresh().finally(() => (refreshPromise = null));
      const token = await refreshPromise;
      if (token) {
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
        return http.request(original);
      }
    }

    const message = error.response?.data?.message || error.message || "Something went wrong";
    const errors = error.response?.data?.errors;
    return Promise.reject(new ApiException(message, error.response?.status, errors));
  },
);

/** Unwraps the {success,message,data} envelope into the payload callers actually want. */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.get<ApiEnvelope<T>>(url, config);
  return res.data.data as T;
}

export async function apiGetWithMeta<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<{ data: T; meta?: PaginationMeta }> {
  const res = await http.get<ApiEnvelope<T>>(url, config);
  return { data: res.data.data as T, meta: res.data.meta };
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.post<ApiEnvelope<T>>(url, body, config);
  return res.data.data as T;
}

export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.put<ApiEnvelope<T>>(url, body, config);
  return res.data.data as T;
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.patch<ApiEnvelope<T>>(url, body, config);
  return res.data.data as T;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.delete<ApiEnvelope<T>>(url, config);
  return res.data.data as T;
}
