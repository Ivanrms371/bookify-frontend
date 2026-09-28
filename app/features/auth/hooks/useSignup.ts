import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { authApi } from "../api/auth-api"

export const useSignup = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authApi.signup,
        onSuccess: (_, variables) => {
            const search = new URLSearchParams({ email: variables.email }).toString()
            navigate(`/auth/verify-email?${search}`)
        }
    })


}