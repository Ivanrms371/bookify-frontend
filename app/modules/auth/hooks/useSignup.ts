import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../api/auth.api";
import { signupInputSchema, type SignupInput } from "../schemas/signup.schema";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupInputSchema),
  });

  const navigate = useNavigate();

  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data: SignupInput) => {
    const res = await authApi.signup(data);
    if (res.error) {
      setFormError(res.error);
      return;
    }
    setFormError(null);
    navigate("/verify-email");
  });

  return {
    register,
    onSubmit,
    errors,
    formError,
    isSubmitting,
  };
};
