import { Button } from "@/shared/components/form/Button";

export const ConnectMPCard = () => {
  return (
    <div className="mb-4 bg-linear-to-br from-blue-100 to-sky-200 dark:from-blue-900/30 dark:to-sky-900/30 shadow p-4 rounded-4xl">
      <h3 className="text-xl text-gray-900 dark:text-gray-50 font-extrabold mb-1">
        Activa tu plan
      </h3>
      <p className="text-gray-700 dark:text-gray-400 mb-2">
        Tu prueba gratuita está activa. Conecta MercadoPago para mantener el
        acceso.
      </p>

      <Button className="py-3 px-6  bg-sky-500 font-medium cursor-pointer text-gray-100 rounded-full h-11.5  w-full">
        Conectar Mercadopago
      </Button>
    </div>
  );
};
