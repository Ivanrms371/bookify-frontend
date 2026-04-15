import { useAuth } from "@/modules/auth/hooks/useAuth"
import { CalendarIcon } from "lucide-react"
import { useParams } from "react-router"
import { useEffect } from "react"
import { formatRevenue } from "@/shared/lib/utils"
import { QuotaUsage } from "../components/quota/QuotaUsage"
import { Heading } from "@/shared/components/typography/Heading"
import { Paragraph } from "@/shared/components/typography/Paragraph"
import { getFirstName } from "@/shared/utils/string"
import { DashboardStats } from "../components/stats/DashboardStats"
import { DashboardOverview } from "../components/overview/DashboardOverview"
import { COLORS, COLORS_KEY } from "@/shared/constants/colors"

export default function DashboardPage() {
  const { session } = useAuth()

  useEffect(() => {
    document.title = `Dashboard - ${session?.tenants[0].name}`
  }, [session])

  return (
    <>
      <Heading as="h1" className="mt-2">
        Hola {getFirstName(session?.name)} 👋
      </Heading>

      <Paragraph className="mb-4">
        Aquí tienes un resumen de tu negocio.
      </Paragraph>

      <DashboardStats />

      <DashboardOverview />

      <QuotaUsage />
    </>
  )
}
