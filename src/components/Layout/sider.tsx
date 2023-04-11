import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import Icon, { IconHome, IconSend, IconUserSetting } from '@douyinfe/semi-icons';

const Sider = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <div className='fixed top-[30%] z-10  w-52 rounded-xl bg-white py-6 shadow-md lg:left-[10%] xl:left-[10%]'>
        <ul className='flex w-full flex-col items-center gap-5 text-lg'>
          <li className='w-[90px]'>
            <Link href='/'>
              <div className='mr-2 inline-block	w-[20px]'>
                <IconHome />
              </div>
              <span>Home</span>
            </Link>
          </li>
          <li className='w-[90px]'>
            <Link href='/post'>
              <div className='mr-2  inline-block	w-[20px]'>
                <IconSend />
              </div>
              <span>Post</span>
            </Link>
          </li>
          <li className='w-[90px]'>
            <Link href='/profile'>
              <div className='mr-2  inline-block	w-[20px]'>
                <IconUserSetting />
              </div>
              <span>Profile</span>
            </Link>
          </li>

          <li>
            <button
              className='mt-8 rounded-full bg-black/10 px-4 py-2 text-black no-underline transition hover:bg-black/20'
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? 'Sign out' : 'Sign in'}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sider;
