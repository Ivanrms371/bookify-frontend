import { useParams } from "react-router"
import { useQuotaUsage } from "../../hooks/useQuotaUsage"
import { QuotaUsageCards } from "./QuotaUsageCards"
import { QuotaUsageSkeleton } from "./QuotaUsageSkeleton"

export const QuotaUsage = () => {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { data: quotaData, isLoading: isLoadingQuota } = useQuotaUsage(tenantId)

  if (isLoadingQuota) {
    return <QuotaUsageSkeleton />
  }

  if (quotaData) {
    return <QuotaUsageCards quota={quotaData} />
  }

  return null
}
