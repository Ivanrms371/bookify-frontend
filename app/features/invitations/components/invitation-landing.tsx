import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { invitationsApi } from '../api/invitations-api';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { authApi } from '@/features/auth/api/auth-api';
import { SignupForm } from '@/features/auth/components/signup-form';
import { GoogleAuthButton } from '@/features/auth/components/google-auth-button';
import { Button } from '@/shared/components/ui';

export function InvitationLanding() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const [registering, setRegistering] = useState(false);
  useEffect(() => {
    if (token) sessionStorage.setItem('invitationToken', token);
  }, [token]);
  const query = useQuery({
    queryKey: ['invitation-token', token],
    enabled: !!token,
    retry: false,
    queryFn: () => invitationsApi.validate(token),
  });
  const submitting = useRef(false);
  const accept = useMutation({
    retry: false,
    mutationFn: async () => {
      const target = await invitationsApi.accept(token);
      const context = await authApi.getMe(target.tenantId);
      useAuthStore.getState().setAuth(context);
      sessionStorage.removeItem('invitationToken');
      navigate(`/${target.tenantSlug}`, { replace: true });
    },
    onError: () => {
      void query.refetch();
    },
  });
  const invitation = query.data;
  const matching = session?.email.toLowerCase() === invitation?.email.toLowerCase();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <section className="w-full max-w-lg space-y-5 rounded-xl bg-white p-6 shadow-sm" aria-busy={query.isLoading || accept.isPending}>
        <h1 className="text-2xl font-semibold">Invitación a Bookify</h1>
        {!token ? (
          <p role="alert">El enlace está incompleto.</p>
        ) : query.isLoading ? (
          <p role="status">Cargando invitación...</p>
        ) : query.isError ? (
          <div role="alert">
            <p>{query.error.message}</p>
            <Button variant="secondary" onClick={() => void query.refetch()}>
              Reintentar
            </Button>
          </div>
        ) : (
          invitation && (
            <>
              <p>
                {invitation.businessName}
                {invitation.professional ? ` · ${invitation.professional.name}` : ''}
              </p>
              <p>Destinatario: {invitation.email}</p>
              {params.has('error') && <p role="alert">No se pudo aceptar con Google. Usá la cuenta del destinatario e intentá de nuevo.</p>}
              {invitation.status === 'EXPIRED' && <p role="alert">Esta invitación venció. Solicitá una nueva al administrador.</p>}
              {invitation.status === 'REVOKED' && <p role="alert">Esta invitación fue cancelada.</p>}
              {invitation.status === 'ACCEPTED' && <p>Esta invitación ya fue aceptada.</p>}
              {['VALID', 'ACCEPTED'].includes(invitation.status) &&
                authenticated &&
                (!matching ? (
                  <div role="alert">
                    <p>
                      La cuenta activa ({session?.email}) no corresponde al destinatario. Iniciá sesión con {invitation.email}.
                    </p>
                    <Link
                      className="text-indigo-600"
                      to={`/auth/login?${new URLSearchParams({ invitationToken: token, email: invitation.email })}`}
                    >
                      Cambiar de cuenta
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    disabled={accept.isPending}
                    onClick={async () => {
                      if (submitting.current) return;
                      submitting.current = true;
                      try {
                        await accept.mutateAsync();
                      } catch {
                      } finally {
                        submitting.current = false;
                      }
                    }}
                  >
                    {accept.isPending ? 'Aceptando...' : invitation.status === 'ACCEPTED' ? 'Entrar al espacio' : 'Aceptar invitación'}
                  </Button>
                ))}
              {['VALID', 'ACCEPTED'].includes(invitation.status) && !authenticated && (
                <>
                  <GoogleAuthButton invitationToken={token} />
                  <Link
                    className="block text-indigo-600"
                    to={`/auth/login?${new URLSearchParams({ invitationToken: token, email: invitation.email })}`}
                  >
                    Iniciar sesión
                  </Link>
                  {invitation.status === 'VALID' && !invitation.hasExistingUser && (
                    <Button variant="secondary" onClick={() => setRegistering(!registering)}>
                      Crear cuenta
                    </Button>
                  )}
                  {registering && <SignupForm token={token} email={invitation.email} />}
                </>
              )}
              {accept.error && (
                <p role="alert" className="text-red-600">
                  {accept.error.message}
                </p>
              )}
            </>
          )
        )}
      </section>
    </main>
  );
}
