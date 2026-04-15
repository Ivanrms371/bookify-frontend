import { Modal } from "@/shared/components/_ui/Modal"
import { useModalStore } from "@/shared/store/useModalStore"
import { useTenant } from "@/shared/context/tenant.context"
import { useCustomer } from "../hooks/useCustomer"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import { getInitials } from "@/shared/utils/string"
import { formatCurrency } from "@/shared/utils/formatters"
import { cn } from "@/shared/lib/utils"
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  XCircleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  ClipboardIcon
} from "@heroicons/react/24/outline"
import { Button } from "@/shared/components/form/Button"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"

export const CustomerProfileModal = () => {
  const { openModal, closeModal, props } = useModalStore()
  const { tenantId } = useTenant()
  const customerId = props?.customer?.id
  
  const { data: customer, isLoading } = useCustomer(tenantId, customerId)

  if (isLoading || !customer) {
    return (
      <Modal onClose={closeModal}>
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-mist-500 font-medium tracking-tight">Cargando perfil del cliente...</p>
        </div>
      </Modal>
    )
  }

  const initials = getInitials(customer.name)
  const phoneFull = `${customer.phoneCountryCode}${customer.phone}`
  
  const appointmentStats = [
    {
      label: "Total Citas",
      value: customer.totalAppointments || 0,
      icon: CalendarDaysIcon,
      color: "text-mist-600",
      borderColor: "border-mist-200 dark:border-mist-800"
    },
    {
      label: "Asistidas",
      value: customer.completedAppointments || 0,
      icon: CheckCircleIcon,
      color: "text-emerald-600",
      borderColor: "border-mist-200 dark:border-mist-800"
    },
    {
      label: "Canceladas",
      value: customer.cancelledAppointments || 0,
      icon: XCircleIcon,
      color: "text-rose-600",
      borderColor: "border-mist-200 dark:border-mist-800"
    },
    {
      label: "No Asistió",
      value: customer.noShowCount || 0,
      icon: ExclamationTriangleIcon,
      color: "text-amber-600",
      borderColor: "border-mist-200 dark:border-mist-800"
    },
  ]

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Sin registro"
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
    }).format(new Date(date))
  }

  return (
    <Modal onClose={closeModal} className="max-w-3xl">
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-mist-100 dark:border-mist-800/50">
          <div className="flex items-center gap-5">
            <div className="size-20 rounded-full bg-mist-100 dark:bg-mist-800/50 border border-mist-200 dark:border-mist-700 flex items-center justify-center text-2xl font-bold text-mist-900 dark:text-white uppercase">
              {initials}
            </div>
            <div>
              <Heading as="h2" className="text-2xl font-bold text-mist-900 dark:text-white leading-tight">
                {customer.name}
              </Heading>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-1.5">
                <span className="flex items-center gap-1.5 text-sm text-mist-500 font-medium">
                  <PhoneIcon className="size-4" />
                  {customer.phoneCountryCode} {customer.phone}
                </span>
                {customer.email && (
                  <span className="flex items-center gap-1.5 text-sm text-mist-500 font-medium">
                    <EnvelopeIcon className="size-4" />
                    {customer.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              className="button-secondary p-2.5 rounded-full" 
              title="Nueva Cita"
              onClick={() => {
                closeModal()
                setTimeout(() => openModal("newAppointment", { initialData: { customer } }), 100)
              }}
            >
              <CalendarDaysIcon className="size-5" />
            </Button>
            <a 
              href={`https://wa.me/${phoneFull.replace("+", "")}`} 
              target="_blank" 
              rel="noreferrer"
            >
              <Button className="button-secondary p-2.5 rounded-full" title="Contactar por WhatsApp">
                <ChatBubbleLeftRightIcon className="size-5" />
              </Button>
            </a>
            <a href={`tel:${phoneFull}`}>
              <Button className="button-primary p-2.5 rounded-full" title="Llamar">
                <PhoneIcon className="size-5" />
              </Button>
            </a>
          </div>
        </div>

        {/* Spend & Financial Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-1 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/30 dark:bg-emerald-950/10 flex flex-col items-center justify-center text-center">
            <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 text-emerald-600">
              <BanknotesIcon className="size-6" />
            </div>
            <p className="text-[10px] font-bold text-emerald-800/60 dark:text-emerald-400/50 uppercase tracking-widest mb-1.5">
              Total Gastado
            </p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(Number(customer.totalSpent || 0))}
            </p>
          </div>

          {/* Appointment History Stats */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {appointmentStats.map((stat) => (
              <div key={stat.label} className={cn("p-4 rounded-2xl border bg-transparent flex items-center gap-4", stat.borderColor)}>
                <div className={cn("size-10 rounded-full bg-mist-50 dark:bg-mist-900/40 flex items-center justify-center shrink-0", stat.color)}>
                  <stat.icon className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-mist-400 dark:text-mist-500 uppercase tracking-widest leading-none mb-1">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-mist-900 dark:text-white line-clamp-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Timeline Section */}
        <div className="grid md:grid-cols-2 gap-10 pt-4">
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-mist-400 dark:text-mist-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <CalendarDaysIcon className="size-4" />
              Línea de Tiempo
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-mist-100 dark:border-mist-800/50">
                <span className="text-sm text-mist-600 dark:text-mist-400 font-medium">Primera Cita</span>
                <span className="text-sm font-bold text-mist-900 dark:text-mist-200">
                  {formatDate(customer.firstAppointmentAt)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-mist-100 dark:border-mist-800/50">
                <span className="text-sm text-mist-600 dark:text-mist-400 font-medium">Última Cita</span>
                <span className="text-sm font-bold text-mist-900 dark:text-mist-200">
                  {formatDate(customer.lastAppointmentAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs font-bold text-mist-400 dark:text-mist-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <ClipboardIcon className="size-4" />
              Observaciones
            </h4>
            <div className="p-5 rounded-xl border border-mist-100 dark:border-mist-800/50 bg-mist-50/30 dark:bg-mist-900/10 min-h-[110px]">
              <p className="text-sm text-mist-600 dark:text-mist-400 leading-relaxed italic">
                {customer.notes || "No hay observaciones registradas para este cliente."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
