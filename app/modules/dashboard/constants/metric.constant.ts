import { CalendarDaysIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export const METRICS = [
    { key: "email" as const, label: "Emails", icon: EnvelopeIcon },
    {
      key: "whatsapp" as const,
      label: "WhatsApp",
      icon: ChatBubbleLeftRightIcon,
    },
    { key: "appointment" as const, label: "Citas", icon: CalendarDaysIcon },
    { key: "professional" as const, label: "Profesionales", icon: UserGroupIcon },
  ];