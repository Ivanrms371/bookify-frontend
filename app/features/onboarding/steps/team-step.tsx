import { toast } from 'sonner';
import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveTeam } from '../hooks/use-save-team';

const INVITE_LINK = 'bookify.com/join/019e4d73-e50a-7ea1-b059-bbd7ebd7eed3';

export const TeamStep = () => {
  const { back, next } = useOnboarding();
  const { mutateAsync: saveTeam, isPending } = useSaveTeam();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await next(() => saveTeam({ invitations: [] }));
    } catch (error) {
      toast.error('Error al continuar con el equipo', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return (
    <>
      <Text className="mb-1.5  text-xl font-semibold text-gray-800 md:text-2xl">Invitá a tu equipo</Text>
      <Text className="mb-4 max-w-xl text-sm font-medium text-gray-500">
        Copiá este enlace y mandalo a tus colaboradores para que puedan crear su cuenta.
      </Text>

      <form onSubmit={onSubmit}>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            readOnly
            value={INVITE_LINK}
            className="flex-1 rounded-xl border bg-white border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none"
          />
          <Button variant="primary" type="button" onClick={() => navigator.clipboard.writeText(INVITE_LINK)} className="button-secondary">
            <ClipboardDocumentIcon className="size-4" />
            Copiar link
          </Button>
        </div>

        <Text className="mb-6 max-w-xl text-sm font-medium text-gray-500">
          El enlace es válido por 24 horas, podrás generar uno nuevo en cualquier momento en el panel de control.
        </Text>

        <StepNavigation>
          <BackButton onBack={back} />
          <NextButton isNextDisabled={isPending} type="submit" />
        </StepNavigation>
      </form>
    </>
  );
};
