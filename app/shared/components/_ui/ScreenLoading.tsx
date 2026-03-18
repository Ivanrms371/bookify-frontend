import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

interface Props {
  message?: string;
  isLoading: boolean;
}

export const ScreenLoading = ({ message, isLoading }: Props) => {
  return (
    <div
      className={cn(
        "transition-opacity duration-500 absolute bg-gray-200/60 inset-0 flex justify-center items-center opacity-100 z-50 flex-col gap-6",
        !isLoading && "opacity-0 pointer-events-none",
      )}
    >
      <LoadingSpinner color="black" size="lg" />
      {message && (
        <p className=" text-gray-700 animate-pulse text-sm ">{message}</p>
      )}
    </div>
  );
};
