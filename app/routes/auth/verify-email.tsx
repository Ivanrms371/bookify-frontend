import { Link, useSearchParams } from 'react-router';
import { AuthHeader } from '@/features/auth';
import { useResendVerification } from '@/features/auth/hooks/useResendVerification';
import { Button } from '@/shared/components/ui';
import { Alert } from '@/shared/components/feedback/Alert';
import { Text } from '@/shared/components/typography';
import { getApiError } from '@/shared/utils/getApiError';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const { mutateAsync: resend, isPending, isSuccess, error, reset } = useResendVerification();

  const onResend = async () => {
    if (!email) return;
    reset();
    try {
      await resend({ type: 'USER_EMAIL_VERIFICATION', email });
    } catch {}
  };

  return (
    <>
      <AuthHeader
        title="Confirma tu cuenta"
        subtitle={email ? `Te enviamos un email a ${email}, confírmalo para continuar.` : 'Te enviamos un email, confírmalo para continuar.'}
      />

      <div className="mt-8 flex flex-col gap-4">
        {error && <Alert message={getApiError(error)} title="No pudimos reenviar el email" variant="error" />}
        {isSuccess && !error && <Alert message="Revisa tu bandeja de entrada." title="Email reenviado" variant="success" />}

        <Button variant="primary" fullWidth onClick={onResend} disabled={!email} isSubmitting={isPending}>
          Reenviar email
        </Button>

        <Text className="text-center text-sm">
          ¿Ya confirmaste?
          <Link to="/auth/login" className="ml-1 cursor-pointer text-indigo-600 hover:text-indigo-700">
            Inicia sesión
          </Link>
        </Text>
      </div>
    </>
  );
}
