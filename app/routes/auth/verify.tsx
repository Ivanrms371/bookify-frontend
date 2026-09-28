import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AuthHeader } from '@/features/auth';
import { useVerifyToken } from '@/features/auth/hooks/useVerifyToken';
import type { VerificationType } from '@/features/auth/api/verifications-api';
import { Alert } from '@/shared/components/feedback/Alert';
import { Button } from '@/shared/components/ui';
import { Text } from '@/shared/components/typography';
import { getApiError } from '@/shared/utils/getApiError';

const VALID_TYPES: readonly VerificationType[] = ['USER_EMAIL_VERIFICATION', 'USER_PHONE_VERIFICATION', 'PASSWORD_RESET'];

const isVerificationType = (value: string | null): value is VerificationType => value !== null && (VALID_TYPES as readonly string[]).includes(value);

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const firedRef = useRef(false);

  const token = searchParams.get('token');
  const typeParam = searchParams.get('type');
  const type = isVerificationType(typeParam) ? typeParam : null;

  const { mutateAsync: verify, isPending, isSuccess, error } = useVerifyToken();

  useEffect(() => {
    if (firedRef.current) return;
    if (!token || !type) return;
    firedRef.current = true;
    verify({ token, type }).catch(() => {});
  }, [token, type, verify]);

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => navigate('/auth/login'), 2500);
    return () => clearTimeout(timer);
  }, [isSuccess, navigate]);

  const missingParams = !token || !type;

  return (
    <>
      <AuthHeader
        title={isSuccess ? '¡Cuenta confirmada!' : 'Confirmando tu cuenta'}
        subtitle={isSuccess ? 'Te redirigimos al inicio de sesión en un momento.' : 'Estamos verificando tu enlace, esto solo toma un instante.'}
      />

      <div className="mt-8 flex flex-col gap-4">
        {missingParams && <Alert title="Enlace inválido" message="El enlace de verificación es inválido o está incompleto." variant="error" />}

        {!missingParams && isPending && <Text className="text-center text-sm text-gray-600">Verificando…</Text>}

        {!missingParams && error && <Alert title="No pudimos confirmar tu cuenta" message={getApiError(error)} variant="error" />}

        {isSuccess && <Alert title="Todo listo" message="Tu correo fue confirmado correctamente." variant="success" />}

        {isSuccess ? (
          <Button variant="primary" fullWidth onClick={() => navigate('/auth/login')}>
            Ir a iniciar sesión
          </Button>
        ) : (
          <Text className="text-center text-sm">
            ¿Problemas con el enlace?
            <Link to="/auth/verify-email" className="ml-1 cursor-pointer text-indigo-600 hover:text-indigo-700">
              Reenviar email
            </Link>
          </Text>
        )}
      </div>
    </>
  );
}
