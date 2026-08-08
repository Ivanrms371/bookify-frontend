import { useEffect } from 'react';
import type { FieldValues, Path, UseFormSetError, UseFormGetValues } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/core/error/api-error';

export function useApiFormError<T extends FieldValues>(
  error: ApiError | null | undefined,
  setError: UseFormSetError<T>,
  getValues: UseFormGetValues<T>,
) {
  useEffect(() => {
    if (!error) return;

    if (error.hasFields()) {
      const validFields = Object.keys(getValues()) as Path<T>[];
      let mappedAny = false;

      Object.entries(error.fields).forEach(([field, message]) => {
        if (validFields.includes(field as Path<T>)) {
          setError(field as Path<T>, { message });
          mappedAny = true;
        }
      });

      if (!mappedAny) toast.error(error.message);
      return;
    }

    toast.error(error.message);
  }, [error, setError, getValues]);
}
