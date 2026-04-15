import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Staff } from "@/modules/staff/types/staff.type";
import { serviceFormSchema, type ServiceFormInput } from "../schemas/service-form.schema";

interface Props {
  staffs: Staff[],
  isEdit: boolean,
  defaultValues?: Partial<ServiceFormInput>,
}

export const useServiceForm = ({
  defaultValues,
  staffs = [],
  isEdit = false,
}: Props) => {
    const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: "",
      initialActiveMinutes: undefined,
      isActive: true,
      staffIds: [],
      ...defaultValues,
    },
  });

  const selectedStaffIds = watch("staffIds") || [];

  const toggleStaff = (id: string) => {
    if(selectedStaffIds.includes(id)) {
      setValue("staffIds", selectedStaffIds.filter((staffId) => staffId !== id), { shouldDirty: true });
    } else {
      setValue("staffIds", [...selectedStaffIds, id], { shouldDirty: true });
    }
  };

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setImagePreview(null);
  }, [imageFile]);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if(defaultValues?.staffIds?.length || staffs.length && !isEdit) {
      setValue("staffIds", staffs.map((staff) => staff.id), { shouldDirty: true });
    }
  }, [staffs, defaultValues, setValue]);

  return {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    errors,
    selectedStaffIds,
    toggleStaff,
    imageInputRef,
    imageFile,
    setImageFile,
    imagePreview,
  };
}