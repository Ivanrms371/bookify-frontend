import { AppointmentList } from './appointment-list';
import { AppointmentTable } from './appointment-table';

export const Appointments = () => {
  return (
    <>
      <div className="hidden md:block">
        <AppointmentTable />
      </div>
      <div className="block md:hidden">
        <AppointmentList />
      </div>
    </>
  );
};
