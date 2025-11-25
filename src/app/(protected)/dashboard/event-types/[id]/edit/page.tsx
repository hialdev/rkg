import { paths } from 'src/routes/al/paths';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import EventTypeEdit from 'src/views/dashboard/event-types/edit';


// ----------------------------------------------------------------------

export const metadata = {
  title: `Edit Event Type - ${CONFIG.appName}`,
};

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <DashboardContent>
      <EventTypeEdit id={id} />
    </DashboardContent>
  );
}
