'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/al/paths';
import { useRouter } from 'src/routes/hooks';

import useAuthStore from 'src/stores/auth';
import { EmailInboxIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from 'src/auth/components/form-head';
import { FormResendCode } from 'src/auth/components/form-resend-code';
import { FormReturnLink } from 'src/auth/components/form-return-link';

// ----------------------------------------------------------------------

export type VerifySchemaType = z.infer<typeof VerifySchema>;

export const VerifySchema = z.object({
   code: z
      .string()
      .min(1, { error: 'Code is required!' })
      .min(6, { error: 'Code must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function VerifyView() {
   const { registData, validateOTP, login } = useAuthStore();
   const router = useRouter();
   const defaultValues: VerifySchemaType = {
      code: '',
   };

   const methods = useForm({
      resolver: zodResolver(VerifySchema),
      defaultValues,
   });

   const {
      handleSubmit,
      formState: { isSubmitting },
   } = methods;

   const onSubmit = handleSubmit(async (data) => {
      console.log("OTP submitted:", data.code);
      if (registData.purpose) {
         const bodyRegist = { code: data.code, purpose: registData.purpose }
         const bodyLogin = { login: registData.isEmail ? registData.email : registData.phone, code: data.code, purpose: registData.purpose }

         try {
            let fetch;
            const gas = registData.purpose == "login"
            if (gas) {
               fetch = await login(bodyLogin)
            } else {
               fetch = await validateOTP(bodyRegist)
            }

            if (fetch.success) {
               router.replace((gas ? paths.dashboard.root : paths.auth.signUp));
            } else {
               toast.error(fetch.message)
            }
         } catch (error: any) {
            toast.error(`${error?.response?.data?.message} - ${error?.response?.data?.data}`)
         }

      } else {
         router.replace(paths.auth.signIn);
      }
   });

   const renderForm = () => (
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
         <Field.Code name="code" />

         <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Verify..."
         >
            Verify
         </Button>
      </Box>
   );

   return (
      <>
         <FormHead
            icon={<EmailInboxIcon />}
            title="Periksa Email / WhatsApp anda!"
            description="Kami telah mengirimkan 6-digit kode OTP ke Email / WhatsApp anda! masukan kode tersebut untuk melanjutkan."
         />

         <Form methods={methods} onSubmit={onSubmit}>
            {renderForm()}
         </Form>

         <FormResendCode onResendCode={() => { }} value={0} disabled={false} />

         <FormReturnLink href={paths.auth.signIn} label="kembali ke halaman masuk" />
      </>
   );
}
