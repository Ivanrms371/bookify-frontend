export interface Service {
  id: string
  name: string
  image: string | null
  description?: string
  price: number
  discountPercentage?: number
  discountFixed?: number
  durationMinutes: number
  isActive: boolean
  assignments?: string[]
}
