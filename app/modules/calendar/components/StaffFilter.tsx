import { useAuth } from "@/modules/auth/hooks/useAuth"
import { type StaffMember } from "@/modules/staff/api/staff.api"
import { COLORS } from "@/shared/constants/colors"
import { useDarkModeStore } from "@/shared/store/useDarkModeStore"
import { getColor } from "@/shared/utils/colors"

interface Props {
  staffList: StaffMember[]
  selectedStaff: string | null
  setSelectedStaff: (staffId: string | null) => void
}

export const StaffFilter = ({
  staffList,
  selectedStaff,
  setSelectedStaff,
}: Props) => {
  const { session } = useAuth()
  const { isDark } = useDarkModeStore()

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {staffList.length > 1 && (
          <button
            onClick={() => setSelectedStaff(null)}
            className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all cursor-pointer ${
              selectedStaff === null
                ? "bg-mist-900 text-white dark:bg-mist-100 dark:text-mist-900"
                : "bg-white text-mist-600 hover:bg-mist-200 dark:bg-mist-900/80 dark:text-mist-400 dark:hover:bg-mist-800"
            }`}
          >
            Todos
          </button>
        )}
        {staffList.map((s) => (
          <button
            key={s.id}
            onClick={() =>
              setSelectedStaff(selectedStaff === s.id ? null : s.id)
            }
            className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              selectedStaff === s.id
                ? "bg-mist-900 text-white dark:bg-mist-100 dark:text-mist-900"
                : "bg-white text-mist-600 hover:bg-mist-200 dark:bg-mist-900/80 dark:text-mist-400 dark:hover:bg-mist-800"
            }`}
          >
            <span
              className="size-2.5 rounded-full"
              style={{
                backgroundColor: getColor(s.colorTheme ?? "BLUE", isDark),
              }}
            />
            {s.userId === session?.id ? "Tú" : s.displayName}
          </button>
        ))}
      </div>
    </>
  )
}
