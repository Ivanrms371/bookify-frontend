import { Link } from "react-router";
import { AuthWrapper } from "../components/AuthWrapper";
import { LoginForm } from "../components/LoginForm";
import { GoogleAuthButton } from "../components/GoogleAuthButton";
import { AuthDivider } from "../components/AuthDivider";
import { AuthHeader } from "../components/AuthHeader";

export default function LoginPage() {
  return (
    <AuthWrapper>
      <AuthHeader title="Bienvenido de vuelta" />

      <div className="flex flex-col gap-6">
        <GoogleAuthButton />

        <AuthDivider />

        <LoginForm />

        <p className="text-center text-mist-500 dark:text-mist-400 text-sm font-medium">
          ¿No tienes una cuenta?
          <Link
            to="/signup"
            className="ml-1 text-mist-900 dark:text-mist-200 font-bold cursor-pointer hover:underline underline-offset-2"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </AuthWrapper>
  );
}
