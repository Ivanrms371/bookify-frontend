import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingInitSchema,
  type OnboardingInitInput,
} from "../schemas/onboarding-init.schema";
import { softSlugify } from "@/shared/utils/formatters";
import { onboardingApi } from "../api/onboarding.api";
import { useNavigate, useRevalidator } from "react-router";
import { useOnboardingStore } from "../store/onboarding-store";

export const useOnboardingSetup = () => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { setBusinessId } = useOnboardingStore();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<OnboardingInitInput>({
    resolver: zodResolver(onboardingInitSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const businessName = watch("name");

  useEffect(() => {
    if (!dirtyFields.slug) {
      if (businessName) {
        const generatedSlug = softSlugify(businessName);

        setValue("slug", generatedSlug, { shouldValidate: !!errors.slug });
      } else {
        setValue("slug", "", { shouldValidate: !!errors.slug });
      }
    }
  }, [businessName, dirtyFields.slug, setValue, errors.slug]);

  const onSubmit = async (formData: OnboardingInitInput) => {
    setFormError(null);

    try {
      const res = await onboardingApi.setup(formData);
      setBusinessId(res.business.id);
      revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    formError,
    errors,
    isSubmitting,
    onSubmit,
  };
};
