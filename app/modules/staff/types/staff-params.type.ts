export type StaffQueryParams = {
  query?: string
  take?: number
  skip?: number
  orderBy?: "displayOrder" | "createdAt"
  order?: "asc" | "desc"
}
