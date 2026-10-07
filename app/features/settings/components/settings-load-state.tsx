import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';

export function SettingsLoadState({ loading, retry }: { loading?: boolean; retry?: () => void }) {
  if (loading)
    return (
      <div className="flex justify-center py-12" role="status" aria-label="Cargando configuración">
        <Loader2 className="size-6 animate-spin text-gray-400" />
      </div>
    );
  return (
    <div role="alert" className="space-y-4 rounded-3xl bg-white p-6">
      <p>No se pudo cargar la configuración. Vuelve a intentarlo.</p>
      {retry && (
        <Button type="button" variant="secondary" onClick={retry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
