import { cn } from "@/shared/lib/utils";

interface Props {
  message?: string | null;
  className?: string;
}

export const FormAlert = ({ message, className }: Props) => {
  if (message) {
    return (
      <div className={cn("text-red-600 font-medium text-sm ", className)}>
        {message}
      </div>
    );
  }
};
