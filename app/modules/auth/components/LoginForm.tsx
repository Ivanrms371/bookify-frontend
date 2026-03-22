import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/form/Button";
import { Input } from "@/shared/components/form/Input";
import { Label } from "@/shared/components/form/Label";
import { loginInputSchema, type LoginInput } from "../schemas/login.schema";
import { useState } from "react";
import { FormAlert } from "@/shared/components/form/FormAlert";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
  const { errors, formError, isSubmitting, onSubmit, register } = useLogin();

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <FormAlert message={formError} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Tu email"
          {...register("email")}
          hasError={!!errors.email}
        />
        <FormAlert message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link
            to="/forgot-password"
            className="text-sm text-mist-500 dark:text-mist-400 "
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          type="password"
          id="password"
          placeholder="Tu contraseña"
          {...register("password")}
          hasError={!!errors.password}
        />
        <FormAlert message={errors.password?.message} />
      </div>

      <Button
        type="submit"
        className="button-primary mt-4"
        isLoading={isSubmitting}
      >
        Iniciar sesión
      </Button>
    </form>
  );
};
