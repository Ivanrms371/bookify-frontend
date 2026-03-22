import { useEffect, useRef, useState } from "react";
import { Modal } from "@/shared/components/_ui/Modal";
import { useModalStore } from "@/shared/store/useModalStore";
import { useBusinessStore } from "@/modules/business/store/business.store";
import { useUpdateAssets } from "@/modules/onboarding/hooks/useUpdateAssets";
import { Label } from "@/shared/components/form/Label";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/form/Button";

export const BusinessImagesModal = () => {
  const { closeModal } = useModalStore();
  const currentBusiness = useBusinessStore((state) => state.currentBusiness);
  const { mutate: updateAssets, isPending } = useUpdateAssets(
    currentBusiness?.id,
  );

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setLogoPreview(null);
  }, [logoFile]);

  useEffect(() => {
    if (bannerFile) {
      const url = URL.createObjectURL(bannerFile);
      setBannerPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setBannerPreview(null);
  }, [bannerFile]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!logoFile && !bannerFile) {
      closeModal();
      return;
    }

    updateAssets(
      {
        ...(logoFile && { logo: logoFile }),
        ...(bannerFile && { banner: bannerFile }),
      },
      {
        onSuccess: () => closeModal(),
      },
    );
  };

  return (
    <Modal onClose={closeModal} title="Dale estilo a tu negocio">
      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="logo">
            Logo de tu negocio{" "}
            <span className="text-mist-400 dark:text-mist-500">(opcional)</span>
          </Label>
          <input
            ref={logoInputRef}
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            className="hidden"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          />
          <div className="flex gap-4 items-center">
            <label
              htmlFor="logo"
              className="size-15 border-mist-300 dark:border-mist-800 border rounded-full flex justify-center items-center overflow-hidden cursor-pointer shrink-0"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="size-full object-cover"
                />
              ) : (
                <PhotoIcon className="size-6 text-mist-300 dark:text-mist-600" />
              )}
            </label>
            <Button
              type="button"
              className="button-secondary"
              size="sm"
              onClick={() => logoInputRef.current?.click()}
            >
              {logoFile ? "Cambiar logo" : "Subir logo"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="banner">
            Imagen de portada{" "}
            <span className="text-mist-400 dark:text-mist-500">(opcional)</span>
          </Label>
          <input
            ref={bannerInputRef}
            type="file"
            id="banner"
            name="banner"
            accept="image/*"
            className="hidden"
            onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
          />
          <label
            htmlFor="banner"
            className="h-24 border dark:border-mist-800 border-mist-300 border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer overflow-hidden"
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center">
                <PhotoIcon className="size-8 text-mist-400 dark:text-mist-500" />
                <div className="text-mist-400 text-sm font-medium">
                  <span className="text-mist-600 dark:text-mist-200">
                    Subir imagen
                  </span>{" "}
                  o arrastrar y soltar
                </div>
              </div>
            )}
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button
            type="button"
            className="button-tertiary"
            onClick={closeModal}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="button-primary"
            isLoading={isPending}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};
