import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

export type IconType = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & { title?: string; titleId?: string } & RefAttributes<SVGSVGElement>
>;
