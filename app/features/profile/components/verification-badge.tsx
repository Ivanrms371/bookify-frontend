import { Badge } from '@/shared/components/ui/badge';

export const VerificationBadge = ({ verifiedAt }: { verifiedAt: string | null | undefined }) => {
  return verifiedAt ? <Badge variant="green">Verificado</Badge> : <Badge variant="yellow">Sin verificar</Badge>;
};
