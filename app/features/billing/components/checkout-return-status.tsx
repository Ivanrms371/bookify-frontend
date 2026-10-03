import { Link, useParams } from 'react-router';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui';

const messages = {
  confirming: {
    title: 'Confirmando tu suscripción',
    text: 'Estamos esperando la confirmación de Lemon Squeezy. Puede tardar unos segundos.',
  },
  confirmed: { title: 'Tu suscripción está lista', text: 'Bookify ha confirmado tu plan. Ya puedes volver a tu negocio.' },
  pending: {
    title: 'La confirmación sigue pendiente',
    text: 'Todavía no recibimos la confirmación. Puedes comprobar de nuevo o volver a Facturación. No necesitas repetir el pago.',
  },
  error: {
    title: 'No pudimos comprobar tu suscripción',
    text: 'Comprueba tu conexión y vuelve a intentarlo. Este error no significa que el pago haya fallado.',
  },
  invalid: { title: 'No encontramos la selección del plan', text: 'Abre Facturación para consultar el estado actual de tu suscripción.' },
};
export function CheckoutReturnStatus({ state, onRetry }: { state: keyof typeof messages; onRetry: () => void }) {
  const { slug } = useParams();
  const Icon = state === 'confirmed' ? CheckCircleIcon : state === 'error' || state === 'invalid' ? ExclamationTriangleIcon : ClockIcon;
  return (
    <section role="status" className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center">
      <Icon className="mx-auto mb-4 size-10 text-indigo-600" />
      <h1 className="text-2xl font-semibold text-gray-900">{messages[state].title}</h1>
      <p className="mt-3 text-sm text-gray-500">{messages[state].text}</p>
      {(state === 'pending' || state === 'error') && (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          Comprobar de nuevo
        </Button>
      )}
      <Link to={`/${slug}/billing`} className="mt-6 block text-sm font-medium text-indigo-600">
        Volver a facturación
      </Link>
      {state === 'confirmed' && (
        <Link to={`/${slug}`} className="mt-3 block text-sm font-medium text-indigo-600">
          Ir al inicio
        </Link>
      )}
    </section>
  );
}
