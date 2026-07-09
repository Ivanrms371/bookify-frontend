import { useContext } from "react";
import { DashboardContext } from "../context/DashboardContext";

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard debe usarse dentro de un DashboardProvider');
  }
  return context;
};