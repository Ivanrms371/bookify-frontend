import { useAuth } from "@/modules/auth/hooks/useAuth";
import { StatsCard } from "@/shared/components/_ui/StatsCard";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { CalendarIcon } from "lucide-react";
import { Checklist } from "../components/checklist/Checklist";

export default function DashboardPage() {
  const { session } = useAuth();
  const firstName = session?.name?.split(" ")[0];
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Hola {firstName} 👋
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">
        Aquí tienes un resumen de tu negocio.
      </p>

      <div className="grid grid-cols-12 mt-4 gap-6">
        <StatsCard
          title="Ganancias totales"
          value="40K"
          color="green"
          icon={BanknotesIcon}
        />
        <StatsCard
          title="Turnos hoy"
          value="10"
          color="blue"
          icon={CalendarIcon}
        />
        <StatsCard
          title="Clientes nuevos"
          value="10"
          color="blue"
          icon={UserPlusIcon}
        />
        <StatsCard
          title="Clientes totales"
          value="100"
          color="blue"
          icon={UsersIcon}
        />
      </div>
    </>
  );
}
