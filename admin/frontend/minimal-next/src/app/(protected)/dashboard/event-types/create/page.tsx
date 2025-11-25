import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import EventTypeCreate from 'src/views/dashboard/event-types/create';


// ----------------------------------------------------------------------

export const metadata = {
  title: `Create Event Type - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <DashboardContent>
      <EventTypeCreate />
    </DashboardContent>
  );
}
