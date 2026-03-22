import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useModalStore } from "@/shared/store/useModalStore";
import { Modal } from "@/shared/components/_ui/Modal";
import { Label } from "@/shared/components/form/Label";
import { Input } from "@/shared/components/form/Input";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/shared/components/form/Button";
import { useBusinessStore } from "@/modules/business/store/business.store";
import { useCreateWorkingHours } from "@/modules/availability/hooks/useCreateWorkingHours";

const daysOfWeek = [
  { value: "monday", label: "Lunes", day: 0 },
  { value: "tuesday", label: "Martes", day: 1 },
  { value: "wednesday", label: "Miércoles", day: 2 },
  { value: "thursday", label: "Jueves", day: 3 },
  { value: "friday", label: "Viernes", day: 4 },
  { value: "saturday", label: "Sábado", day: 5 },
  { value: "sunday", label: "Domingo", day: 6 },
];

type TimeBlock = {
  id: string;
  startSchedule: string;
  endSchedule: string;
  name: string;
};

export const AvailabilityModal = () => {
  const { closeModal } = useModalStore();
  const currentBusiness = useBusinessStore((state) => state.currentBusiness);
  const { mutate: createHours, isPending } = useCreateWorkingHours(
    currentBusiness?.id,
  );

  const [blocks, setBlocks] = useState<TimeBlock[]>([
    { id: crypto.randomUUID(), startSchedule: "", endSchedule: "", name: "" },
  ]);

  const [assignments, setAssignments] = useState<Record<number, string[]>>({});

  const isBlockValid = (block: TimeBlock) => {
    return block.startSchedule && block.endSchedule && block.name.trim() !== "";
  };

  const handleAddBlock = () => {
    if (!blocks.every(isBlockValid)) return;
    setBlocks([
      ...blocks,
      { id: crypto.randomUUID(), startSchedule: "", endSchedule: "", name: "" },
    ]);
  };

  const handleUpdateBlock = (
    id: string,
    field: keyof TimeBlock,
    value: string,
  ) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    setAssignments((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((dayKey) => {
        const d = Number(dayKey);
        next[d] = next[d].filter((blockId) => blockId !== id);
      });
      return next;
    });
  };

  const handleToggleDayBlock = (dayIndex: number, blockId: string) => {
    setAssignments((prev) => {
      const currentAssigned = prev[dayIndex] || [];
      const nextAssigned = currentAssigned.includes(blockId)
        ? currentAssigned.filter((id) => id !== blockId)
        : [...currentAssigned, blockId];
      return { ...prev, [dayIndex]: nextAssigned };
    });
  };

  const onSubmit = () => {
    if (!blocks.every(isBlockValid)) return;

    const payload = [];
    for (const [dayStr, blockIds] of Object.entries(assignments)) {
      const dayOfWeek = Number(dayStr);
      for (const blockId of blockIds) {
        const block = blocks.find((b) => b.id === blockId);
        if (block) {
          payload.push({
            dayOfWeek,
            startTime: block.startSchedule,
            endTime: block.endSchedule,
            name: block.name,
          });
        }
      }
    }

    if (payload.length === 0) return;

    createHours(
      { workingHours: payload },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  return (
    <Modal
      onClose={closeModal}
      title="Horarios de atención"
      description="Define tu disponibilidad durante la semana"
    >
      <div className="space-y-4 mt-6">
        {blocks.map((block) => (
          <div key={block.id} className="flex gap-2 items-end relative">
            <div className="flex flex-col flex-1 gap-1.5">
              <Label htmlFor={`start-${block.id}`}>Horario de inicio</Label>
              <Input
                id={`start-${block.id}`}
                type="time"
                value={block.startSchedule}
                onChange={(e) =>
                  handleUpdateBlock(block.id, "startSchedule", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col flex-1 gap-1.5">
              <Label htmlFor={`end-${block.id}`}>Horario de finalización</Label>
              <Input
                id={`end-${block.id}`}
                type="time"
                value={block.endSchedule}
                onChange={(e) =>
                  handleUpdateBlock(block.id, "endSchedule", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col flex-1 gap-1.5 relative">
              <Label htmlFor={`name-${block.id}`}>Nombre del horario</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`name-${block.id}`}
                  placeholder="Ej: Mañana"
                  value={block.name}
                  onChange={(e) =>
                    handleUpdateBlock(block.id, "name", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBlock(block.id)}
                  className=" text-red-600 cursor-pointer hover:bg-mist-100 dark:hover:bg-transparent dark:hover:text-red-700 rounded-full flex justify-center items-center size-10 transition-colors"
                >
                  <TrashIcon className="size-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddBlock}
        disabled={!blocks.every(isBlockValid)}
        className="w-full mt-4 flex items-center gap-2 justify-center border py-2 rounded-xl border-mist-300 dark:border-mist-800 border-dashed text-mist-600 dark:text-mist-200 hover:bg-mist-200 dark:hover:bg-mist-900/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon className="size-5" /> <span>Agregar nuevo bloque</span>
      </button>

      <div className="mt-6">
        <div className="text-sm text-mist-500 dark:text-mist-400 font-mono mb-4">
          Días asignados
        </div>

        <ul className="flex flex-col gap-1.5">
          {daysOfWeek.map((day) => (
            <li
              key={day.value}
              className="py-2 px-4 hover:bg-mist-50 dark:hover:bg-mist-900 rounded-xl flex items-center"
            >
              <span className="shrink-0 w-24 text-sm text-mist-600 dark:text-mist-200 font-medium">
                {day.label}
              </span>

              <div className="flex-1 flex gap-2 flex-wrap">
                {blocks.map((block) => {
                  if (!isBlockValid(block)) return null;

                  const isAssigned = (assignments[day.day] || []).includes(
                    block.id,
                  );

                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => handleToggleDayBlock(day.day, block.id)}
                      className={twMerge(
                        "py-1 px-3 border border-mist-300 dark:border-mist-800 text-mist-600 dark:text-mist-200 text-xs rounded-full dark:hover:border-mist-700 transition-colors cursor-pointer font-medium select-none",
                        isAssigned &&
                          "border-transparent bg-mist-900 text-mist-100 dark:bg-mist-50 dark:text-mist-800",
                      )}
                    >
                      {block.name}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          onClick={closeModal}
          className="button-tertiary"
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          className="button-primary"
          onClick={onSubmit}
          isLoading={isPending}
          disabled={
            !blocks.every(isBlockValid) ||
            Object.values(assignments).every((arr) => arr.length === 0)
          }
        >
          Guardar horarios
        </Button>
      </div>
    </Modal>
  );
};
