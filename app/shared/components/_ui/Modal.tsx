import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/shared/lib/utils";
import { useModalStore } from "@/shared/store/useModalStore";

interface NativeModalProps {
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({
  onClose,
  title,
  description,
  children,
  className,
}: NativeModalProps) => {
  const { isVisible } = useModalStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0", // ← usa isVisible
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl bg-white dark:bg-gray-950 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden",
          "transition-all duration-300 transform p-10",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0", // ← usa isVisible
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {title}
              </h2>
            )}
            {description && (
              <p className=" text-gray-500 mt-1 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors focus:outline-none focus:ring-2 ring-gray-300 dark:ring-gray-800"
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
