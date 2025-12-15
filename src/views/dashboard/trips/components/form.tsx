'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import { InputAdornment, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';

import { toast } from 'src/components/snackbar';
import { Field, Form } from 'src/components/hook-form';
import { countries } from 'src/stores/countries';
import { useBoolean } from 'minimal-shared/hooks';
import { slugify } from '../helpers/slug';
import { useEffect, useState } from 'react';
import useTripStore from 'src/stores/trip';
import { CONFIG } from 'src/global-config';
import { DestinationForm } from 'src/views/dashboard/destinations/components/form';
import useDestinationStore from 'src/stores/destination';
import { paths } from 'src/routes/al/paths';
import { useRouter } from 'src/routes/hooks';
import { TripSchema, TripType } from 'src/types/trip';

// ----------------------------------------------------------------------
const ctgTrips = [
   { key: 'open-trip', value: 'Open Trip' },
   { key: 'private-trip', value: 'Private Trip' },
];
// ----------------------------------------------------------------------

type Props = {
   onSuccess?: () => void;
   currentTrip?: TripType;
};

export function TripForm({ currentTrip, onSuccess }: Props) {
   const { destinations, all } = useDestinationStore();
   const router = useRouter();
   const addDestination = useBoolean();
   const [slug, setSlug] = useState<string>(currentTrip?.slug ?? '');

   let parsedImages: string[] = [];

   if (currentTrip?.images) {
      let imageList: any[] = [];

      // Kasus 1: images sudah berupa array (File atau string)
      if (Array.isArray(currentTrip.images)) {
         imageList = currentTrip.images;
      }
      // Kasus 2: images adalah string JSON array
      else if (typeof currentTrip.images === 'string') {
         try {
            const parsed = JSON.parse(currentTrip.images);
            if (Array.isArray(parsed)) {
               imageList = parsed;
            } else {
               // Misalnya: "image.jpg" (bukan array JSON) → anggap sebagai satu item
               imageList = [currentTrip.images];
            }
         } catch (e) {
            // Jika gagal parse JSON, anggap sebagai satu string gambar
            imageList = [currentTrip.images];
         }
      }

      // Sekarang proses imageList menjadi URL lengkap
      parsedImages = imageList
         .map((img) => {
            if (!img) return null;

            if (typeof img === 'string') {
               // Langsung string → jadi URL
               return img.startsWith('http') ? img : `${CONFIG.apiHostUrl}/${img}`;
            }

            if (typeof img === 'object') {
               // Cari properti yang berisi path
               const path = img.path || img.url || img.image || img.src || img;
               if (typeof path === 'string') {
                  return path.startsWith('http') ? path : `${CONFIG.apiHostUrl}/${path}`;
               }
            }

            return null;
         })
         .filter((url): url is string => !!url); // Hanya ambil string non-null
   }

   console.log('🔧 Final parsedImages:', parsedImages);

   // Default values for the form
   const defaultValues: TripType = {
      title: currentTrip?.title || '',
      slug: currentTrip?.slug || '',
      description: currentTrip?.description || '',
      location: currentTrip?.location || '',
      country: currentTrip?.country || '',
      type: currentTrip?.type || 'open-trip',
      duration: currentTrip?.duration || '',
      price: currentTrip?.price || 0,
      image: currentTrip?.image
         ? typeof currentTrip.image === 'string'
            ? `${CONFIG.apiHostUrl}/${currentTrip.image}`
            : currentTrip.image
         : null,
      images: parsedImages,
      min_people: currentTrip?.min_people || 2,
      meet_point: currentTrip?.meet_point || '',
      destinations: currentTrip?.destinations || [],
      content: currentTrip?.content || '',
      open_dates: currentTrip?.open_dates || [{ from_date: '', to_date: '' }],
      itinerary: currentTrip?.itinerary || [
         {
            day: 1,
            activities: [
               { time: '08:00', description: 'Arrival and check-in' },
               { time: '12:00', description: 'Lunch' },
            ],
         },
      ],
   };

   const methods = useForm({
      mode: 'onSubmit',
      resolver: zodResolver(TripSchema),
      defaultValues,
   });

   useEffect(() => {
      const subscription = methods.watch((value, { name }) => {
         if (name === 'images') {
            console.log('📸 Watch images:', value);
         }
      });
      return () => subscription.unsubscribe();
   }, [methods]);

   const {
      reset,
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { isSubmitting },
   } = methods;

   useEffect(() => {
      all({limit: 1000});
   }, []);
   // Watch for changes in open_dates and itinerary
   const openDates = watch('open_dates');
   const itinerary = watch('itinerary');
   const images = watch('images');

   const { add, update } = useTripStore();

   const handleRemoveFile = (inputFile: File | string) => {
      const filtered = images?.filter((file) => file !== inputFile);
      setValue('images', filtered, { shouldValidate: true, shouldDirty: true });
   };

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.info('Trip Form Data:', data);

         // Manually include the slug value since the field is disabled
         const formData = {
            ...data,
            slug: slug || data.slug,
         };

         // For updates, handle image fields carefully to support independent updates
         if (currentTrip?.id) {
            // Handle single cover image
            const imageField = methods.getFieldState('image');
            if (formData.image) {
               // Keep if it's a new File, delete if it's a URL string
               if (typeof formData.image === 'string') {
                  delete formData.image;
               }
               // If it's a File object, keep it (will be sent to backend)
            } else if (!imageField.isDirty) {
               // Field not touched and no value → delete to preserve DB
               delete formData.image;
            }

            // Handle multiple slider images
            // We pass the mixed array (File objects + URL strings) directly to the store
            // The store will handle appending them to FormData
            if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
               // No filtering here, pass everything
            } else {
               // If empty or not array, delete to be safe or let store handle it
               if (!formData.images || formData.images.length === 0) {
                  delete formData.images;
               }
            }
         }

         let result;
         if (currentTrip?.id) {
            // Update existing trip
            result = await update({ id: currentTrip.id, data: formData });
         } else {
            // Create new trip
            result = await add({ data: formData });
         }

         if (result.success) {
            toast.success(
               currentTrip ? 'Trip updated successfully!' : 'Trip created successfully!'
            );
            onSuccess?.();
            reset();
            router.replace(paths.dashboard.trip.root);
         } else {
            toast.error(result.message || 'An error occurred while saving the trip');
         }
      } catch (error) {
         console.error(error);
         toast.error('An error occurred while saving the trip');
      }
   });

   // Function to add a new open date
   const addOpenDate = () => {
      const currentOpenDates = watch('open_dates') || [];
      setValue('open_dates', [...currentOpenDates, { from_date: '', to_date: '' }]);
   };

   // Function to remove an open date
   const removeOpenDate = (index: number) => {
      const currentOpenDates = watch('open_dates') || [];
      const updatedDates = currentOpenDates.filter((_, i) => i !== index);
      setValue('open_dates', updatedDates);
   };

   // Function to add a new itinerary day
   const addItineraryDay = () => {
      const currentItinerary = watch('itinerary') || [];
      const newDayNumber =
         currentItinerary.length > 0
            ? Math.max(...currentItinerary.map((item) => item.day || 0)) + 1
            : 1;

      setValue('itinerary', [
         ...currentItinerary,
         {
            day: newDayNumber,
            activities: [{ time: '08:00', description: 'Activity description' }],
         },
      ]);
   };

   // Function to remove an itinerary day
   const removeItineraryDay = (index: number) => {
      const currentItinerary = watch('itinerary') || [];
      const updatedItinerary = currentItinerary.filter((_, i) => i !== index);
      setValue('itinerary', updatedItinerary);
   };

   // Function to add an activity to a specific day
   const addActivityToDay = (dayIndex: number) => {
      const currentItinerary = watch('itinerary') || [];
      const updatedItinerary = [...currentItinerary];

      if (updatedItinerary[dayIndex] && updatedItinerary[dayIndex].activities) {
         updatedItinerary[dayIndex].activities = [
            ...(updatedItinerary[dayIndex].activities || []),
            { time: '08:00', description: 'New activity' },
         ];
         setValue('itinerary', updatedItinerary);
      }
   };

   // Function to remove an activity from a specific day
   const removeActivityFromDay = (dayIndex: number, activityIndex: number) => {
      const currentItinerary = watch('itinerary') || [];
      const updatedItinerary = [...currentItinerary];

      if (
         updatedItinerary[dayIndex] &&
         updatedItinerary[dayIndex].activities &&
         updatedItinerary[dayIndex].activities![activityIndex]
      ) {
         updatedItinerary[dayIndex].activities = updatedItinerary[dayIndex].activities!.filter(
            (_, i) => i !== activityIndex
         );
         setValue('itinerary', updatedItinerary);
      }
   };

   return (
      <>
         <Form methods={methods} onSubmit={onSubmit}>
            <Box sx={{ pt: 1, pb: 0, flexGrow: 1, overflow: 'auto' }}>
               <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                     <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                           Cover Image
                        </Typography>
                        <Field.Upload
                           name="image"
                           maxSize={5242880} // 5MB
                           helperText={
                              <Typography
                                 variant="caption"
                                 sx={{
                                    mt: 1,
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.disabled',
                                 }}
                              >
                                 Allowed *.jpeg, *.jpg, *.png, *.webp max size of 5MB
                              </Typography>
                           }
                        />
                     </Box>
                     <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                           Slider Images
                        </Typography>
                        <Field.Upload
                           name="images"
                           maxSize={5242880} // 5MB
                           multiple
                           onRemove={handleRemoveFile}
                           helperText={
                              <Typography
                                 variant="caption"
                                 sx={{
                                    mt: 1,
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.disabled',
                                 }}
                              >
                                 Allowed *.jpeg, *.jpg, *.png, *.webp max size of 5MB each
                              </Typography>
                           }
                        />
                     </Box>
                  </Grid>
                  {/* Left Column - Basic Info */}
                  <Grid size={{ xs: 12 }}>
                     <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 1 }}>
                           <Field.Text
                              name="title"
                              label="Trip Title"
                              fullWidth
                              onBlur={(e) => setSlug(slugify(e.target.value))}
                           />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 1 }}>
                           <Field.Text
                              name="slug"
                              label="Slug"
                              fullWidth
                              value={slug}
                              disabled
                              helperText="URL-friendly version of the title"
                           />
                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ mb: 3 }}>
                           <Field.Text
                              multiline
                              name="description"
                              label="Description"
                              minRows={3}
                              fullWidth
                              helperText="Also used as SEO meta description"
                           />
                        </Grid>
                     </Grid>

                     <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="location" label="Location" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Autocomplete
                              name="country"
                              label="Country"
                              autoHighlight
                              options={countries}
                              getOptionLabel={(option) => option?.name ?? ''}
                              isOptionEqualToValue={(option, value) => option?.slug === value?.slug}
                              onChange={(_, value) =>
                                 methods.setValue('country', value?.name || '')
                              }
                              value={
                                 countries.find((ctr) => ctr.name === methods.watch('country')) ||
                                 null
                              }
                           />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                           <Field.Select
                              name="type"
                              label="Type"
                              slotProps={{
                                 select: { native: true },
                                 inputLabel: { shrink: true },
                              }}
                           >
                              {ctgTrips.map((category) => (
                                 <option key={category.key} value={category.key}>
                                    {category.value}
                                 </option>
                              ))}
                           </Field.Select>
                        </Grid>
                     </Grid>

                     <Grid container spacing={3} mt={3}>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 1 }}>
                           <Field.Text
                              name="duration"
                              label="Duration (xDxN)"
                              fullWidth
                              helperText="e.g., 5D4N"
                           />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 3 }}>
                           <Field.Text
                              name="price"
                              label="Price"
                              placeholder="0.00"
                              type="number"
                              slotProps={{
                                 inputLabel: { shrink: true },
                                 input: {
                                    startAdornment: (
                                       <InputAdornment position="start" sx={{ mr: 0.75 }}>
                                          <Box component="span" sx={{ color: 'text.disabled' }}>
                                             IDR
                                          </Box>
                                       </InputAdornment>
                                    ),
                                 },
                              }}
                           />
                        </Grid>
                     </Grid>

                     <Grid container spacing={2}>
                        {methods.watch('type') == 'private-trip' && (
                           <Grid size={{ xs: 12, md: 6 }}>
                              <Field.Text type="number" name="min_people" label="Minimum People" />
                           </Grid>
                        )}
                        <Grid size={{ xs: 12, md: 6 }}>
                           <Field.Text name="meet_point" label="Meeting Point" />
                        </Grid>
                     </Grid>
                  </Grid>

                  {/* Right Column - Content and Destinations */}
                  <Grid size={{ xs: 12 }}>
                     <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                           Trip Content
                        </Typography>
                        <Field.Editor name="content" />
                     </Box>
                  </Grid>
               </Grid>

               <Box
                  sx={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     mb: 2,
                  }}
               >
                  <Typography variant="h6">Destinations</Typography>
                  <Button variant="outlined" onClick={addDestination.onTrue} size="small">
                     Add Destination
                  </Button>
               </Box>
               <Box sx={{ mb: 3 }}>
                  <Field.Autocomplete
                     name="destinations"
                     label="Destinations"
                     placeholder="Select destinations"
                     multiple
                     options={destinations.length > 0 ? destinations : []}
                     getOptionLabel={(option) => option.title || option.label || String(option)}
                     isOptionEqualToValue={(option, value) => option.id === value.id}
                     renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                           <Typography variant="body2">
                              {option.title || option.label || String(option)}
                           </Typography>
                        </li>
                     )}
                     slotProps={{
                        chip: {
                           color: 'info',
                        },
                     }}
                  />
               </Box>

               {/* Open Dates Section */}
               <Box sx={{ mt: 4, mb: 3 }}>
                  <Box
                     sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                     }}
                  >
                     <Typography variant="h6">Open Dates</Typography>
                     <Button variant="outlined" onClick={addOpenDate} size="small">
                        Add Date
                     </Button>
                  </Box>

                  {openDates?.map((date, index) => (
                     <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'end' }}>
                        <Field.DatePicker
                           name={`open_dates.${index}.from_date`}
                           label="From Date"
                           slotProps={{ textField: { fullWidth: true } }}
                        />
                        <Field.DatePicker
                           name={`open_dates.${index}.to_date`}
                           label="To Date"
                           slotProps={{ textField: { fullWidth: true } }}
                        />
                        <Button
                           variant="outlined"
                           color="error"
                           onClick={() => removeOpenDate(index)}
                           disabled={openDates.length <= 1}
                        >
                           Remove
                        </Button>
                     </Box>
                  ))}
               </Box>

               {/* Itinerary Section */}
               <Box sx={{ mt: 4, mb: 3 }}>
                  <Box
                     sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                     }}
                  >
                     <Typography variant="h6">Itinerary</Typography>
                     <Button variant="outlined" onClick={addItineraryDay} size="small">
                        Add Day
                     </Button>
                  </Box>

                  {itinerary?.map((day, dayIndex) => (
                     <Box
                        key={dayIndex}
                        sx={{
                           mb: 4,
                           p: 2,
                           border: '1px solid',
                           borderColor: 'divider',
                           borderRadius: 1,
                        }}
                     >
                        <Box
                           sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 2,
                           }}
                        >
                           <Typography variant="h6">Day {day.day}</Typography>
                           <Button
                              variant="outlined"
                              color="error"
                              onClick={() => removeItineraryDay(dayIndex)}
                              disabled={itinerary.length <= 1}
                           >
                              Remove Day
                           </Button>
                        </Box>

                        <Stack spacing={2}>
                           {day.activities?.map((activity, activityIndex) => (
                              <Box
                                 key={activityIndex}
                                 sx={{ display: 'flex', gap: 2, alignItems: 'end' }}
                              >
                                 <Field.Text
                                    name={`itinerary.${dayIndex}.activities.${activityIndex}.time`}
                                    label="Time"
                                    fullWidth
                                 />
                                 <Field.Text
                                    name={`itinerary.${dayIndex}.activities.${activityIndex}.description`}
                                    label="Activity"
                                    fullWidth
                                 />
                                 <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => removeActivityFromDay(dayIndex, activityIndex)}
                                    disabled={day.activities && day.activities.length <= 1}
                                 >
                                    Remove
                                 </Button>
                              </Box>
                           ))}

                           <Button
                              variant="outlined"
                              onClick={() => addActivityToDay(dayIndex)}
                              sx={{ alignSelf: 'flex-start' }}
                           >
                              Add Activity
                           </Button>
                        </Stack>
                     </Box>
                  ))}
               </Box>
            </Box>

            <Box sx={{ position: 'sticky', bottom: 0, end: 0, start: 0, zIndex: 99, pb: 2 }}>
               <Button type="submit" variant="contained" fullWidth loading={isSubmitting}>
                  {currentTrip ? 'Update' : 'Add New'}
               </Button>
            </Box>
         </Form>

         {/* Updated to use the destination form from the destinations module */}
         <DestinationForm
            open={addDestination.value}
            onSuccess={() => {
               all();
            }}
            onClose={addDestination.onFalse}
         />
      </>
   );
}
