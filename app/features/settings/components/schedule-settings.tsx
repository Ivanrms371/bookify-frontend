import React from 'react';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { ScheduleForm } from '../../schedule/components/schedule-form';
import { ScheduleExceptionsList } from '../../schedule/components/exceptions/schedule-exceptions-list';

export const ScheduleSettings = () => {
  const { session } = useAuthStore();
  const { activeTenant } = session!;

  return (
    <div className="space-y-12">
      <ScheduleForm tenantId={activeTenant!.id} />
      <ScheduleExceptionsList />
    </div>
  );
};
