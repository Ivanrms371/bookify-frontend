import { apiClient } from "@/shared/api/client";
import type { LoginInput } from "../schemas/login.schema";
import type { SignupInput } from "../schemas/signup.schema";

export const authApi = {
  async login(data: LoginInput) {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  },

  async signup(data: SignupInput) {
    const res = await apiClient.post("/auth/signup", data);
    return res.data;
  },

  async logout() {
    throw new Error("Not Implemented");
  },

  async me() {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  async forgotPassword() {
    throw new Error("Not Implemented");
  },

  async resetPassword() {
    throw new Error("Not Implemented");
  },

  async googleAuth() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },
};
