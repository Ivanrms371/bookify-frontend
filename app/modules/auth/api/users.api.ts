import { apiClient } from "@/shared/api/client";
import type { AuthResponse } from "../schemas/auth.schema";

export const usersApi = {
  async getMe(): Promise<AuthResponse> {
    const res = await apiClient.get("/users/me");
    return res.data;
  },
};
