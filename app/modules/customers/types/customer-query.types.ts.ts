export type CustomersQueryParams = {
  query?: string
  take?: number
  skip?: number
  orderBy?: "name" | "createdAt"
  order?: "asc" | "desc"
}
