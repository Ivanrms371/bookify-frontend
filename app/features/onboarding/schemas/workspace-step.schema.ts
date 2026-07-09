import z from 'zod';
import { WORKSPACE_TYPE_VALUES } from '@/shared/constants/workspace-type';

export const workspaceStepSchema = z.object({
  workspaceType: z.enum(WORKSPACE_TYPE_VALUES, {
    message: 'Selecciona un tipo de espacio valido',
  }),
});

export type WorkspaceStepPayload = z.infer<typeof workspaceStepSchema>;
