import { useRef, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { ImageInput } from '@/shared/components/form/image-input';
import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { useMediaUpload } from '@/shared/media';
import type { UploadResult } from '@/shared/media/types';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveCustomize } from '../hooks/use-save-customize';
import type { CustomizeStepPayload } from '../schemas/customize-step.schema';

export const CustomizeStep = () => {
  const { back, next, savedData } = useOnboarding();
  const { mutateAsync: save } = useSaveCustomize();
  const { mutateAsync: upload } = useMediaUpload();
  const [logo, setLogo] = useState<File | null | undefined>();
  const [cover, setCover] = useState<File | null | undefined>();
  const [busy, setBusy] = useState(false);
  const uploaded = useRef(new Map<File, UploadResult>());
  const uploadOnce = async (file: File, type: 'logo' | 'cover') => {
    const previous = uploaded.current.get(file);
    if (previous) return previous;
    const result = await upload({ file, type });
    uploaded.current.set(file, result);
    return result;
  };
  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const payload: CustomizeStepPayload = {};
      if (logo === null) {
        payload.logoUrl = null;
        payload.logoPublicId = null;
      } else if (logo) {
        const result = await uploadOnce(logo, 'logo');
        payload.logoUrl = result.url;
        payload.logoPublicId = result.publicId;
      }
      if (cover === null) {
        payload.coverUrl = null;
        payload.coverPublicId = null;
      } else if (cover) {
        const result = await uploadOnce(cover, 'cover');
        payload.coverUrl = result.url;
        payload.coverPublicId = result.publicId;
      }
      await next(() => save(payload));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar la personalización');
    } finally {
      setBusy(false);
    }
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
          Personaliza tu página
        </Heading>
        <Text className="text-base">Subí tu logo, una imagen de portada y elegí un color. También podés hacerlo después.</Text>
      </div>
      <fieldset disabled={busy} className="space-y-6">
        <div className="space-y-2">
          <Heading as="h3" className="text-lg md:text-xl font-medium">
            Tu logo
          </Heading>
          {logo === undefined && savedData?.logoUrl && (
            <div className="flex gap-3 items-center">
              <img src={savedData.logoUrl} alt="Logo guardado" className="size-20 rounded-lg object-cover" />
              <Button type="button" variant="ghost" onClick={() => setLogo(null)}>
                Quitar logo
              </Button>
            </div>
          )}
          <ImageInput id="logo" variant="avatar" value={logo ?? null} onChange={setLogo} />
        </div>
        <div className="space-y-2">
          <Heading as="h3" className="text-lg md:text-xl font-medium">
            Tu portada
          </Heading>
          {cover === undefined && savedData?.coverUrl && (
            <div className="space-y-2">
              <img src={savedData.coverUrl} alt="Portada guardada" className="max-h-48 w-full rounded-lg object-cover" />
              <Button type="button" variant="ghost" onClick={() => setCover(null)}>
                Quitar portada
              </Button>
            </div>
          )}
          <ImageInput id="cover" variant="banner" value={cover ?? null} onChange={setCover} />
        </div>
      </fieldset>
      <StepNavigation>
        <BackButton onBack={back} disabled={busy} />
        <NextButton isNextDisabled={busy} />
      </StepNavigation>
    </form>
  );
};
