import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  customerFormSchema,
  type CustomerFormValues,
} from "../schemas/customer-form.schema"

export const useCustomerForm = (
  onSubmit: (data: CustomerFormValues) => void,
  defaultValues?: Partial<CustomerFormValues>,
) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      countryCode: defaultValues?.countryCode ?? "+598",
      phone: defaultValues?.phone ?? "",
    },
  })

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    reset,
  }
}
