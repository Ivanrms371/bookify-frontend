export type ServicesQueryParams = {
  query?: string
  active?: boolean
  take?: number
  skip?: number
  orderBy?: "name" | "createdAt"
}
