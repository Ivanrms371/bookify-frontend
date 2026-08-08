import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { authApi } from "../api/auth-api"

export const useSignup = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authApi.signup,
        onSuccess: (_, variables) => {
            navigate('/auth/verify-email', {
                state: { email: variables.email }
            })
        }
    })


}