import { Modal } from "@/shared/components/_ui/Modal";
import { useModalStore } from "@/shared/store/useModalStore";
import { Label } from "@/shared/components/form/Label";
import { Button } from "@/shared/components/form/Button";
import { Input } from "@/shared/components/form/Input";
import { Select } from "@/shared/components/form/Select";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

const ROLES = ["Administrador", "Profesional"];

const inviteSchema = z.object({
  email: z.string().optional(),
  role: z.string().optional(),
  invitations: z
    .array(
      z.object({
        email: z.string().email(),
        role: z.string(),
      }),
    )
    .min(
      1,
      "Debes agregar al menos un miembro antes de enviar las invitaciones",
    ),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export const InviteTeamModal = () => {
  const { closeModal } = useModalStore();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: ROLES[0],
      invitations: [],
    },
  });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInvitation();
    }
  };

  const invitations = watch("invitations");

  const handleAddInvitation = () => {
    const email = getValues("email") || "";
    const role = getValues("role") || "";

    if (!email.trim()) {
      setError("email", { type: "manual", message: "El email es requerido" });
      return;
    }

    const emailValid = z.string().email().safeParse(email);
    if (!emailValid.success) {
      setError("email", {
        type: "manual",
        message: "Formato de email inválido",
      });
      return;
    }

    if (!role.trim()) {
      setError("role", { type: "manual", message: "El rol es requerido" });
      return;
    }

    const currentInvitations = getValues("invitations");
    if (currentInvitations.some((inv) => inv.email === email)) {
      setError("email", {
        type: "manual",
        message: "Este email ya fue agregado",
      });
      return;
    }

    clearErrors(["email", "role"]);
    setValue("invitations", [...currentInvitations, { email, role }], {
      shouldValidate: true,
    });
    setValue("email", "");
    // Mantenemos el último rol seleccionado para conveniencia, o revertimos al default.
    // Lo dejamos como estaba.
  };

  const handleRemoveInvitation = (id: string) => {
    const invitationsUpdated = invitations.filter((inv) => inv.email !== id);
    setValue("invitations", invitationsUpdated, { shouldValidate: true });
  };

  const onSubmit = (data: InviteFormValues) => {
    console.log("Submit invitations:", data.invitations);
    // TODO: Connect with actual API Action
    closeModal();
  };

  return (
    <Modal onClose={closeModal} title="Invita a tu equipo">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email del colaborador"
              {...register("email")}
              onKeyDown={handleKeyDown}
              hasError={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Rol</Label>
            <Select id="role" {...register("role")} onKeyDown={handleKeyDown}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddInvitation}
          className="w-full mt-2 flex items-center gap-2 justify-center border py-2 rounded-xl border-mist-300 dark:border-mist-800 border-dashed text-mist-600 dark:text-mist-200 hover:bg-mist-200 dark:hover:bg-mist-900/50 cursor-pointer"
        >
          <PlusIcon className="size-5" /> <span>Agregar miembro</span>
        </button>

        {invitations.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-2">
            {invitations.map(({ email }) => (
              <li
                key={email}
                className="bg-mist-100 dark:bg-mist-800 text-mist-800 dark:text-mist-200 px-3 py-1 flex items-center gap-2 rounded-xl text-sm font-medium hover:bg-mist-200 dark:hover:bg-mist-700 cursor-pointer transition-colors"
                onClick={() => handleRemoveInvitation(email)}
              >
                {email}
                <XMarkIcon className="size-4" />
              </li>
            ))}
          </ul>
        )}

        {errors.invitations && (
          <p className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
            {errors.invitations.message}
          </p>
        )}

        <div className="pt-4 flex justify-end gap-3">
          <Button
            type="button"
            className="button-tertiary"
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button type="submit" className="button-primary">
            Enviar invitaciones
          </Button>
        </div>
      </form>
    </Modal>
  );
};
