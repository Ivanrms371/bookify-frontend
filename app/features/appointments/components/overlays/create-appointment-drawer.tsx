import { useLocation } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { can, canManageAppointment } from '@/core/auth/permissions';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
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
import { useAppointmentDrawerSchedule } from '../../hooks/use-appointment-drawer-schedule';
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

export const CreateAppointmentDrawer = ({
  defaultCustomerId,
  defaultCustomerName,
  defaultServiceId,
  defaultProfessionalId,
  defaultDate,
  defaultStartsAt,
}: CreateAppointmentDrawerProps) => {
  const { close } = useOverlay(OVERLAY_KEY);
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const ownOnly = !can(tenant, 'appointment:create_others');
  const initialTenantId = useRef(tenant?.id).current;
  const { pathname } = useLocation();
  const initialPath = useRef(pathname).current;
  const stale = tenant?.id !== initialTenantId || pathname !== initialPath;
  useEffect(() => { if (stale) close(); }, [stale, close]);
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
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>((ownOnly ? tenant?.professionalId : defaultProfessionalId) ?? null);
  const professionalId = ownOnly ? tenant?.professionalId ?? null : selectedProfessionalId;
  const servicesQuery = useServices(
    ownOnly ? { professionalId: tenant?.professionalId ?? undefined, isActive: true } : { isActive: true },
    !ownOnly || Boolean(tenant?.professionalId),
  );
  const { data: servicesData, isLoading: isLoadingServices } = servicesQuery;
  const services = servicesData?.data ?? [];
  const selectedService = services.find((service) => service.id === selectedServiceId) ?? null;
  const schedule = useAppointmentDrawerSchedule({
    serviceId: selectedService ? selectedServiceId : null,
    professionalId,
    initialDate: defaultDate,
    initialStartsAt: defaultStartsAt,
  });
  const { selectedDate, selectedSlot, clearSelection } = schedule;
  const { data: allProfessionals = [], isLoading: isLoadingProfessionals } = useServiceProfessionals(selectedServiceId, !ownOnly);
  const { data: customers = [], isLoading: isSearchingCustomers } = useCustomerSearch(
    customerMode === 'with-customer' ? customerQuery : '',
  );
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const professionals = allProfessionals;
  const selectedProfessional = professionals.find((professional) => professional.id === selectedProfessionalId) ?? null;
  const canSubmit = Boolean(selectedService) && schedule.hasValidSelection && canManageAppointment(tenant, 'create', professionalId);

  useEffect(() => {
    if (ownOnly || !selectedProfessionalId || professionals.length === 0) return;
    if (!professionals.some((professional) => professional.id === selectedProfessionalId)) {
      setSelectedProfessionalId(null);
      clearSelection();
    }
  }, [ownOnly, professionals, selectedProfessionalId, clearSelection]);

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedProfessionalId(ownOnly ? tenant?.professionalId ?? null : null);
    clearSelection();
  };

  const handleSelectProfessional = (professionalId: string) => {
    setSelectedProfessionalId(professionalId);
    clearSelection();
  };

  const handleSelectCustomerMode = (mode: CustomerMode) => {
    setCustomerMode(mode);
    if (mode === 'walk-in') {
      setSelectedCustomer(null);
      setCustomerQuery('');
    }
  };

  const handleSubmit = () => {
    if (!selectedServiceId || !professionalId || !selectedSlot) return;
    if (!canSubmit || stale) return;

    console.log(selectedSlot.startsAt);

    const result = createAppointmentSchema.safeParse({
      serviceId: selectedServiceId,
      professionalId,
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

  if (stale) return null;
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
            <SectionHeader title="Seleccionar servicio" description={ownOnly ? 'Elegí uno de tus servicios asignados.' : 'Elegí qué se va a reservar.'} />
            {ownOnly && !tenant?.professionalId ? (
              <p role="alert" className="text-sm text-gray-600">No tienes un perfil profesional vinculado. Contacta al administrador para crear reservas.</p>
            ) : servicesQuery.isError ? (
              <div role="alert" className="space-y-2">
                <p className="text-sm text-gray-600">No se pudieron cargar los servicios.</p>
                <Button variant="secondary" onClick={() => void servicesQuery.refetch()}>Reintentar</Button>
              </div>
            ) : isLoadingServices ? (
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
              <EmptyInline icon={<PhotoIcon className="size-5" />} text={ownOnly ? 'No tienes servicios asignados disponibles. Contacta al administrador.' : 'No hay servicios disponibles.'} />
            )}
          </section>

          {!ownOnly && <section className="space-y-3">
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
          </section>}

          <section className="space-y-3">
            <AppointmentDrawerScheduleSection
              title="Seleccionar fecha"
              days={schedule.days}
              slots={schedule.slots}
              availabilityDays={schedule.availability.data?.days}
              selectedDate={selectedDate}
              selectedStartsAt={selectedSlot?.startsAt ?? null}
              isLoading={schedule.availability.isFetching}
              interactionDisabled={isPending}
              isDisabled={!selectedService || !professionalId}
              missingSelection={!selectedServiceId ? 'service' : 'professional'}
              onSelectDate={schedule.selectDate}
              onSelectSlot={schedule.selectSlot}
            />
          </section>
        </DrawerBody>

        <DrawerFooter>
          <AppointmentSelectionSummary
            serviceName={selectedService?.name}
            professionalName={ownOnly ? 'Tú' : selectedProfessional?.name}
            date={selectedDate}
            time={selectedSlot?.time}
          />
          <Button type="button" variant="secondary" disabled={isPending} onClick={close}>
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
