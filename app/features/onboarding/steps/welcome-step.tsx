import { useEffect, useState } from 'react';
import { Heading, Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { WORKSPACE_TYPE_OPTIONS, type WorkspaceType } from '@/shared/constants/workspace-type';
import { Alert } from '@/shared/components/feedback/Alert';
import { getApiError } from '@/shared/utils/getApiError';
import { NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSelectWorkspace } from '../hooks/use-select-workspace';

export const WelcomeStep = () => {
  const { next, savedData } = useOnboarding();
  const { mutateAsync: selectWorkspace, isPending, isError, error } = useSelectWorkspace();

  const [selectedWorkspaceType, setSelectedWorkspaceType] = useState<WorkspaceType | null>(null);

  useEffect(() => {
    setSelectedWorkspaceType(savedData?.workspaceType ?? null);
  }, [savedData?.workspaceType]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWorkspaceType) return;

    next(() => selectWorkspace({ workspaceType: selectedWorkspaceType }));
  };

  const handleChangeWorkspaceType = (workspaceType: WorkspaceType) => {
    setSelectedWorkspaceType(workspaceType);

    next(() => selectWorkspace({ workspaceType }));
  };

  return (
    <>
      <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
        Bienvenido Iván! 👋, ¿Cómo usarás Bookify?
      </Heading>
      <Text className="max-w-xl mb-4">
        Dinos si trabajarás de forma independiente o si el espacio contará con múltiples profesionales, ya sean tus empleados, socios o
        colaboradores.
      </Text>

      {isError && error && <Alert message={getApiError(error)} variant="error" className="mb-4" />}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          {WORKSPACE_TYPE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedWorkspaceType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={isPending}
                aria-pressed={isSelected}
                className={cn(
                  'relative flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-4 text-left shadow-sm transition-colors duration-300',
                  isSelected ? 'border-indigo-500 hover:bg-white' : 'border-gray-200 hover:bg-gray-100',
                  isPending && 'pointer-events-none opacity-60',
                )}
                onClick={() => handleChangeWorkspaceType(option.value)}
              >
                <Icon className={cn('size-6 text-gray-500', isSelected && 'text-indigo-500')} />
                <Heading className="text-xl font-medium" as="h3">
                  {option.label}
                </Heading>
                <Text className="text-sm text-gray-500">{option.description}</Text>
              </button>
            );
          })}
        </div>

        <StepNavigation>
          <div />
          <NextButton isNextDisabled={!selectedWorkspaceType || isPending} type="submit" />
        </StepNavigation>
      </form>
    </>
  );
};
