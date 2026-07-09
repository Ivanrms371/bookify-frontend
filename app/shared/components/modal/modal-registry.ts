import type { ComponentType } from 'react';

export type ModalComponentProps = {
  onClose: () => void;
};

export type ModalRegistry = Record<string, ComponentType<ModalComponentProps & Record<string, unknown>>>;

export const modalRegistry: ModalRegistry = {};
