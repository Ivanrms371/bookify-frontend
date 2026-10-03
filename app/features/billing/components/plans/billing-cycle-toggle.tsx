import { cn } from '@/shared/utils';

export function BillingCycleToggle({
  isAnnual,
  onChange,
  disabled = false,
}: {
  isAnnual: boolean;
  disabled?: boolean;
  onChange: (annual: boolean) => void;
}) {
  return (
    <div aria-label="Ciclo de facturación" className="mx-auto mb-8 flex w-72 gap-1 rounded-full border border-gray-200 bg-white p-1">
      {[
        { label: 'Mensual', annual: false },
        { label: 'Anual', annual: true },
      ].map(({ label, annual }) => (
        <button
          key={label}
          type="button"
          disabled={disabled}
          aria-pressed={isAnnual === annual}
          onClick={() => onChange(annual)}
          className={cn(
            'flex-1 cursor-pointer rounded-full py-2 text-sm font-medium text-gray-600',
            isAnnual === annual && 'bg-gray-100 text-gray-900',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
