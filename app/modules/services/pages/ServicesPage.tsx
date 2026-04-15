import { Button } from "@/shared/components/form/Button";
import { ServicesTable } from "../components/ServicesTable";
import { useModalStore } from "@/shared/store/useModalStore";


export default function ServicesPage() {
  const { openModal } = useModalStore();
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
        <Button
          className="button-primary"
          onClick={() => openModal("serviceCreate")}
        >
          + Nuevo Servicio
        </Button>
      </div>

      <ServicesTable />
    </div>
  );
}
