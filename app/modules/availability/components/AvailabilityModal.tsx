import { twMerge } from "tailwind-merge";
import { useModalStore } from "@/shared/store/useModalStore";
import { Modal } from "@/shared/components/_ui/Modal";
import { Label } from "@/shared/components/form/Label";
import { Input } from "@/shared/components/form/Input";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/form/Button";

const daysOfWeek = [
  { value: "monday", label: "Lunes", day: 0 },
  { value: "tuesday", label: "Martes", day: 1 },
  { value: "wednesday", label: "Miércoles", day: 2 },
  { value: "thursday", label: "Jueves", day: 3 },
  { value: "friday", label: "Viernes", day: 4 },
  { value: "saturday", label: "Sábado", day: 5 },
  { value: "sunday", label: "Domingo", day: 6 },
];

const blocks = [
  {
    id: 1,
    startSchedule: "08:00",
    endSchedule: "12:00",
    name: "Mañana",
  },
];

export const AvailabilityModal = () => {
  const { closeModal } = useModalStore();

  const onSubmit = () => {};
  return (
    <Modal
      onClose={closeModal}
      title="Horarios de atención"
      description="Define tu disponibilidad durante la semana"
    >
      <div className="flex justify-center gap-2 mt-6">
        <div className="flex flex-col flex-1 gap-1.5">
          <Label htmlFor="startSchedule">Horario de inicio</Label>
          <Input value={"08:00"} />
        </div>
        <div className="flex flex-col flex-1 gap-1.5">
          <Label htmlFor="endSchedule">Horario de finalización</Label>
          <Input value={"12:00"} />
        </div>
        <div className="flex flex-col flex-1 gap-1.5">
          <Label htmlFor="name">Nombre del horario</Label>
          <Input />
        </div>
      </div>

      <button
        type="button"
        className="w-full mt-2 flex items-center gap-2 justify-center border py-2 rounded-xl border-gray-300 dark:border-gray-800 border-dashed text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-900/50 cursor-pointer"
      >
        <PlusIcon className="size-5" /> <span>Agregar nuevo bloque</span>
      </button>

      <div className="mt-6">
        <div className="text-xl font-mono mb-4">Días asignados</div>

        <ul className="flex flex-col gap-1.5">
          {daysOfWeek.map((day) => (
            <li
              key={day.value}
              className="py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-xl flex items-center"
            >
              <span className="flex-shring-0 w-24 text-sm text-gray-600 dark:text-gray-200 font-medium">
                {day.label}
              </span>

              <div className="flex-1 flex gap-2">
                {blocks.map((block) => {
                  const selected =
                    day.day === 0 ||
                    day.day === 1 ||
                    day.day === 2 ||
                    day.day === 3 ||
                    day.day === 4;

                  return (
                    <div
                      key={block.id}
                      className={twMerge(
                        "py-1 px-2 border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-200 text-sm rounded-full dark:hover:border-gray-700 transition-colors cursor-pointer font-medium",
                        selected &&
                          "border-0 bg-gray-900 text-gray-100 dark:bg-gray-50 dark:text-gray-800",
                      )}
                    >
                      {block.name}
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={closeModal} className="button-tertiary">
          Cancelar
        </Button>
        <Button className="button-primary" onClick={onSubmit}>
          Guardar horarios
        </Button>
      </div>
    </Modal>
  );
};
