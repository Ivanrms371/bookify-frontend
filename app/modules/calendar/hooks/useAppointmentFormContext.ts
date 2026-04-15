import { useMemo, useState } from "react"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useModalStore } from "@/shared/store/useModalStore"
import { useCustomers } from "@/modules/customers/hooks/useCustomers"
import type { Customer } from "@/modules/customers/types/customer.types"
import { useServices } from "@/modules/services/hooks/useServices"
import type { Service } from "@/modules/services/types/service.types"
import { useStaffs } from "@/modules/staff/hooks/useStaffs"
import type { Staff } from "@/modules/staff/types/staff.type"
import { useAvailabilityConfig, useAvailabilitySlots } from "@/modules/availability/hooks/useAvailability"
import { useCreateAppointment } from "@/modules/appointments/hooks/useCreateAppointment"
import { useRescheduleAppointment } from "@/modules/appointments/hooks/useRescheduleAppointment"
import type { AppointmentFormMode, AppointmentFormInitialData } from "../context/appointment-form.context"

export const useAppointmentFormState = (
  mode: AppointmentFormMode = "create",
  initialData?: AppointmentFormInitialData,
) => {
  const { closeModal } = useModalStore()
  const isReschedule = mode === "reschedule"

  // In reschedule mode, skip step 1 (customer) — start at step 2 (service)
  const [step, setStep] = useState(isReschedule ? 2 : 1)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)

  // Pre-fill from existing appointment in reschedule mode
  const [customer, setCustomer] = useState<Customer | null>(() => {
    if (isReschedule && initialData?.appointment) {
      return {
        id: initialData.appointment.id,
        name: initialData.appointment.customerName,
        phone: initialData.appointment.customerPhone,
        email: initialData.appointment.customerEmail ?? "",
      } as Customer
    }
    return null
  })

  const [service, setService] = useState<Service | null>(null)
  const [staff, setStaff] = useState<Staff | null>(null)

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const customers = useCustomers(
    {
      query: debouncedQuery,
      take: 10,
      skip: 0,
      orderBy: "name",
      order: "asc",
    },
    {
      enabled: step === 1 && debouncedQuery.length >= 3 && !isReschedule,
      staleTime: 5 * 60 * 1000,
    },
  )
  const services = useServices(
    {
      active: true,
      orderBy: "createdAt",
    },
    { staleTime: 5 * 60 * 1000, enabled: step === 2 },
  )
  const staffs = useStaffs(
    {
      orderBy: "displayOrder",
      order: "asc",
    },
    { staleTime: 5 * 60 * 1000, enabled: step === 3 },
  )

  const configQuery = useAvailabilityConfig(staff?.id ?? "", { enabled: step === 4 })
  const slotsData = useAvailabilitySlots(
    staff?.id ?? "",
    selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}` : null,
    { enabled: step === 4 }
  )

  const filteredStaffs = useMemo(() => {
    if (!service || !staffs.data) return []

    const result = staffs.data.filter((staff) =>
      (service.staffIds ?? []).includes(staff.id),
    )

    return result
  }, [staffs.data, service])

  const next = () => {
    setStep(step + 1)
  }

  const back = () => {
    // In reschedule mode, don't go back to step 1
    if (isReschedule && step === 2) return
    setStep(step - 1)
  }

  const createAppointment = useCreateAppointment()
  const rescheduleAppointment = useRescheduleAppointment()

  const save = () => {
    if (!staff || !service || !customer || !selectedDate || !selectedTime) return

    const [hours, minutes] = selectedTime.split(":").map(Number)
    const appointmentDate = new Date(selectedDate)
    appointmentDate.setHours(hours, minutes, 0, 0)

    if (isReschedule && initialData) {
      rescheduleAppointment.mutate(
        {
          tenantId: staff.tenantId,
          appointmentId: initialData.appointmentId,
          payload: {
            staffId: staff.id,
            serviceId: service.id,
            date: appointmentDate.toISOString(),
          },
        },
        {
          onSuccess: () => {
            closeModal()
          },
        },
      )
    } else {
      const payload = {
        customer: {
          name: customer.name ?? "",
          phone: customer.phone ?? "",
          email: customer.email ?? "",
        },
        appointment: {
          tenantId: staff.tenantId,
          staffId: staff.id,
          serviceId: service.id,
          date: appointmentDate.toISOString(),
        },
      }

      createAppointment.mutate(
        { tenantId: staff.tenantId, payload },
        {
          onSuccess: () => {
            closeModal()
          },
        },
      )
    }
  }

  return {
    mode,
    step,
    query,
    setQuery,
    customer,
    customers,
    setCustomer,
    service,
    services,
    setService,
    staff,
    staffs: filteredStaffs,
    staffsQuery: staffs,
    setStaff,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    slots: slotsData?.data?.slots || [],
    nextAvailableDate: configQuery?.data?.nextAvailableDate || slotsData?.data?.nextAvailableDate,
    maxAdvancedDays: configQuery?.data?.maxAdvancedDays,
    workingHours: configQuery?.data?.workingHours || [],
    exceptions: configQuery?.data?.exceptions || [],
    isFetchingSlots: slotsData.isFetching,
    next,
    onNext: next,
    back,
    onBack: back,
    save,
    isSubmitting: createAppointment.isPending || rescheduleAppointment.isPending,
  }
}
