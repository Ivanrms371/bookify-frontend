import { cn } from '@/shared/utils/cn';
import React from 'react';

interface Props {
  className?: string;
}

export const Logo = ({ className }: Props) => {
  return <img src="/turnify/bookify.png" alt="" className={cn('size-16 rounded-full object-cover', className)} />;
};
