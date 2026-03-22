import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const darkPref = localStorage.getItem("theme") === "dark";
    if (
      darkPref ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  if (!isMounted) return <div className="h-12 w-20"></div>;

  return (
    <button
      onClick={toggleDark}
      type="button"
      className="h-12 w-20 rounded-full bg-mist-200 dark:bg-mist-900/50  transition flex justify-center items-center gap-7 relative cursor-pointer"
    >
      <div
        className={twMerge(
          "absolute top-0 left-0 size-12 rounded-full transition-all duration-300 z-0 flex justify-center items-center",
          isDark ? "translate-x-8 bg-mist-800/50" : "translate-x-0 bg-white",
        )}
      >
        {isDark ? (
          <MoonIcon
            className={twMerge("size-5 z-10 transiion-all duration-300")}
          />
        ) : (
          <SunIcon
            className={twMerge("size-5 z-10 transition-all duration-300")}
          />
        )}
      </div>
    </button>
  );
};
