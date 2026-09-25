import { Heading } from '@/shared/components/typography';

export const Profile = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto mt-6">
      <Heading>Mi Perfil</Heading>
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <p className="text-gray-500">Configuración de tu perfil personal...</p>
      </div>
    </div>
  );
};
