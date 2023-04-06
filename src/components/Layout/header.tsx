import { signIn, signOut, useSession } from 'next-auth/react';
import { Layout } from '@douyinfe/semi-ui';

const MyHeader = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout.Header>
      <div className='flex flex items-center justify-end gap-4 p-4'>
        <p className='text-md text-center text-black'>
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        </p>
        <button
          className='rounded-full bg-black/10 px-5 py-2 font-semibold text-black no-underline transition hover:bg-black/20'
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? 'Sign out' : 'Sign in'}
        </button>
      </div>
    </Layout.Header>
  );
};

export default MyHeader;
