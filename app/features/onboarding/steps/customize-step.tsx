import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { ImageInput } from '@/shared/components/form/image-input';
import { LogoInput } from '@/shared/components/form/LogoInput';
import { ThemeCard } from '@/shared/components/theme/ThemeCard';
import { Heading, Text } from '@/shared/components/typography';
import { DEFAULT_THEME_ID, THEMES } from '@/shared/constants';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveCustomize } from '../hooks/use-save-customize';

export const CustomizeStep = () => {
  const { back, next } = useOnboarding();
  const { mutateAsync: saveCustomize, isPending } = useSaveCustomize();

  const [avatarValue, setAvatarValue] = useState<File | null>(null);
  const [bannerValue, setBannerValue] = useState<File | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await next(() => saveCustomize({}));
    } catch (error) {
      toast.error('Error al continuar', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return (
    <>
      <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
        Demosle personalidad a tu negocio
      </Heading>
      <Text className="max-w-xl mb-4">Subí tu logo, una imagen de portada y elegí el color con el que verán tu página de reservas.</Text>

      <form onSubmit={onSubmit}>
        <div className="space-y-6">
          <div className="space-y-2">
            <Heading as="h2" className="text-lg md:text-xl mb-1 font-semibold">
              Subí tu logo
            </Heading>

            <ImageInput id="logo" variant="avatar" value={avatarValue} onChange={setAvatarValue} />
          </div>

          <div className="space-y-2">
            <Heading as="h2" className="text-lg md:text-xl mb-1 font-semibold">
              Subí una imagen de portada
            </Heading>

            <ImageInput id="banner" variant="banner" value={bannerValue} onChange={setBannerValue} />
          </div>
        </div>

        <StepNavigation>
          <BackButton onBack={back} />
          <NextButton isNextDisabled={isPending} type="submit" />
        </StepNavigation>
      </form>
    </>
  );
};
