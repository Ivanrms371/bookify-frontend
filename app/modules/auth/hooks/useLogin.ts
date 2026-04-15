import { loginInputSchema, type LoginInput } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { usersApi } from "../api/users.api";

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
  });

  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const onGoogleLogin = () => {
    authApi.googleAuth();
  };

  const onSubmit = handleSubmit(async (data: LoginInput) => {
    const res = await authApi.login(data);
    if (res.error) {
      setFormError(res.error);
      return;
    }
    
    // Explicitly grab the entire membership list before redirecting
    let user;
    try {
      user = await usersApi.getMe();
    } catch (e: any) {
      if (e?.response?.status === 404 || e?.status === 404) {
        navigate("/onboarding");
        return;
      }
      setFormError("Could not verify user profile.");
      return;
    }
    
    if (!user || !user.tenants || user.tenants.length === 0) {
      navigate("/onboarding");
      return;
    }
    
    navigate(`/dashboard/${user.tenants[0].id}`);
  });

  return {
    register,
    onSubmit,
    onGoogleLogin,
    errors,
    formError,
    isSubmitting,
  };
};
