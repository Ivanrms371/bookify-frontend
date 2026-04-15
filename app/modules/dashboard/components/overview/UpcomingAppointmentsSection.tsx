import React from "react"
import { useUpcomingAppointments } from "../../hooks/useUpcomingAppointments"
import { useParams } from "react-router"
import { UpcomingAppointmentsLoading } from "./UpcomingAppointmentsLoading"
import { UpcomingAppointmentsTable } from "./UpcomingAppointmentsTable"

export const UpcomingAppointmentsSection = () => {
  const { tenantId } = useParams<{ tenantId: string }>()

  const { data, isLoading } = useUpcomingAppointments(tenantId)

  if (isLoading) return <UpcomingAppointmentsLoading />

  return (
    <UpcomingAppointmentsTable
      appointments={data?.appointments ?? []}
      todayCount={data?.todayCount}
    />
  )
}
