import { useEffect } from "react";
import { useBusinessStore } from "../store/business.store";

export const useBusiness = () => {
  const {} = useBusinessStore();

  useEffect(() => {}, []);
};
