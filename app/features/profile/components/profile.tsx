import { GeneralProfile } from './general-profile';
import { ProfessionalProfile } from './professional-profile';
import { SecurityProfile } from './security-profile';

export const Profile = () => {
  return (
    <div className="max-w-5xl w-full mx-auto mt-6 flex flex-col gap-12">
      <GeneralProfile />
      <ProfessionalProfile />
      <SecurityProfile />
    </div>
  );
};
