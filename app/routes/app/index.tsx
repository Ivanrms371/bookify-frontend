import { useAuthStore } from '@/core/auth/use-auth-store';
import { DashboardOverview } from '@/features/dashboard';
import { Heading, Text } from '@/shared/components/typography';
import { getFirstName } from '@/shared/utils/string';

const IndexPage = () => {
  const { session } = useAuthStore();

  return <DashboardOverview />;
};

export default IndexPage;
