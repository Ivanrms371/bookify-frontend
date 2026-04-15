import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/shared/lib/utils";

interface StatsCardProps {
  title: string;
  titleOnComplete: string;
  state: "pending" | "completed";
  buttonText: string;
  buttonLink?: string;
  buttonAction?: () => void;
}
export const TaskCard = ({
  title,
  titleOnComplete,
  state,
  buttonText,
  buttonLink,
  buttonAction,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "gap-2 flex items-center rounded-4xl ring-2 ring-mist-50 p-6",
        state === "pending" ? "bg-orange-200 cursor-pointer" : "",
        state === "completed" ? "bg-green-200 cursor-default" : "",
      )}
      onClick={() => {
        if (buttonLink) {
          console.log("redireccionaodo");
          return;
        }
        buttonAction?.();
      }}
    >
      <div
        className={cn(
          "p-5 rounded-full ",
          state === "pending" ? "bg-orange-100 " : "",
          state === "completed" ? "bg-green-100" : "",
        )}
      >
        {state === "pending" && (
          <ExclamationTriangleIcon className={cn("size-6 text-orange-400")} />
        )}
        {state === "completed" && (
          <CheckIcon className={cn("size-6 text-green-400")} />
        )}
      </div>
      <div className="flex-1">
        <div className="text-mist-900 font-bold mb-1">
          {state === "pending" ? title : titleOnComplete}
        </div>
        {state === "pending" && (
          <div className="text-mist-700 text-sm hover:text-mist-900 transition-colors">
            {buttonText}
          </div>
        )}
      </div>
    </div>
  );
};
