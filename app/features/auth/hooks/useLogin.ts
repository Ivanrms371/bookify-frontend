
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth-api";
import { useAuthStore } from "@/core/auth/useAuthStore";

export const useLogin = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: ({ user, tenant }) => {
            setAuth(user, tenant);

            if (!tenant) {
                navigate('/onboarding/welcome')
            } else {
                navigate(`/${tenant.slug}`)
            }
        },
        onError: (error) => {
            console.log(error);
        }
    })

    
}