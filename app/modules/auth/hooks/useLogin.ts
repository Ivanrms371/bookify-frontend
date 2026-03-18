import { loginInputSchema, type LoginInput } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";

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
    setFormError(null);
    navigate(`/dashboard/${res.data.businessId}`);
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
