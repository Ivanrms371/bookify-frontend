import { httpClient } from "@/core/http/httpClient";
import type { AuthUser, TenantSummary } from "../types/auth.types";
import type { LoginFormValues } from "../schemas/login.schema";
import type { SignupFormValues } from "../schemas/signup.schema";

export interface GoogleAuthResponse {
  url: string
}

export interface MeResponse {
  user: AuthUser
  tenant: TenantSummary | null
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
  tenant: TenantSummary | null
}

export const authService = {

  signup: async (dto: SignupFormValues) =>
    httpClient.post<LoginResponse>("/auth/signup", dto),

  login: async (dto: LoginFormValues) =>
    httpClient.post<LoginResponse>("/auth/login", dto),

  logout: () =>
    httpClient.post("/auth/logout"),

  getMe: () =>
    httpClient.get<MeResponse>("/auth/me"),

  refreshToken: async () =>
    httpClient.post<MeResponse>("/auth/refresh"),

}
