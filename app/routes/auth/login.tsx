import { Link } from 'react-router';
import { AuthDivider, AuthHeader, LoginForm, GoogleAuthButton } from '@/features/auth';
import { Text } from '@/shared/components/typography';

export default function LoginPage() {
  return (
    <>
      <AuthHeader title="¡Qué bueno verte de nuevo!" subtitle="Accede a tu agenda y gestiona todas tus citas" />

      <div className="mt-8 flex flex-col gap-6">
        <GoogleAuthButton />

        <AuthDivider />

        <LoginForm />

        <Text className="text-center text-sm">
          ¿No tienes una cuenta?
          <Link to="/auth/signup" className="ml-1 cursor-pointer text-indigo-600 hover:text-indigo-700">
            Crea una aquí
          </Link>
        </Text>
      </div>
    </>
  );
}
