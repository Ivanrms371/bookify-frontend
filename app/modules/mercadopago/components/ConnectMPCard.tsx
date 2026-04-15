import { Button } from "@/shared/components/form/Button";
import { useCurrentTenant } from "@/modules/tenant/hooks/useCurrentTenant";
import { differenceInDays } from "date-fns";

export const ConnectMPCard = () => {
  const { currentTenant } = useCurrentTenant();

  const trialEndsAtString = currentTenant?.subscription?.trialEndsAt;
  
  let daysLeft = 14; // Default safe value if null
  if (trialEndsAtString) {
    const trialEndsAt = new Date(trialEndsAtString);
    daysLeft = differenceInDays(trialEndsAt, new Date());
  }

  let text = "Tu prueba gratuita está activa. Conecta MercadoPago para mantener el acceso.";
  let bgClasses = "from-blue-100 to-sky-200 dark:from-blue-900/30 dark:to-sky-900/30";
  let buttonClasses = "bg-sky-500 hover:bg-sky-600";

  if (daysLeft <= 1) {
    text = "Tu prueba gratuita termina hoy. Conecta MercadoPago para mantener el acceso.";
    bgClasses = "from-pink-100 to-red-200 dark:from-pink-900/30 dark:to-red-900/30";
    buttonClasses = "bg-red-500 hover:bg-red-600";
  } else if (daysLeft <= 7) {
    text = "Tu prueba gratuita está por terminar. Conecta MercadoPago para mantener el acceso.";
    bgClasses = "from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30";
    buttonClasses = "bg-orange-500 hover:bg-orange-600";
  }

  return (
    <div className={`mb-4 bg-linear-to-br ${bgClasses} shadow p-4 rounded-4xl transition-colors duration-300`}>
      <h3 className="text-xl text-mist-900 dark:text-mist-50 font-extrabold mb-1">
        Activa tu plan
      </h3>
      <p className="text-mist-700 dark:text-mist-400 mb-4 text-sm font-medium">
        {text}
      </p>

      <Button className={`py-3 px-6 font-medium cursor-pointer text-mist-100 rounded-full h-11.5 w-full transition-colors ${buttonClasses}`}>
        Conectar Mercadopago
      </Button>
    </div>
  );
};
