export type Staff = {
  id: string
  userId: string
  tenantId: string
  displayName: string
  title: string
  commissionPercent: number | string | null
  avatarUrl: string | null
  colorTheme: string
  bio: string | null
  isActive: boolean
  user?: {
    email: string
    phone: string | null
    memberships?: Array<{
      status: string
      role: string
    }>
  }
}
