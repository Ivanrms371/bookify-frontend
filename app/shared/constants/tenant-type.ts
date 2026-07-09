import { Scissors, Sparkles, Flower, Crown, Hand, PenTool, HelpCircle, type LucideIcon } from 'lucide-react';

export interface TenantOption {
  value:
    | 'BARBERSHOP'
    | 'HAIRDRESSING_SALON'
    | 'AESTHETIC_CENTER'
    | 'SPA_SALON'
    | 'BEAUTY_SALON'
    | 'NAIL_SALON'
    | 'TATTOO_AND_PIERCING'
    | 'OTHER';
  label: string;
  icon: LucideIcon;
}

export const TENANT_TYPES_OPTIONS: readonly TenantOption[] = [
  { value: 'BARBERSHOP', label: 'Barbería', icon: Scissors },
  { value: 'HAIRDRESSING_SALON', label: 'Peluquería', icon: Scissors },
  { value: 'AESTHETIC_CENTER', label: 'Centro estético', icon: Sparkles },
  { value: 'SPA_SALON', label: 'Spa / Salón', icon: Flower },
  { value: 'BEAUTY_SALON', label: 'Salón de belleza', icon: Crown },
  { value: 'NAIL_SALON', label: 'Salón de uñas', icon: Hand },
  { value: 'TATTOO_AND_PIERCING', label: 'Estudio de tatuajes y perforaciones', icon: PenTool },
  { value: 'OTHER', label: 'Otro', icon: HelpCircle },
] as const;

export const TENANT_TYPE_VALUES = TENANT_TYPES_OPTIONS.map((option) => option.value) as [string, ...string[]];
