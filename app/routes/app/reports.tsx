import { useAuthStore } from '@/core/auth/useAuthStore';
import { Heading, Text } from '@/shared/components/typography';

const ReportsPage = () => {
  const tenant = useAuthStore((s) => s.tenant);

  if (!tenant) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Heading as="h1" className="text-xl font-medium text-gray-600 lg:text-2xl xl:text-3xl">
        Reportes
      </Heading>
      <Text className="mt-1 text-base md:text-lg">Consulta métricas y estadísticas de tu negocio.</Text>
    </div>
  );
};

export default ReportsPage;
