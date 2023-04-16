import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, Layout, Dropdown, Button } from '@douyinfe/semi-ui';
import { IconUser, IconExit } from '@douyinfe/semi-icons';
import Link from 'next/link';
import Image from 'next/image';
import MySearch from '../Search';
import MyAvatar from '../Avatar';
import { useUser } from '../User/UserProvider';

const defaultAvatarStyle = {
  flexBasis: '48px',
  flexShrink: 0,
  color: 'rgb(33 33 33)',
  backgroundColor: '#35A2E1',
};

const MyHeader = () => {
  const { data: sessionData } = useSession();
  const { user } = useUser();

  return (
    <Layout.Header>
      <div className='semi-always-dark fixed z-50 flex	w-full items-center justify-between bg-transparent	 bg-cover bg-center 	bg-repeat	px-5 py-1'>
        <img
          src='/bg2.png'
          style={{
            height: '100px',
            width: '100%',
            position: 'absolute',
            top: -23,
            left: 0,
          }}
        />

        <ul className='z-10 flex items-center  gap-x-8'>
          <li className='flex items-center'>
            <Image src={'/logo.webp'} width={64} height={64} alt='logo' />
            <Link href='/'>
              <h1 className='text-xl font-bold'>SquidNet</h1>
            </Link>
          </li>
          {/* <li className='ml-8'>
            <h1 className='text-md font-bold'>Schdeules</h1>
          </li> */}
          {/* <li>
            <h1 className='text-md font-bold'>Poster</h1>
          </li> */}
          <li>
            <Link href='/'>
              <h1 className='text-md font-bold'>Posts</h1>
            </Link>
          </li>
          <li>
            <Link href='/music'>
              <h1 className='text-md font-bold'>Music</h1>
            </Link>
          </li>
          {user?.roleId === 1 && (
            <li>
              <Link href='/admin'>
                <h1 className='text-md font-bold'>Admin</h1>
              </Link>
            </li>
          )}
        </ul>

        <div className='z-10 flex items-center gap-x-2'>
          <MySearch />

          {sessionData ? (
            <Dropdown
              trigger={'click'}
              position={'bottomLeft'}
              render={
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link href='/profile'>
                      <IconUser />
                      Proifle
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div
                      onClick={() =>
                        signOut({
                          callbackUrl: '/',
                        })
                      }
                    >
                      <IconExit />
                      Logout
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              {user?.image ? (
                <Avatar alt='avatar' src={user.image} style={defaultAvatarStyle} />
              ) : (
                <Avatar alt='avatar' style={defaultAvatarStyle}>
                  {user?.name?.charAt(0) || 'UU'}
                </Avatar>
              )}
            </Dropdown>
          ) : (
            <div className='rounded-full bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>
              <Link href='/signin'>Sign in</Link>
            </div>
          )}
        </div>
      </div>
    </Layout.Header>
  );
};

export default MyHeader;
