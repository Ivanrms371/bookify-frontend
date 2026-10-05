import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import { CheckIcon, ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { Button } from './button';
import { Select } from './select';
import styles from './responsive-filters.module.css';

type Props = {
  children: ReactNode;
  action: ReactNode;
  active?: boolean;
};

export function ResponsiveFilters({ children, action, active = false }: Props) {
  const [open, setOpen] = useState(false);
  const desktop = useMediaQuery('(min-width: 768px)');
  const groupId = useId();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      const fields = Children.toArray(children).filter(
        (child): child is ReactElement<ComponentProps<typeof Select>> =>
          isValidElement<ComponentProps<typeof Select>>(child) && child.type === Select,
      );
      if (nextOpen) {
        setDraft(Object.fromEntries(fields.map((field) => [field.props.label, field.props.value ?? ''])));
      } else {
        for (const field of fields) {
          const value = draft[field.props.label];
          if (
            !field.props.disabled &&
            value !== undefined &&
            value !== field.props.value &&
            field.props.options.some((option) => option.value === value && !option.disabled)
          ) {
            field.props.onValueChange?.(value);
          }
        }
      }
      setOpen(nextOpen);
    },
    [children, draft],
  );

  useEffect(() => {
    if (desktop && open) onOpenChange(false);
  }, [desktop, open, onOpenChange]);

  return (
    <div className="flex w-full items-center gap-2 md:ml-auto md:w-auto md:flex-wrap">
      <div className="hidden md:contents">{children}</div>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
          <Button type="button" variant="secondary" className="h-11 shrink-0 px-3 md:hidden">
            <FunnelIcon className="size-4" />
            Filtros
            {active && <span className="size-2 rounded-full bg-indigo-500" aria-label="Filtros activos" />}
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm duration-300 ease-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out motion-reduce:animate-none" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[75dvh] flex-col rounded-t-3xl border border-gray-200 bg-white shadow-2xl outline-none duration-300 ease-out data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom motion-reduce:animate-none">
            <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-gray-200" />
            <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-4 pt-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900">Filtros</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-gray-500">Elegí las opciones. Se aplican al cerrar.</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <Button type="button" variant="ghost" size="icon-md" aria-label="Cerrar filtros">
                  <XMarkIcon className="size-5" />
                </Button>
              </Dialog.Close>
            </div>
            <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pb-5">
              <Accordion.Root type="single" collapsible className="space-y-3">
                {Children.map(children, (child) => {
                  if (!isValidElement<ComponentProps<typeof Select>>(child) || child.type !== Select) return child;
                  const { label, options, disabled, icon } = child.props;
                  const value = draft[label] ?? child.props.value;
                  const selected = options.find((option) => option.value === value);
                  return (
                    <Accordion.Item value={label} disabled={disabled} className="overflow-hidden rounded-2xl border border-gray-200">
                      <Accordion.Header>
                        <Accordion.Trigger className="group flex w-full items-center gap-3 px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 disabled:opacity-50">
                          {icon && (
                            <span
                              aria-hidden="true"
                              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"
                            >
                              {icon}
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-gray-900">{label}</span>
                            <span className="mt-0.5 block text-sm text-gray-500">{selected?.label}</span>
                          </span>
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="size-5 shrink-0 text-gray-400 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                          />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className={`${styles.accordionContent} overflow-hidden`}>
                        <fieldset disabled={disabled} className="space-y-1 border-t border-gray-100 p-2">
                          <legend className="sr-only">{label}</legend>
                          {options.map((option) => (
                            <label
                              key={option.value}
                              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 ${value === option.value ? 'bg-indigo-50 font-medium text-indigo-600' : 'text-gray-700 hover:bg-gray-50'} ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                              <input
                                type="radio"
                                name={`${groupId}-${label}`}
                                value={option.value}
                                checked={value === option.value}
                                disabled={option.disabled}
                                onChange={() => setDraft((current) => ({ ...current, [label]: option.value }))}
                                className="sr-only"
                              />
                              <span className="flex-1">{option.label}</span>
                              <span aria-hidden="true" className="size-5 shrink-0">
                                {value === option.value && <CheckIcon className="size-5" />}
                              </span>
                            </label>
                          ))}
                        </fieldset>
                      </Accordion.Content>
                    </Accordion.Item>
                  );
                })}
              </Accordion.Root>
            </div>
            <div className="shrink-0 border-t border-gray-100 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Dialog.Close asChild>
                <Button type="button" variant="primary" fullWidth>
                  Listo
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {action && (
        <div className="min-w-0 flex-1 [&>button]:h-11 [&>button]:w-full [&>button]:whitespace-normal [&>button]:px-3 md:flex-none md:[&>button]:h-10 md:[&>button]:w-auto md:[&>button]:whitespace-nowrap md:[&>button]:px-4">
          {action}
        </div>
      )}
    </div>
  );
}
