import type { NextRequest} from 'next/server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { paths } from 'src/routes/al/paths';

// Tangani baik GET maupun POST
export async function GET(req: NextRequest) {
   return handleRefresh(req);
}

export async function POST(req: NextRequest) {
   return handleRefresh(req);
}

async function handleRefresh(req: NextRequest) {
   const cookieStore = await cookies();
   if (cookieStore) {
      const refreshToken = cookieStore.get('refreshToken')?.value;
      const returnTo = req.nextUrl.searchParams.get('returnTo') ?? '/al/dashboard';

      console.log('Refresh token route, returnTo:', returnTo);
      console.log('Refresh token route, refreshToken:', refreshToken);

      if (refreshToken) {
         try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Cookie: `refreshToken=${refreshToken}`,
               },
               cache: 'no-store',
            });

            if (!res.ok) {
               return NextResponse.redirect(
                  new URL(paths.auth.signIn, process.env.NEXT_PUBLIC_APP_URL)
               );
            }

            const data = await res.json();
            const at = data.data?.access_token;
            console.log('Data didapat : ', JSON.stringify(data));

            if (!at) {
               return NextResponse.redirect(
                  new URL(paths.auth.signIn, process.env.NEXT_PUBLIC_APP_URL)
               );
            }

            const response = NextResponse.redirect(
               new URL(returnTo, process.env.NEXT_PUBLIC_APP_URL)
            );

            response.cookies.set('accessToken', at, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: 'lax',
               path: '/',
               maxAge: 15 * 60, // 15 minutes in seconds
            });

            return response;
         } catch {
            return NextResponse.redirect(new URL(paths.auth.signIn, process.env.NEXT_PUBLIC_APP_URL));
         }
      } else {
         return NextResponse.redirect(new URL(paths.auth.signIn, process.env.NEXT_PUBLIC_APP_URL));
      }
   }
   return NextResponse.redirect(new URL(paths.auth.signIn, process.env.NEXT_PUBLIC_APP_URL));
}
