import { Download } from 'lucide-react';
import { CalendarDaysIcon, UserIcon, TagIcon } from '@heroicons/react/20/solid';
import { Input } from '@/shared/components/form/input';
import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui/button';
import { Select } from '@/shared/components/ui/select';
import type { ReportsFiltersProps } from '../types/reports-props.types';

const filterFocus = 'w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500';


export function ReportsFilters({ value, options, onChange, optionsLoading, dateError }: ReportsFiltersProps) {
  return (
    <section aria-label="Filtros de reportes" className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1 basis-48 space-y-2">
          <Text className="flex items-center gap-2 text-sm font-medium">
            <CalendarDaysIcon className="size-4" aria-hidden="true" />
            Período
          </Text>
          <Select
            label="Período"
            value={value.period}
            onValueChange={(period) => onChange({ ...value, period: period as ReportsFiltersProps['value']['period'] })}
            className={filterFocus}
            options={[
              { value: 'this-month', label: 'Este mes' },
              { value: 'last-month', label: 'Mes pasado' },
              { value: 'custom', label: 'Fechas personalizadas' },
            ]}
          />
        </div>
        <div className="min-w-0 flex-1 basis-48 space-y-2">
          <Text className="flex items-center gap-2 text-sm font-medium">
            <UserIcon className="size-4" aria-hidden="true" />
            Profesional
          </Text>
          <Select
            label="Profesional"
            disabled={optionsLoading}
            value={value.professionalId}
            onValueChange={(professionalId) => onChange({ ...value, professionalId })}
            className={filterFocus}
            options={[
              { value: 'all', label: 'Todos los profesionales' },
              ...options.professionals.map(({ id, name }) => ({ value: id, label: name })),
            ]}
          />
        </div>
        <div className="min-w-0 flex-1 basis-48 space-y-2">
          <Text className="flex items-center gap-2 text-sm font-medium">
            <TagIcon className="size-4" aria-hidden="true" />
            Servicio
          </Text>
          <Select
            label="Servicio"
            disabled={optionsLoading}
            value={value.serviceId}
            onValueChange={(serviceId) => onChange({ ...value, serviceId })}
            className={filterFocus}
            options={[
              { value: 'all', label: 'Todos los servicios' },
              ...options.services.map(({ id, name }) => ({ value: id, label: name })),
            ]}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          disabled
          className="shrink-0"
          icon={<Download className="size-5" aria-hidden="true" />}
          iconPosition="left"
        >
          Exportar CSV
        </Button>
      </div>
      {value.period === 'custom' && (
        <div className="flex flex-wrap gap-4">
          <div className="min-w-0 flex-1 basis-48">
            <Input
              id="reports-start-date"
              label="Desde"
              type="date"
              value={value.startDate}
              aria-invalid={!!dateError}
              aria-describedby={dateError ? 'reports-date-error' : undefined}
              max={value.endDate || undefined}
              onChange={(event) => onChange({ ...value, startDate: event.target.value })}
            />
          </div>
          <div className="min-w-0 flex-1 basis-48">
            <Input
              id="reports-end-date"
              label="Hasta"
              type="date"
              value={value.endDate}
              aria-invalid={!!dateError}
              aria-describedby={dateError ? 'reports-date-error' : undefined}
              min={value.startDate || undefined}
              onChange={(event) => onChange({ ...value, endDate: event.target.value })}
            />
          </div>
        </div>
      )}
      {dateError && <Text id="reports-date-error" role="alert" className="text-sm text-red-700">{dateError}</Text>}
    </section>
  );
}
