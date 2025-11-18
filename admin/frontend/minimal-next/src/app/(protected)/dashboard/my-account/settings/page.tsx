import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `My Account | Settings - ${CONFIG.appName}` };

export default function Page() {
   return (
      <></>
   );
}
