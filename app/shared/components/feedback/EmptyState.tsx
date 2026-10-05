import { Children, type ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
};

export function EmptyState({ icon, title, description, children }: Props) {
  const actions = Children.toArray(children);
  return (
    <div className="flex w-full flex-col items-center px-6 py-14 text-center sm:py-20">
      <div
        aria-hidden="true"
        className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm ring-8 ring-indigo-100/40 [&>svg]:size-8"
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 sm:text-base">{description}</p>
      {actions.length > 0 && <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  );
}
