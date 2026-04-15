import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { Avatar } from "@/shared/components/_ui/Avatar"
import type { Staff } from "@/modules/staff/types/staff.type"

interface ProfessionalListProps {
  staffs: Staff[]
  onSelect: (staff: Staff) => void
}

export const ProfessionalList = ({ staffs, onSelect }: ProfessionalListProps) => (
  <ul className="grid divide-y divide-mist-200 dark:divide-mist-900/70">
    {staffs.map((staff) => (
      <li
        key={staff.id}
        onClick={() => onSelect(staff)}
        className="group flex flex-col items-start gap-4 py-3 px-4 transition-all duration-300 text-left relative overflow-hidden cursor-pointer hover:bg-mist-100 dark:hover:bg-mist-900/50 rounded-xl"
      >
        <div className="flex items-center w-full justify-between z-10">
          <div className="flex items-center gap-4">
            <Avatar name={staff.displayName} size="md" src={staff.avatarUrl} />
            <div>
              <div className="font-semibold text-mist-900 dark:text-white transition-colors">
                {staff.displayName}
              </div>
              <span className="text-sm font-medium text-mist-500 dark:text-mist-400 mt-0.5 block">
                {staff.title || "Especialista"}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-mist-200 dark:bg-mist-900 dark:group-hover:bg-mist-800 flex items-center justify-center text-mist-700 dark:text-mist-400 transition-all duration-300 group-hover:translate-x-1">
            <ArrowRightIcon className="size-5" />
          </div>
        </div>
      </li>
    ))}
  </ul>
)
