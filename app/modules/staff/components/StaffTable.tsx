import { TableWrapper } from "@/shared/components/_ui/TableWrapper";
import { Avatar } from "@/shared/components/_ui/Avatar";
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner";
import { cn } from "@/shared/lib/utils";
import { useStaffs } from "../hooks/useStaffs";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { ActionDropMenu } from "./ActionDropMenu";
import { useAuthStore } from "@/modules/auth/store/auth-store";

const getStatusBadge = (status?: string, isActive?: boolean) => {
  if (status === "INVITED") {
    return {
      label: "Invitado",
      colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    };
  }
  if (isActive) {
    return {
      label: "Activo",
      colorClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
  }
  return {
    label: "Inactivo",
    colorClass: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  };
};

export const StaffTable = () => {
  const { data: staffs, isLoading, isError } = useStaffs();
  const { session } = useAuthStore();

  if (isLoading) {
    return (
      <TableWrapper className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-mist-500">
          <LoadingSpinner size="md" />
          <span className="text-sm">Cargando personal...</span>
        </div>
      </TableWrapper>
    );
  }

  if (isError) {
    return (
      <TableWrapper className="min-h-[400px] flex items-center justify-center">
        <div className="text-red-500 text-sm">
          Error al cargar la lista de personal.
        </div>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <table className="w-full text-left">
        <thead className="sticky top-0 z-10">
          <tr className="bg-white dark:bg-mist-950">
            <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2">
              Nombre
            </th>
            <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2 hidden lg:table-cell">
              Email
            </th>
            <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2 hidden lg:table-cell">Télefono</th>
             <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2">
              Rol
            </th>
             <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2">
              Comisión
            </th>
            <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2">
              Estado
            </th>
            <th className="text-xs uppercase tracking-wider font-semibold text-mist-500 dark:text-mist-400 pb-3 px-2 text-end">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {!staffs || staffs.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-12 text-center text-mist-500">
                No se encontró personal.
              </td>
            </tr>
          ) : (
            staffs.map((staff) => {
              const isMe = staff.userId === session?.id;
              const statusBadge = getStatusBadge(staff.user?.memberships?.[0]?.status, staff.isActive);

              return (
              <tr
                key={staff.id}
                className={cn(
                  "border-t border-mist-100 dark:border-mist-800/50 transition-colors",
                  "hover:bg-mist-50 dark:hover:bg-mist-900/30",
                )}
              >
                <td className="py-3 px-2">
                  <div className="flex gap-3 items-center">
                    <Avatar src={staff.avatarUrl} name={staff.displayName} size="sm" />
                    <span className="font-medium text-mist-800 dark:text-mist-100 text-sm tracking-tight flex items-center gap-2">
                      {staff.displayName}
                      {isMe && (
                        <span className="bg-mist-100 text-mist-600 dark:bg-mist-900 dark:text-mist-200 text-xs px-1.5 py-0.5 rounded-md tracking-wider">
                          Tú
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                  <td className="py-3 px-2 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${staff.user?.email}`}
                        className="p-1.5 rounded-md bg-mist-100 dark:bg-mist-900/50 text-mist-600 dark:text-mist-400 hover:bg-mist-200 dark:hover:bg-mist-800 transition-colors"
                        title="Enviar Email"
                      >
                        <EnvelopeIcon className="size-4" />
                      </a>
                      <span className="text-sm text-mist-800 dark:text-mist-200 lowercase">
                        {staff.user?.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    {staff.user?.phone ? (
                      <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${staff.user?.phone?.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                        title="Enviar WhatsApp"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg>
                      </a>
                      <span className="text-sm text-mist-800 dark:text-mist-200">
                        {staff.user?.phone}
                      </span>
                    </div>
                      ) : (
                        <span className="text-sm text-mist-600 dark:text-mist-400">
                          Sin teléfono
                        </span>
                      )}
                  </td>
                <td className="py-3 px-2">
                  <span className="text-sm text-mist-600 dark:text-mist-400 capitalize">
                    {staff.user?.memberships?.[0]?.role === "ADMIN" ? "Administrador" : "Profesional"}
                  </span>
                </td>
                 <td className="py-3 px-2">
                  <span className="text-sm text-mist-600 dark:text-mist-400">
                    {isMe ? "-" : staff.commissionPercent !== null ? `${staff.commissionPercent}%` : "-"}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      statusBadge.colorClass
                    )}
                  >
                    {statusBadge.label}
                  </span>
                </td>
                <td className="py-3 px-2 text-end">
                  <ActionDropMenu staff={staff} />
                </td>
              </tr>
            );
          })
          )}
        </tbody>
      </table>
    </TableWrapper>
  );
};
