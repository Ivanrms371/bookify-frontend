import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import type { ComponentPropsWithoutRef } from 'react';

interface StepNavigationProps {
  children: React.ReactNode;
}

export const StepNavigation = ({ children }: StepNavigationProps) => {
  return (
    <>
      <div className={cn('gap-4 fixed bg-gray-50 w-full bottom-0 left-0 right-0 z-40')}>
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between px-6 py-4">{children}</div>
      </div>
    </>
  );
};

type NextButtonProps = ComponentPropsWithoutRef<'button'> & {
  isNextDisabled: boolean;
  nextLabel?: string;
  onClick?: () => void;
};

export const NextButton = ({ isNextDisabled, nextLabel = 'Siguiente', className, type = 'submit', onClick, ...props }: NextButtonProps) => {
  return (
    <Button
      size="md"
      type={type}
      onClick={onClick}
      disabled={isNextDisabled}
      icon={<ChevronRightIcon className="size-5 group-hover:-translate-x-0.5 transition-all duration-200" />}
      variant="primary"
      iconPosition="right"
      {...props}
    >
      {nextLabel}
    </Button>
  );
};

type BackButtonProps = ComponentPropsWithoutRef<'button'> & {
  onBack: () => void;
  backLabel?: string;
};

export const BackButton = ({ onBack, backLabel = 'Volver atrás', className, ...props }: BackButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="md"
      type="button"
      onClick={onBack}
      icon={<ChevronLeftIcon className="size-5 group-hover:-translate-x-0.5 transition-all duration-200" />}
      iconPosition="left"
      {...props}
    >
      {backLabel}
    </Button>
  );
};
