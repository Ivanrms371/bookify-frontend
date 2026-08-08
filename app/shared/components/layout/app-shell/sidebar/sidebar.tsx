import { Button } from '@/shared/components/ui';
import { SidebarMainNav } from './sidebar-main-nav';
import { SidebarSecondaryNav } from './sidebar-secondary-nav';
import { Heading } from '@/shared/components/typography';

import { cn } from '@/shared/utils/cn';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: Props) => {
  return (
    <>
      {/* Mobile backdrop overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-xs transition-opacity duration-300 xl:hidden" onClick={onClose} />
      )}
      <div
        className={cn(
          'fixed xl:sticky xl:left-0 z-50 top-0 left-0 xl:z-auto h-screen w-68 flex flex-col justify-between bg-white p-4 pt-4  transition-all duration-500 ease-in-out',
          open ? 'translate-x-0 opacity-100' : '-translate-x-full xl:translate-x-0 opacity-0 xl:opacity-100',
        )}
      >
        <Heading className="ml-4 mt-2 mb-4 text-4xl font-semibold tracking-tighter">
          Book
          <span className="font-bold text-indigo-600 ">ify</span>
        </Heading>
        <SidebarMainNav />

        <div className="flex-1" />
        <div className={`mb-4 bg-linear-to-br from-indigo-50 to-indigo-200 shadow-sm p-4 rounded-2xl transition-colors duration-300`}>
          <h3 className="text-xl text-gray-900 font-semibold mb-1">Activa tu plan</h3>
          <p className="text-gray-700 mb-2 text-sm font-medium">
            Tu prueba gratuita está activa. Conecta MercadoPago para mantener el acceso.
          </p>

          <Button variant="primary" size="sm" fullWidth>
            Conectar Mercadopago
          </Button>
        </div>

        <SidebarSecondaryNav />
      </div>
    </>
  );
};
