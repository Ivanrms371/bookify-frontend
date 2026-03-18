import { Label } from "@/shared/components/form/Label";
import { Input } from "@/shared/components/form/Input";
import { Button } from "@/shared/components/form/Button";
import { cn } from "@/shared/lib/utils";
import { useOnboardingSetup } from "../hooks/useOnboardingSetup";

export const OnboardingSetupForm = () => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useOnboardingSetup();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-10 max-w-lg px-6 mx-auto"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="businessName">Nombre de tu barbería</Label>
        <Input
          {...register("name")}
          placeholder="Nombre de tu barbería"
          id="businessName"
          hasError={!!errors.name}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="businessSlug">URL de tu barbería</Label>
        <label
          htmlFor="businessSlug"
          className={cn(
            "rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-4 h-11.5 py-3 transition text-sm font-medium flex items-center gap-1 focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:ring-gray-800",
            errors.slug &&
              "border-red-500 focus-within:border-red-500 focus-within:ring-red-200",
          )}
        >
          <span className="text-gray-400">https://turnify.app/b/</span>

          <input
            {...register("slug")}
            id="businessSlug"
            type="text"
            className="bg-transparent outline-none w-full text-sm"
          />
        </label>
        {errors.slug && (
          <span className="text-red-500 text-sm font-medium">
            {errors.slug.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="button-primary mt-4"
      >
        {isSubmitting ? "Guardando..." : "Continuar"}
      </Button>
    </form>
  );
};
