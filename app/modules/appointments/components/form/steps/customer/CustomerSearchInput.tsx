import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Input } from "@/shared/components/form/Input"

interface CustomerSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export const CustomerSearchInput = ({
  value,
  onChange,
}: CustomerSearchInputProps) => (
  <div className="flex items-center gap-2 mb-8 shrink-0">
    <MagnifyingGlassIcon className="h-6 w-6 text-mist-400 group-focus-within:text-indigo-500 transition-colors" />

    <Input
      type="text"
      placeholder="Buscar por nombre, email o teléfono..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  </div>
)
