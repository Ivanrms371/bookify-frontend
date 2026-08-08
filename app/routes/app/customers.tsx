import { useAuthStore } from '@/core/auth/useAuthStore';
import { Customers } from '@/features/customers/components/customers';
import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { PlusIcon } from '@heroicons/react/20/solid';

const CustomersPage = () => {
  const { open } = useOverlay('create-customer-drawer');
  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row justify-between md:items-center pb-4 border-b border-gray-200">
        <div>
          <Heading as="h1" className="text-3xl font-semibold">
            Clientes
          </Heading>
          <Text className="text-gray-600">Gestiona tus clientes</Text>
        </div>
        <div>
          <Button variant="primary" className="min-w-40" icon={<PlusIcon className="size-5" />} iconPosition="left" onClick={open}>
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <Customers />
    </>
  );
};

export default CustomersPage;
