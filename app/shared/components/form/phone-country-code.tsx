import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { COUNTRIES } from '@/shared/constants';

interface PhoneCountryCodeProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PhoneCountryCode = ({ value, onChange, disabled }: PhoneCountryCodeProps) => {
  const selectedCountry = COUNTRIES.find((c) => c.dialCode === value) || COUNTRIES[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex shrink-0 items-center gap-2 h-10 w-28 bg-white rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-800 outline-none transition hover:bg-gray-50 focus:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-500 disabled:hover:bg-gray-100"
        >
          <img src={selectedCountry.flagUrl} alt={selectedCountry.name} className="w-4 h-auto rounded-xs shadow-sm object-cover" />
          <span>+{selectedCountry.dialCode}</span>
          <ChevronDownIcon className="size-4 text-gray-500" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          className="z-50 min-w-48 max-h-[300px] overflow-y-auto rounded-lg border border-gray-100 bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          {COUNTRIES.map((c) => (
            <DropdownMenu.Item
              key={c.code}
              onClick={() => onChange(c.dialCode)}
              className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-2 py-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
            >
              <img src={c.flagUrl} alt={c.name} className="w-4 h-auto rounded-xs shadow-sm object-cover" />
              <span className="text-gray-800">{c.name}</span>
              <span className="text-gray-800 ml-auto">+{c.dialCode}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
