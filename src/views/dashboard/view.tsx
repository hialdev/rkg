'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { paths } from 'src/routes/al/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

// Import stores for each model
import useTripStore from 'src/stores/trip';
import useDestinationStore from 'src/stores/destination';
import useEventStore from 'src/stores/event';
import useEventTypeStore from 'src/stores/event-type';
import useEventPlanStore from 'src/stores/event-plan';
import useTeamStore from 'src/stores/team';
import useClientStore from 'src/stores/client';
import { useTestimonialStore } from 'src/stores/testimonial';
import useFaqStore from 'src/stores/faq';
import useUserStore from 'src/stores/user';
import useSettingStore from 'src/stores/setting';

// ----------------------------------------------------------------------

type WidgetItem = {
   title: string;
   path: string;
   icon: string;
   count: number;
   color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

// ----------------------------------------------------------------------

export function DashboardView() {
   const [loading, setLoading] = useState(true);
   const [widgets, setWidgets] = useState<WidgetItem[]>([]);

   // Initialize stores
   const tripStore = useTripStore();
   const destinationStore = useDestinationStore();
   const eventStore = useEventStore();
   const eventTypeStore = useEventTypeStore();
   const eventPlanStore = useEventPlanStore();
   const teamStore = useTeamStore();
   const clientStore = useClientStore();
   const testimonialStore = useTestimonialStore();
   const faqStore = useFaqStore();
   const userStore = useUserStore();
   const settingStore = useSettingStore();

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);

         // Fetch all data from stores and get counts from API responses
         const [
            tripResponse,
            destinationResponse,
            eventResponse,
            eventTypeResponse,
            eventPlanResponse,
            teamResponse,
            clientResponse,
            testimonialResponse,
            faqResponse,
            userResponse,
            settingResponse,
         ] = await Promise.allSettled([
            tripStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            destinationStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            eventStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            eventTypeStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            eventPlanStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            teamStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            clientStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            testimonialStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            faqStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            userStore.all({ page: 1, limit: 1, sort: 'created_at', order: 'desc' }),
            settingStore.all(),
         ]);

         // Prepare widgets with data
         const widgetsData: WidgetItem[] = [
            {
               title: 'Trips',
               path: paths.dashboard.trip.root,
               icon: 'solar:cup-hot-bold-duotone',
               count:
                  tripResponse.status === 'fulfilled' && tripResponse.value?.data?.pagination?.total
                     ? tripResponse.value.data.pagination.total
                     : 0,
               color: 'primary',
            },
            {
               title: 'Destinations',
               path: paths.dashboard.destinations.root,
               icon: 'solar:point-on-map-bold-duotone',
               count:
                  destinationResponse.status === 'fulfilled' &&
                  destinationResponse.value?.data?.pagination?.total
                     ? destinationResponse.value.data.pagination.total
                     : 0,
               color: 'info',
            },
            {
               title: 'Events',
               path: paths.dashboard.events.root,
               icon: 'solar:calendar-mark-bold-duotone',
               count:
                  eventResponse.status === 'fulfilled' &&
                  eventResponse.value?.data?.pagination?.total
                     ? eventResponse.value.data.pagination.total
                     : 0,
               color: 'success',
            },
            {
               title: 'Event Types',
               path: paths.dashboard.event_types.root,
               icon: 'solar:calendar-add-bold-duotone',
               count:
                  eventTypeResponse.status === 'fulfilled' &&
                  eventTypeResponse.value?.data?.pagination?.total
                     ? eventTypeResponse.value.data.pagination.total
                     : 0,
               color: 'warning',
            },
            {
               title: 'Event Plans',
               path: paths.dashboard.event_plans.root,
               icon: 'solar:checklist-minimalistic-bold-duotone',
               count:
                  eventPlanResponse.status === 'fulfilled' &&
                  eventPlanResponse.value?.data?.pagination?.total
                     ? eventPlanResponse.value.data.pagination.total
                     : 0,
               color: 'error',
            },
            {
               title: 'Teams',
               path: paths.dashboard.team,
               icon: 'solar:user-id-bold-duotone',
               count:
                  teamResponse.status === 'fulfilled' && teamResponse.value?.data?.pagination?.total
                     ? teamResponse.value.data.pagination.total
                     : 0,
               color: 'primary',
            },
            {
               title: 'Clients',
               path: paths.dashboard.client,
               icon: 'solar:case-round-bold-duotone',
               count:
                  clientResponse.status === 'fulfilled' &&
                  clientResponse.value?.data?.pagination?.total
                     ? clientResponse.value.data.pagination.total
                     : 0,
               color: 'secondary',
            },
            {
               title: 'Testimonials',
               path: paths.dashboard.testimonial,
               icon: 'solar:hand-stars-bold-duotone',
               count:
                  testimonialResponse.status === 'fulfilled' &&
                  testimonialResponse.value?.data?.pagination?.total
                     ? testimonialResponse.value.data.pagination.total
                     : 0,
               color: 'info',
            },
            {
               title: 'FAQs',
               path: paths.dashboard.faqs.root,
               icon: 'solar:question-square-bold-duotone',
               count:
                  faqResponse.status === 'fulfilled' && faqResponse.value?.data?.pagination?.total
                     ? faqResponse.value.data.pagination.total
                     : 0,
               color: 'success',
            },
            {
               title: 'Users',
               path: paths.dashboard.users.root,
               icon: 'solar:user-bold-duotone',
               count:
                  userResponse.status === 'fulfilled' && userResponse.value?.data?.pagination?.total
                     ? userResponse.value.data.pagination.total
                     : 0,
               color: 'warning',
            },
            {
               title: 'Settings',
               path: paths.dashboard.settings,
               icon: 'solar:settings-minimalistic-bold-duotone',
               count:
                  settingResponse.status === 'fulfilled' && settingResponse.value?.data?.length
                     ? settingResponse.value.data.length
                     : 0,
               color: 'error',
            },
         ];

         setWidgets(widgetsData);
         setLoading(false);
      };

      fetchData();
   }, []);

   if (loading) {
      return <LoadingScreen />;
   }

   return (
      <DashboardContent>
         <CustomBreadcrumbs
            heading="Dashboard"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }]}
            sx={{ mb: { xs: 3, md: 5 } }}
         />

         <Grid container spacing={3}>
            {widgets.map((widget, index) => (
               <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Link href={widget.path} underline="none">
                     <Card
                        sx={{
                           height: '100%',
                           display: 'flex',
                           flexDirection: 'column',
                           transition: 'transform 0.3s, box-shadow 0.3s',
                           '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: (theme) => theme.shadows[10],
                           },
                        }}
                     >
                        <CardContent>
                           <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                           >
                              <Stack spacing={1}>
                                 <Typography variant="h6" component="div">
                                    {widget.title}
                                 </Typography>
                                 <Typography variant="h4" component="div">
                                    {widget.count}
                                 </Typography>
                              </Stack>
                              <Avatar
                                 sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: `${widget.color}.main`,
                                    color: 'white',
                                 }}
                              >
                                 <Iconify icon={widget.icon} width={28} />
                              </Avatar>
                           </Stack>
                           <Box sx={{ mt: 2 }}>
                              <Chip
                                 label="View Details"
                                 icon={<Iconify icon="solar:alt-arrow-right-outline" />}
                                 variant="soft"
                                 size="small"
                              />
                           </Box>
                        </CardContent>
                     </Card>
                  </Link>
               </Grid>
            ))}
         </Grid>
      </DashboardContent>
   );
}
