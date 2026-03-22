import { OnboardingForm } from "../components/OnboardingForm";

export default function OnboardingInitPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-mist-900 dark:text-mist-100 text-center mb-4 max-w-3xl mx-auto">
        Crea tu negocio en segundos
      </h1>
      <p className="text-mist-500 dark:text-mist-400 text-lg text-center max-w-2xl mx-auto">
        Configura el nombre de tu negocio para comenzar a recibir reservas.
        Podrás personalizarlo más adelante
      </p>

      <OnboardingForm />
    </>
  );
}
