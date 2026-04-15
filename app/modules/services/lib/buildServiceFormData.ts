import type { CreateServiceInput } from "../types/service-create.type"
import type { UpdateServiceInput } from "../types/service-update.type"

export const buildServiceFormData = (data: CreateServiceInput | Partial<UpdateServiceInput>) => {
  const formData = new FormData()

  const appendIfExists = (key: string, value: unknown) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, String(value))
    }
  }

  appendIfExists("name", data.name)
  appendIfExists("price", data.price)
  appendIfExists("initialActiveMinutes", data.initialActiveMinutes)
  appendIfExists("isActive", data.isActive)
  appendIfExists("description", data.description)
  appendIfExists("passiveTimeMinutes", data.passiveTimeMinutes)
  appendIfExists("finalActiveMinutes", data.finalActiveMinutes)
  appendIfExists("discountPercentage", data.discountPercentage)
  appendIfExists("discountFixed", data.discountFixed)

  if (data.staffIds?.length) {
    data.staffIds.forEach((id) => formData.append("staffIds", id))
  }

  if (data.image) {
    formData.append("image", data.image)
  }

  return formData
}