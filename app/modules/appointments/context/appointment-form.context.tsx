import React, { createContext, useContext } from "react"
import { useAppointmentFormState } from "@/modules/appointments/hooks/useAppointmentFormState"
import type { AppointmentDetail } from "../types/appointment.types"

import type { Customer } from "@/modules/customers/types/customer.types"

export type AppointmentFormMode = "create" | "reschedule"

export interface AppointmentFormInitialData {
  appointmentId?: string
  appointment?: AppointmentDetail
  customer?: Customer
}

type AppointmentFormContextType = ReturnType<typeof useAppointmentFormState>

const AppointmentFormContext = createContext<AppointmentFormContextType | null>(null)

interface ProviderProps {
  mode?: AppointmentFormMode
  initialData?: AppointmentFormInitialData
  children: React.ReactNode
}

export const AppointmentFormProvider = ({
  mode = "create",
  initialData,
  children,
}: ProviderProps) => {
  const value = useAppointmentFormState(mode, initialData)
  return (
    <AppointmentFormContext.Provider value={value}>
      {children}
    </AppointmentFormContext.Provider>
  )
}

export const useAppointmentForm = () => {
  const context = useContext(AppointmentFormContext)
  if (!context) {
    throw new Error("useAppointmentForm must be used within an AppointmentFormProvider")
  }
  return context
}
