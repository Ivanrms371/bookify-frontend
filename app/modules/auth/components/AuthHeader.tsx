import { TurnifyLogo } from "@/shared/components/_ui/TurnifyLogo";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <>
      <TurnifyLogo className="mb-4 mx-auto size-20" />
      <h1 className="text-4xl font-semibold text-mist-900 dark:text-mist-100 text-center mb-4">
        {title}
      </h1>

      {subtitle && <p className="text-mist-500 text-center">{subtitle}</p>}
    </>
  );
};
