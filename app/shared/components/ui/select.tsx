import type { ComponentProps, ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { cn } from '@/shared/utils/cn';

type Props = ComponentProps<typeof SelectPrimitive.Root> & {
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
  icon?: ReactNode;
  className?: string;
};

export function Select({ label, options, icon, className, ...props }: Props) {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        aria-label={label}
        className={cn(
          'btn btn-secondary h-10 min-w-0 max-w-full justify-between rounded-xl gap-2 px-3 text-sm font-medium outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        {icon && (
          <span className="shrink-0 text-gray-500" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="truncate">
          <SelectPrimitive.Value placeholder={label} />
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 shrink-0 text-gray-500" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 min-w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
        >
          <SelectPrimitive.ScrollUpButton className="flex justify-center py-1 text-gray-500">
            <ChevronUpIcon className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="max-h-64">
            <SelectPrimitive.Group>
              <SelectPrimitive.Label className="px-3 py-2 text-xs font-semibold text-gray-500">{label}</SelectPrimitive.Label>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="relative flex cursor-pointer items-center rounded-lg py-2 pl-3 pr-9 text-sm font-medium text-gray-700 outline-none data-[highlighted]:bg-gray-100 data-[state=checked]:text-indigo-500 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3">
                    <CheckIcon className="size-4 text-indigo-500" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex justify-center py-1 text-gray-500">
            <ChevronDownIcon className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
