import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@/shared/store/useThemeStore";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <>{children}</>;
};