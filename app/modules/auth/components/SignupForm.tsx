import { useSignup } from "../hooks/useSignup";
import { Button } from "@/shared/components/form/Button";
import { Input } from "@/shared/components/form/Input";
import { Label } from "@/shared/components/form/Label";
import { FormAlert } from "@/shared/components/form/FormAlert";

export const SignupForm = () => {
  const { register, onSubmit, errors, formError, isSubmitting } = useSignup();

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <FormAlert message={formError} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input
          type="text"
          id="name"
          placeholder="Ingresa tu nombre"
          {...register("name")}
          hasError={!!errors.name}
        />
        <FormAlert message={errors.name?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="correo@ejemplo.com"
          {...register("email")}
          hasError={!!errors.email}
        />
        <FormAlert message={errors.email?.message} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Número de teléfono</Label>
        <Input
          type="text"
          id="phone"
          placeholder="099 123 456"
          {...register("phone")}
          hasError={!!errors.phone}
        />
        <FormAlert message={errors.phone?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <Label htmlFor="password">Contraseña</Label>
        </div>
        <Input
          type="password"
          id="password"
          placeholder="Crea tu contraseña"
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
        Crear cuenta
      </Button>
    </form>
  );
};
