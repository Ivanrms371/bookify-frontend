import type { WorkspaceType } from '@/shared/constants/workspace-type';

export type BusinessStepPayload = {
  name: string;
  type: string;
};

export type WorkspaceStepPayload = {
  workspaceType: WorkspaceType;
};
