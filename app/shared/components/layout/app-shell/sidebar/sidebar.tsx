import { Button } from '@/shared/components/ui';
import { SidebarMainNav } from './sidebar-main-nav';
import { SidebarSecondaryNav } from './sidebar-secondary-nav';
import { Heading } from '@/shared/components/typography';

export const Sidebar = () => {
  return (
    <div className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col justify-between rounded-4xl bg-white p-4 pt-4 shadow-sm xl:flex">
      <Heading className="mt-2 mb-4 text-4xl font-semibold tracking-tighter">
        Book
        <span className="font-bold text-indigo-600 ">ify</span>
      </Heading>
      <SidebarMainNav />

      <div className="flex-1" />
      <div className={`mb-4 bg-linear-to-br from-indigo-50 to-indigo-200 shadow-sm p-4 rounded-2xl transition-colors duration-300`}>
        <h3 className="text-xl text-mist-900 font-semibold mb-1">Activa tu plan</h3>
        <p className="text-mist-700 mb-2 text-sm font-medium">
          Tu prueba gratuita está activa. Conecta MercadoPago para mantener el acceso.
        </p>

        <Button variant="primary" fullWidth>
          Conectar Mercadopago
        </Button>
      </div>

      <SidebarSecondaryNav />
    </div>
  );
};
