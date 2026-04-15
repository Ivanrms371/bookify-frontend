import { PhotoIcon } from "@heroicons/react/24/outline";
import { cn } from "@/shared/lib/utils";
import { Switch } from "@/shared/components/form/Switch";
import { formatCurrency } from "@/shared/utils/formatters";
import { ActionDropMenu } from "./ActionDropMenu";
import { TableWrapper } from "@/shared/components/_ui/TableWrapper";
import { useServices } from "../hooks/useServices";
import { useModalStore } from "@/shared/store/useModalStore";
import { Button } from "@/shared/components/form/Button";


export const ServicesTable = () => {
  const { data: services = [], isPending } = useServices();
  const { openModal } = useModalStore();

  const handleToggle = (id: string, isActive: boolean) => {
    console.log("Toggle service", id, isActive);
  };

  if(isPending) {
    return null
  }

  return (
    <TableWrapper>
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 gap-4">
          <div className="p-4 rounded-full bg-mist-100 dark:bg-mist-900/40">
            <PhotoIcon className="size-6 text-mist-400 dark:text-mist-500" />
          </div>
          <div className="text-center flex flex-col items-center">
            <h3 className="text-mist-800 dark:text-mist-200 font-semibold mb-1 text-lg">
              Aún no tienes servicios
            </h3>
            <p className="text-sm text-mist-500 dark:text-mist-400 font-medium max-w-sm mb-6">
              Crea tu primer servicio para empezar a recibir reservas. Puedes
              definir su duración, precio y el staff que lo realizará.
            </p>
            <Button
              className="button-primary w-fit"
              onClick={() => openModal("serviceCreate")}
            >
              + Crear primer servicio
            </Button>
          </div>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10">
            <tr className="bg-white dark:bg-mist-950">
              <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2">
                Nombre
              </th>
              <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2">
                Descripción
              </th>
              <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2 hidden xl:table-cell">
                Duración
              </th>
              <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2 hidden xl:table-cell">
                Precio
              </th>
              <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2 text-left">
                Estado
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, i) => (
              <tr
                key={service.id}
                className={cn(
                  "border-t border-mist-100 dark:border-mist-800/50",
                  "hover:bg-mist-50 dark:hover:bg-mist-900/30",
                )}
              >
                <td className="py-3 px-2">
                  <div className="flex gap-2 items-center">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="size-10 rounded-md object-cover border border-mist-200 dark:border-mist-800"
                      />
                    ) : (
                      <div className="size-10 rounded-md border border-mist-200 dark:border-mist-800 flex justify-center items-center">
                        <PhotoIcon className="size-5 text-mist-400 dark:text-mist-500" />
                      </div>
                    )}
                    <span className="font-medium text-mist-800 dark:text-mist-100">
                      {service.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="min-w-0">
                    <span className="text-sm text-mist-800 dark:text-mist-400 truncate">
                      {service.description ?? "Sin descripción"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 hidden xl:table-cell">
                  <span className="text-sm text-mist-600 dark:text-mist-400">
                    {service.durationMinutes}min
                  </span>
                </td>
                <td className="py-3 px-2 hidden xl:table-cell">
                  <span className="text-sm text-mist-500 dark:text-mist-200 font-semibold">
                    {formatCurrency(service.price)}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center">
                    <Switch
                      checked={service.isActive}
                      onCheckedChange={() =>
                        handleToggle(service.id, !service.isActive)
                      }
                    />
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex justify-end">
                    <ActionDropMenu serviceId={service.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TableWrapper>
  );
};
