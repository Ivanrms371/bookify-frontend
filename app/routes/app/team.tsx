import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Professionals } from '@/features/professionals';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { Invitations } from '@/features/invitations';

const TeamPage = () => {
  const { open: openInviteProfessional } = useOverlay('create-invitation-drawer');
  return (
    <div className="flex h-full pb-2.5 flex-col gap-8">
      <div className="flex flex-col gap-2 md:flex-row justify-between md:items-center pb-4 border-b border-gray-200">
        <div>
          <Heading as="h1" className="text-3xl font-semibold">
            Equipo
          </Heading>
          <Text className="text-gray-600">Gestiona tu equipo de profesionales</Text>
        </div>
        <div>
          <Button
            variant="primary"
            className="min-w-40"
            icon={<PlusIcon className="size-5" />}
            iconPosition="left"
            onClick={() => openInviteProfessional({})}
          >
            Invitar Profesional
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <div className="grid gap-2 sm:gap-4 min-[340px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          <Professionals />
          <Invitations />
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
