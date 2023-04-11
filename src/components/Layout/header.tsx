import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, Layout } from '@douyinfe/semi-ui';

const MyHeader = () => {
  const { data: sessionData } = useSession();

  return (
    <Layout.Header>
      <div className='fixed w-full z-50	flex items-center justify-end gap-4 p-5 bg-white'>

      <button
          className='rounded-full bg-black/10 px-5 py-2 font-semibold text-black no-underline transition hover:bg-black/20'
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? 'Sign out' : 'Sign in'}
        </button>
        
        <p className='text-md text-center text-black'>
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        </p>
       

        <Avatar
            alt="avatar"
            src="https://5610-final.oss-cn-shanghai.aliyuncs.com/images/assets/splatoon3-avatar.webp"
        />
      </div>
    </Layout.Header>
  );
};

export default MyHeader;
