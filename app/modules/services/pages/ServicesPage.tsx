import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/form/Button";
import { formatCurrency } from "@/shared/utils/formatters";
import { Switch } from "@/shared/components/form/Switch";
import { cn } from "@/shared/lib/utils";
import { ActionDropMenu } from "../components/ActionDropMenu";

// ─── Types ──────────────────────────────────────────────────────────
interface Service {
  id: string;
  name: string;
  image: string;
  description?: string;
  price: number;
  discount?: number;
  duration: number; // minutes
  isActive: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────────
const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    name: "Corte de Cabello Clásico",
    description: "Corte tradicional con tijera o máquina.",
    duration: 45,
    price: 400,
    discount: 5.0,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    name: "Perfilado de Barba",
    description: "Diseño y recorte de barba con toalla caliente.",
    duration: 30,
    price: 150,
    isActive: true,
    image: "",
  },
  {
    id: "3",
    name: "Limpieza Facial Profunda",
    description: "Tratamiento completo de exfoliación e hidratación.",
    duration: 60,
    price: 800,
    discount: 10.0,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);

  const handleToggle = (id: string, isActive: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive } : s)),
    );
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-mist-800 dark:text-mist-200">
            Servicios
          </h1>
          <p className="text-mist-500 dark:text-mist-400 font-medium mt-1">
            Configura y gestiona el catálogo de servicios de tu negocio.
          </p>
        </div>
        <Button className="button-primary">+ Nuevo Servicio</Button>
      </div>

      <div
        className={cn(
          "col-span-5 flex flex-col rounded-4xl bg-white dark:bg-transparent dark:border dark:border-mist-900/70 p-6",
        )}
      >
        <div className="overflow-y-auto max-h-[400px] pr-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10">
              <tr className="bg-white dark:bg-mist-950">
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 px-2">
                  Nombre
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 px-2">
                  Descripción
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 px-2 hidden xl:table-cell">
                  Duración
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 px-2 hidden xl:table-cell">
                  Precio
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 px-2 text-left">
                  Estado
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 px-2 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, i) => (
                <tr
                  key={service.id}
                  className={cn(
                    "border-t border-mist-100 dark:border-mist-800/50 transition-colors",
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
                      <span className="text-sm text-mist-800 dark:text-mist-100 truncate">
                        {service.description}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 hidden xl:table-cell">
                    <span className="text-sm text-mist-600 dark:text-mist-300">
                      {service.duration}min
                    </span>
                  </td>
                  <td className="py-3 px-2 hidden xl:table-cell">
                    <span className="text-sm text-mist-500 dark:text-mist-400">
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
                      <ActionDropMenu />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
