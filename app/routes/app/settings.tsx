import { TenantSettingsSection } from '@/features/settings/components/tenant-settings';
import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';

const SettingsPage = () => {
  return (
    <div className="max-w-6xl w-full mx-auto">
      <Heading as="h1" className="text-3xl font-semibold mb-6">
        Configuración
      </Heading>

      <div className="space-y-6 pb-16">
        <TenantSettingsSection />
      </div>
    </div>
  );
};

export default SettingsPage;
