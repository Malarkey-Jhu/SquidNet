import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type ReactElement, type ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { api } from '@/utils/api';

import '@/styles/globals.css';
import { UserProivder } from '@/components/User/UserProvider';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  useEffect(() => {
    const body = document.body;
    if (body.hasAttribute('theme-mode')) {
      body.removeAttribute('theme-mode');
    } else {
      body.setAttribute('theme-mode', 'dark');
    }
  }, []);
  return (
    <SessionProvider session={session}>
      <UserProivder>{getLayout(<Component {...pageProps} />)}</UserProivder>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
