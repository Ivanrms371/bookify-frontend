import { useMutation } from "@tanstack/react-query";

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });
      return response.json();
    },
  });
}