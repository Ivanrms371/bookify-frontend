import { Heading, Text } from '@/shared/components/typography';
import { Logo } from '@/shared/components/ui/logo';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <>
      <Logo className="mx-auto mb-4 size-24" />
      <Heading className="text-center text-4xl">{title}</Heading>

      {subtitle && <Text className="text-center">{subtitle}</Text>}
    </>
  );
};
