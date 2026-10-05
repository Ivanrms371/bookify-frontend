import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { DashboardOverview } from '@/features/dashboard';
import { professionalApi } from '@/features/professionals/api/professional-api';

const IndexPage = () => {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const { data } = useQuery({
    queryKey: ['professionals', tenant?.id, 'setup'],
    queryFn: () => professionalApi.getListing({ take: 1, skip: 0, isActive: true }),
    enabled: tenant?.role === 'OWNER',
  });
  return (
    <>
      {data?.meta.total === 0 && (
        <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 p-5">
          <p className="mb-2 font-medium">Agrega un profesional para comenzar a recibir reservas.</p>
          <Link to={`/${tenant?.slug}/professionals`} className="text-indigo-700 underline">
            Agregar profesional
          </Link>
        </div>
      )}
      <DashboardOverview />
    </>
  );
};
export default IndexPage;
