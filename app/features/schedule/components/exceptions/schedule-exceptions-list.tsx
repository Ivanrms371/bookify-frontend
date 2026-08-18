import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { Text } from '@/shared/components/typography';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useScheduleExceptions } from '../../hooks/exceptions/use-schedule-exceptions';
import { formatExceptionDates } from '../../utils/format-exceptions';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';

export const ScheduleExceptionsList = () => {
  const { data: exceptions, isLoading } = useScheduleExceptions();

  const addExceptionModal = useOverlay('add-exception-modal');
  const updateExceptionModal = useOverlay('update-exception-modal');
  const deleteExceptionModal = useOverlay('delete-exception-modal');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start pb-6 border-b border-gray-100 mb-6 gap-4">
        <div className="flex-1">
          <Text className="text-xl font-bold text-gray-800">Excepciones y Feriados</Text>
          <Text className="text-gray-500">Fechas específicas en las que el horario cambia o el negocio está cerrado.</Text>
        </div>
        <div>
          <Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto" onClick={addExceptionModal.open}>
            + Agregar fecha
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {exceptions && exceptions.length > 0 ? (
          exceptions.map((exception) => {
            const { startDate, endDate, blocks, id, isClosed, reason } = exception;
            return (
              <div
                key={exception.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 gap-4 transition-all hover:border-gray-300"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Text className="font-medium text-gray-800">{formatExceptionDates(startDate, endDate)}</Text>
                    <span
                      className={cn(
                        'items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800',
                        isClosed ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-700',
                      )}
                    >
                      {isClosed ? 'Cerrado todo el día' : 'Horario Especial'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {!isClosed && (
                      <div className="flex gap-2">
                        {blocks.map((block, index) => (
                          <div key={index} className="flex items-center gap-1 text-sm text-gray-700">
                            {block.opensAt}
                            <ArrowLongRightIcon className="size-4.5 text-gray-700" />
                            {block.closesAt}
                            {blocks.length > index + 1 && ','}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {exception.reason && <Text className="text-sm text-gray-500 mt-1">Mótivo: {exception.reason}</Text>}
                  <Text className="text-sm text-gray-400 mt-1">
                    Aplica a: {exception.professionals.map((p) => p.displayName).join(', ')}
                  </Text>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    onClick={() => updateExceptionModal.open({ exception })}
                  >
                    <PencilIcon className="size-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => deleteExceptionModal.open({ exception })}
                  >
                    <TrashIcon className="size-5" />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Text className="text-gray-500">No hay excepciones configuradas.</Text>
          </div>
        )}
      </div>
    </div>
  );
};
