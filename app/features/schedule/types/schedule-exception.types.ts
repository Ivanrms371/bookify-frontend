// Types aligned with the backend ScheduleExceptionResponse shape

export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface ScheduleExceptionBlock {
  opensAt: string;
  closesAt: string;
}

export interface ScheduleExceptionProfessional {
  professionalId: string;
  displayName: string | null;
}

export interface ScheduleException {
  id: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  reason: string | null;
  blocks: ScheduleExceptionBlock[];
  professionals: ScheduleExceptionProfessional[];
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateScheduleExceptionPayload {
  startDate: string;
  endDate: string;
  isClosed: boolean;
  professionalIds: string[];
  reason?: string;
  intervals?: Array<ScheduleExceptionBlock>;
}
