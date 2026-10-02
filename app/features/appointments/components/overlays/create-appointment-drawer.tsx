import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { addDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PhotoIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button, Drawer } from '@/shared/components/ui';
import { DrawerBody, DrawerFooter } from '@/shared/components/ui/drawer';
import { Spinner } from '@/shared/components/ui/spinner';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { useCustomerSearch } from '@/features/customers/hooks/use-customer-search';
import type { CustomerSearchItem } from '@/features/customers/types/customer-types';
import { useCreateAppointment } from '@/features/appointments/hooks/use-create-appointment';
import { createAppointmentSchema } from '@/features/appointments/schemas/create-appointment-schema';
import { useServiceProfessionals, useServices } from '@/features/services';
import { useAppointmentAvailability } from '@/features/availability';
import type { AppointmentAvailabilitySlot } from '@/features/availability';
import type { OverlayKey } from '@/shared/components/overlays/overlay-registry';
import { AppointmentDrawerCustomerSection, type CustomerMode } from './appointment-drawer-customer-section';
import { AppointmentSelectionSummary } from './appointment-selection-summary';
import { AppointmentDrawerScheduleSection } from './appointment-drawer-schedule-section';
import { EmptyInline, ProfessionalOption, SectionHeader, ServiceOption } from './appointment-drawer-options';

const OVERLAY_KEY: OverlayKey = 'create-appointment-drawer';

type CreateAppointmentDrawerProps = {
  defaultCustomerId?: string;
  defaultCustomerName?: string;
  defaultServiceId?: string;
  defaultProfessionalId?: string;
  defaultDate?: string;
  defaultStartsAt?: string;
};

function getInitialDate(defaultDate?: string, startsAt?: string) {
  if (defaultDate) return defaultDate;
  if (!startsAt) return format(new Date(), 'yyyy-MM-dd');
  return format(new Date(startsAt), 'yyyy-MM-dd');
}

function getInitialTime(startsAt?: string) {
  if (!startsAt) return null;
  return new Date(startsAt).toTimeString().slice(0, 5);
}

export const CreateAppointmentDrawer = ({
  defaultCustomerId,
  defaultCustomerName,
  defaultServiceId,
  defaultProfessionalId,
  defaultDate,
  defaultStartsAt,
}: CreateAppointmentDrawerProps) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const { open: openCreateCustomer } = useOverlay('create-customer-modal');
  const [customerQuery, setCustomerQuery] = useState('');
  const [customerMode, setCustomerMode] = useState<CustomerMode>(defaultCustomerId ? 'with-customer' : 'walk-in');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchItem | null>(
    defaultCustomerId
      ? {
          id: defaultCustomerId,
          name: defaultCustomerName ?? 'Cliente seleccionado',
          email: '',
          phoneNumber: '',
        }
      : null,
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(defaultServiceId ?? null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(defaultProfessionalId ?? null);
  const [selectedDate, setSelectedDate] = useState(getInitialDate(defaultDate, defaultStartsAt));
  const [selectedSlot, setSelectedSlot] = useState<AppointmentAvailabilitySlot | null>(
    defaultStartsAt
      ? {
          time: getInitialTime(defaultStartsAt) ?? '',
          startsAt: defaultStartsAt,
          endsAt: defaultStartsAt,
          status: 'available',
        }
      : null,
  );

  const [pageStart, setPageStart] = useState(() => getInitialDate(defaultDate, defaultStartsAt));
  const days = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) => {
        const date = addDays(parseISO(pageStart), index);
        return {
          date: format(date, 'yyyy-MM-dd'),
          dayNumber: format(date, 'd'),
          label: format(date, 'EEE', { locale: es }).replace('.', ''),
        };
      }),
    [pageStart],
  );

  const availabilityParams = useMemo(
    () => ({
      serviceId: selectedServiceId,
      professionalId: selectedProfessionalId,
      startDate: days[0]?.date ?? selectedDate,
      endDate: days[days.length - 1]?.date ?? selectedDate,
    }),
    [days, selectedDate, selectedProfessionalId, selectedServiceId],
  );
  const { data: servicesData, isLoading: isLoadingServices } = useServices();
  const services = servicesData?.data ?? [];
  const { data: professionals = [], isLoading: isLoadingProfessionals } = useServiceProfessionals(selectedServiceId);
  const { data: appointmentAvailability, isLoading: isLoadingAvailability } = useAppointmentAvailability(availabilityParams);
  const { data: customers = [], isLoading: isSearchingCustomers } = useCustomerSearch(
    customerMode === 'with-customer' ? customerQuery : '',
  );
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const selectedService = services.find((service) => service.id === selectedServiceId) ?? null;
  const selectedProfessional = professionals.find((professional) => professional.id === selectedProfessionalId) ?? null;
  const selectedDayAvailability = appointmentAvailability?.days.find((day) => day.date === selectedDate);
  const selectedDateSlots = selectedDayAvailability?.slots ?? [];
  const canSubmit = Boolean(selectedServiceId && selectedProfessionalId && selectedSlot && selectedSlot.status !== 'busy');

  useEffect(() => {
    if (!selectedProfessionalId || professionals.length === 0) return;
    if (!professionals.some((professional) => professional.id === selectedProfessionalId)) {
      setSelectedProfessionalId(null);
      setSelectedSlot(null);
    }
  }, [professionals, selectedProfessionalId]);

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedProfessionalId(null);
    setSelectedSlot(null);
  };

  const handleSelectDate = (date: string) => {
    if (date < days[0].date || date > days[days.length - 1].date) setPageStart(date);
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectProfessional = (professionalId: string) => {
    setSelectedProfessionalId(professionalId);
    setSelectedSlot(null);
  };

  const handleSelectCustomerMode = (mode: CustomerMode) => {
    setCustomerMode(mode);
    if (mode === 'walk-in') {
      setSelectedCustomer(null);
      setCustomerQuery('');
    }
  };

  const handleSubmit = () => {
    if (!selectedServiceId || !selectedProfessionalId || !selectedSlot) return;
    if (!canSubmit) return;

    console.log(selectedSlot.startsAt);

    const result = createAppointmentSchema.safeParse({
      serviceId: selectedServiceId,
      professionalId: selectedProfessionalId,
      startsAt: selectedSlot.startsAt,
      ...(selectedCustomer ? { customerId: selectedCustomer.id } : {}),
    });

    if (!result.success) {
      const fieldLabels: Record<string, string> = {
        serviceId: 'el servicio',
        professionalId: 'el profesional',
        startsAt: 'la fecha y hora',
        customerId: 'el cliente',
      };
      const field = fieldLabels[String(result.error.issues[0]?.path[0])];
      toast.error(field ? `Revisá ${field} de la reserva antes de continuar` : 'Revisá los datos de la reserva antes de continuar');
      return;
    }

    createAppointment(result.data, {
      onSuccess: () => {
        toast.success('Reserva creada correctamente');
        close();
      },
      onError: () => {
        toast.error('Ocurrió un error al crear la reserva');
      },
    });
  };

  return (
    <Drawer overlayKey={OVERLAY_KEY} size="3xl" closeOnBackdrop title="Nueva reserva" titleClassName="text-3xl sm:text-xl">
      <div className="flex h-full min-h-0 flex-col">
        <DrawerBody>
          <section className="space-y-3">
            <SectionHeader
              title="Seleccionar cliente"
              description="Opcional para walk-ins. Podés buscar un cliente existente o crear uno nuevo."
            />

            <AppointmentDrawerCustomerSection
              mode={customerMode}
              query={customerQuery}
              selectedCustomer={selectedCustomer}
              customers={customers}
              isSearching={isSearchingCustomers}
              onModeChange={handleSelectCustomerMode}
              onQueryChange={setCustomerQuery}
              onSelectCustomer={setSelectedCustomer}
              onClearCustomer={() => setSelectedCustomer(null)}
              onCreateCustomer={() => openCreateCustomer({})}
            />
          </section>

          <section className="space-y-3">
            <SectionHeader title="Seleccionar servicio" description="Elegí qué se va a reservar." />
            {isLoadingServices ? (
              <Spinner />
            ) : services.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <ServiceOption
                    key={service.id}
                    service={service}
                    isSelected={service.id === selectedServiceId}
                    onSelect={() => handleSelectService(service.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyInline icon={<PhotoIcon className="size-5" />} text="No hay servicios disponibles." />
            )}
          </section>

          <section className="space-y-3">
            <SectionHeader title="Seleccionar profesional" description="La lista se filtra según el servicio seleccionado." />
            {!selectedServiceId ? (
              <EmptyInline icon={<UserIcon className="size-5" />} text="Seleccioná un servicio para ver profesionales." />
            ) : isLoadingProfessionals ? (
              <Spinner />
            ) : professionals.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {professionals.map((professional) => (
                  <ProfessionalOption
                    key={professional.id}
                    professional={professional}
                    isSelected={professional.id === selectedProfessionalId}
                    onSelect={() => handleSelectProfessional(professional.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyInline icon={<UserIcon className="size-5" />} text="No hay profesionales para este servicio." />
            )}
          </section>

          <section className="space-y-3">
            <AppointmentDrawerScheduleSection
              title="Seleccionar fecha"
              days={days}
              slots={selectedDateSlots}
              availabilityDays={appointmentAvailability?.days}
              selectedDate={selectedDate}
              selectedStartsAt={selectedSlot?.startsAt ?? null}
              isLoading={isLoadingAvailability}
              isDisabled={!selectedServiceId || !selectedProfessionalId}
              missingSelection={!selectedServiceId ? 'service' : 'professional'}
              onSelectDate={handleSelectDate}
              onSelectSlot={setSelectedSlot}
            />
          </section>
        </DrawerBody>

        <DrawerFooter>
          <AppointmentSelectionSummary
            serviceName={selectedService?.name}
            professionalName={selectedProfessional?.name}
            date={selectedDate}
            time={selectedSlot?.time}
          />
          <Button type="button" variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" disabled={!canSubmit} isSubmitting={isPending} onClick={handleSubmit}>
            Crear reserva
          </Button>
        </DrawerFooter>
      </div>
    </Drawer>
  );
};
