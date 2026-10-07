import { can } from '@/core/auth/permissions';
import { Card } from '@/shared/components/ui/card';
import { Heading, Text } from '@/shared/components/typography';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ScheduleForm } from '../../schedule/components/schedule-form';
import { ScheduleExceptionsList } from '../../schedule/components/exceptions/schedule-exceptions-list';
import { useTenantWorkingHours } from '@/features/schedule/hooks/use-tenant-working-hours';
import { useSaveTenantWorkingHours } from '@/features/schedule/hooks/use-save-tenant-working-hours';
import { SettingsLoadState } from './settings-load-state';
import { toast } from 'sonner';
import type { SettingsFormProps } from '../types/settings-draft.types';
import { isSettingsTenantCurrent } from '../utils/settings-context';

export const ScheduleSettings = ({ active = true }: SettingsFormProps) => {
  const { session } = useAuthStore();
  const { activeTenant } = session!;
  const tenantId = activeTenant!.id;
  const hours = useTenantWorkingHours(tenantId);
  const save = useSaveTenantWorkingHours(tenantId);

  return (
    <div className="space-y-12">
      <Card as="section" className="p-6 md:p-8" aria-labelledby="schedule-settings-title">
        <div className="pb-6 mb-6 border-b border-gray-100">
          <Heading as="h2" id="schedule-settings-title" className="text-xl md:text-2xl font-bold text-gray-800">
            Horarios
          </Heading>
          <Text size="base" className="text-gray-500">
            Configura los días y horarios de atención de tu negocio.
          </Text>
          {!can(activeTenant, 'tenant:update') && (
            <p className="text-sm text-gray-500 mt-2">No tienes permiso para modificar el horario del negocio.</p>
          )}
        </div>
        {hours.isError && hours.data && <SettingsLoadState retry={() => void hours.refetch()} />}
        {hours.isPending ? (
          <SettingsLoadState loading />
        ) : !hours.data ? (
          <SettingsLoadState retry={() => void hours.refetch()} />
        ) : (
          <ScheduleForm
            id="settings-schedule-form"
            defaultValues={hours.data}
            showSaveBar={active}
            readOnly={!can(activeTenant, 'tenant:update')}
            onSubmit={async (values) => {
              try {
                await save.mutateAsync(values);
                if (isSettingsTenantCurrent(tenantId)) toast.success('Horarios guardados correctamente');
              } catch (error) {
                if (isSettingsTenantCurrent(tenantId))
                  toast.error(error instanceof Error ? error.message : 'No se pudieron guardar los horarios');
                throw error;
              }
            }}
          />
        )}
      </Card>
      <ScheduleExceptionsList />
    </div>
  );
};
