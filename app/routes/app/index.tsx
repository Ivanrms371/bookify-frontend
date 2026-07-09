import { useAuthStore } from '@/core/auth/useAuthStore';
import { DashboardOverview } from '@/features/dashboard';
import { Heading, Text } from '@/shared/components/typography';
import { getFirstName } from '@/shared/utils/string';

const IndexPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Heading as="h1" className="text-3xl font-semibold">
        Hola {getFirstName(user?.name)}
      </Heading>
      <Text className="text-gray-600 mb-4">Resumen de tu agenda </Text>
      <DashboardOverview />
    </div>
  );
};

export default IndexPage;
