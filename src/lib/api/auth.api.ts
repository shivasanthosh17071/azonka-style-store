import { apiGet, apiPost } from "./client";
import type { User } from "@/types";

export const register = (body: { name: string; email: string; password: string }) =>
  apiPost<{ user: User }>("/auth/register", body);

export const login = (body: { identifier: string; password: string }) =>
  apiPost<{ user: User; accessToken: string }>("/auth/login", body);

export const sendOtp = (body: { phone: string; purpose?: "login" | "verify" }) =>
  apiPost<{ expiresIn: number; devOtp?: string }>("/auth/send-otp", body);

export const verifyOtp = (body: { phone: string; otp: string }) =>
  apiPost<{ user: User; accessToken: string }>("/auth/verify-otp", body);

export const refreshToken = () => apiPost<{ accessToken: string }>("/auth/refresh-token");

export const logout = () => apiPost<undefined>("/auth/logout");

export const forgotPassword = (body: { email: string }) => apiPost<undefined>("/auth/forgot-password", body);

export const resetPassword = (body: { token: string; password: string }) =>
  apiPost<undefined>("/auth/reset-password", body);

export const verifyEmail = (token: string) => apiPost<{ user: User }>("/auth/verify-email", { token });

export const resendVerificationEmail = (body: { email: string }) =>
  apiPost<undefined>("/auth/resend-verification", body);

export const getMe = () => apiGet<{ user: User }>("/auth/me");
