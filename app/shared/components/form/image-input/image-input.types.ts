export interface ImageInputProps {
  id?: string;
  value?: File | null;
  onChange?: (image: File | null) => void;
  previewClassName?: string;
  errorMessage?: string;
  className?: string;
  variant: 'avatar' | 'card' | 'compact' | 'banner';
}
