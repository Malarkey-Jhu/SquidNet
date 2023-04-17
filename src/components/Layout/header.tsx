import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, Layout, Dropdown, Button } from '@douyinfe/semi-ui';
import { IconUser, IconExit, IconMenu, IconClose } from '@douyinfe/semi-icons';
import Link from 'next/link';
import Image from 'next/image';
import MySearch from '../Search';
import MyAvatar from '../Avatar';
import { useUser } from '../User/UserProvider';
import React, { useEffect } from 'react';
import cx from 'classnames';

const defaultAvatarStyle = {
  flexBasis: '48px',
  flexShrink: 0,
  color: 'rgb(33 33 33)',
  backgroundColor: '#35A2E1',
};

const MyHeader = () => {
  const { data: sessionData } = useSession();
  const { user } = useUser();
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'auto';
  }, [show]);

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
        <Link href='/' className='z-10 flex items-center justify-center'>
          <Image src={'/logo.webp'} width={64} height={64} alt='logo' />
          <h1 className='text-xl font-bold'>SquidNet</h1>
        </Link>

        <Dropdown
          trigger={'custom'}
          position={'bottomLeft'}
          visible={show}
          spacing={15}
          onClickOutSide={() => setShow(false)}
          render={
            <Dropdown.Menu className='semi-always-dark round-lg w-[200px] bg-[url("/bg.webp")] bg-cover p-10'>
              <Dropdown.Item className='m-auto'>
                {sessionData?.user ? (
                  <div className='flex items-center justify-center gap-x-2'>
                    {user?.image ? (
                      <Avatar alt='avatar' src={user.image} style={defaultAvatarStyle} />
                    ) : (
                      <Avatar alt='avatar' style={defaultAvatarStyle}>
                        {user?.name?.charAt(0) || 'UU'}
                      </Avatar>
                    )}
                    <h1 className='text-xl font-bold'>{user?.name || 'Unknown User'}</h1>
                  </div>
                ) : (
                  <Link href='/signin'>
                    <h1 className='text-md font-bold'>Sign in</h1>
                  </Link>
                )}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Link href={'/search'}>
                <Dropdown.Item className='m-auto'>
                  <h1 className='text-md font-bold'>Search</h1>
                </Dropdown.Item>
              </Link>
              <Link href={'/music'}>
                <Dropdown.Item className='m-auto'>
                  <h1 className='text-md font-bold'>Music</h1>
                </Dropdown.Item>
              </Link>
              {user?.roleId === 1 && (
                <Link href={'/admin'}>
                  <Dropdown.Item className='m-auto'>
                    <h1 className='text-md font-bold'>Admin</h1>
                  </Dropdown.Item>
                </Link>
              )}
              {sessionData?.user && (
                <>
                  <Link href={'/profile'}>
                    <Dropdown.Item className='m-auto'>
                      <h1 className='text-md font-bold'>Profile</h1>
                    </Dropdown.Item>
                  </Link>
                  <Dropdown.Item
                    className='m-auto'
                    onClick={() =>
                      signOut({
                        callbackUrl: '/',
                      })
                    }
                  >
                    <h1 className='text-md font-bold'>Sign out</h1>
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          }
        >
          <button
            className={
              'z-10 ml-3 inline-flex items-center rounded-lg p-2 text-sm text-primary-500 hover:bg-primary-100  md:hidden'
            }
            aria-controls='navbar-default'
            aria-expanded='false'
            onClick={() => setShow((s) => !s)}
          >
            {show ? <IconClose /> : <IconMenu />}
          </button>
        </Dropdown>

        <div className={'z-10 hidden w-full md:block md:w-auto'} id='navbar-default'>
          <ul className='mt-4 flex flex-col items-center justify-center bg-white p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-transparent md:p-0 '>
            <li>
              <Link href={'/search'}>
                <h1 className='text-md font-bold hover:text-primary-700'>Search</h1>
              </Link>
            </li>
            <li>
              <Link href='/music'>
                <h1 className='text-md font-bold hover:text-primary-700'>Music</h1>
              </Link>
            </li>
            {user?.roleId === 1 && (
              <li>
                <Link href='/admin'>
                  <h1 className='text-md font-bold hover:text-primary-700'>Admin</h1>
                </Link>
              </li>
            )}

            <li className='z-10 flex items-center gap-x-2'>
              {/* <MySearch /> */}

              {sessionData ? (
                <Dropdown
                  trigger={'click'}
                  position={'bottomLeft'}
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <Link href='/profile' className='flex items-center gap-x-2'>
                          <IconUser />
                          <span>Proifle</span>
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <div
                          className='flex items-center gap-x-2'
                          onClick={() =>
                            signOut({
                              callbackUrl: '/',
                            })
                          }
                        >
                          <IconExit />
                          <span>Sign out</span>
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
            </li>
          </ul>
        </div>
      </div>
    </Layout.Header>
  );
};

export default MyHeader;
