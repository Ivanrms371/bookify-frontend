import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { authService } from "../services/auth.service"

export const useSignup = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authService.signup,
        onSuccess: (_, variables) => {
            navigate('/auth/verify-email', {
                state: { email: variables.email }
            })
        }
    })


}