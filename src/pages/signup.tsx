import { type NextPage } from 'next';
import { Toast } from '@douyinfe/semi-ui';

import Head from 'next/head';
import Link from 'next/link';
import cx from 'classnames';

import { api } from '@/utils/api';
import { useEffect, useState } from 'react';
import { Banner } from '@douyinfe/semi-ui';
import Image from 'next/image';
import router from 'next/router';

const Home: NextPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    passwordCheck: '',
  });
  const mutation = api.user.register.useMutation();
  const handleSubmit = async (e: any) => {
    if (userInfo.password != userInfo.passwordCheck) return;
    e.preventDefault();
    mutation.mutate(
      {
        email: userInfo.email,
        password: userInfo.password,
        name: userInfo.name,
      },
      {
        onSuccess() {
          Toast.success({ content: 'Register success!', duration: 2 });
          setTimeout(() => {
            router.push('/signin');
          }, 3000);
        },
        onError(error, variables, context) {
          Toast.error({ content: error.message, duration: 3 });
        },
      },
    );
  };

  return (
    <>
      <>
        <Head>
          <title>SquidNet</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <Banner type='info' description='A pre-released version is available.' />
        <section className='h-screen bg-[url("/bg.webp")] bg-cover'>
          <div className='flex h-full w-full flex-col items-center justify-center px-6 py-8 lg:py-0'>
            <Link href='/'>
              <div className='mb-2 flex items-center text-3xl font-semibold text-white'>
                <Image src={'/logo.webp'} width={64} height={64} alt='logo' />
                SquidNet
              </div>
            </Link>
            <div className='w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0'>
              <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
                <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
                  Sign up
                </h1>
                <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor='name'
                      className="mb-2 block text-sm font-medium text-gray-900 after:ml-0.5 after:text-red-500 after:content-['*'] dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                      placeholder='your name'
                      required={true}
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='email'
                      className="mb-2 block text-sm font-medium text-gray-900 after:ml-0.5 after:text-red-500 after:content-['*'] dark:text-white dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      id='email'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                      placeholder='name@company.com'
                      required={true}
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='password'
                      className="mb-2 block text-sm font-medium text-gray-900 after:ml-0.5 after:text-red-500 after:content-['*'] dark:text-white dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type='password'
                      name='password'
                      id='password'
                      placeholder='••••••••'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                      required={true}
                      value={userInfo.password}
                      onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='password2'
                      className="mb-2 block text-sm font-medium text-gray-900 after:ml-0.5 after:text-red-500 after:content-['*'] dark:text-white dark:text-white"
                    >
                      Password Check
                    </label>
                    <input
                      type='password'
                      name='password2'
                      id='password2'
                      placeholder='••••••••'
                      className={cx(
                        'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        {
                          'border-red-600 focus:border-red-600 focus:ring-red-600 focus-visible:ring-red-600':
                            userInfo.password !== userInfo.passwordCheck,
                        },
                      )}
                      required={true}
                      value={userInfo.passwordCheck}
                      onChange={(e) => setUserInfo({ ...userInfo, passwordCheck: e.target.value })}
                    />
                    {userInfo.password !== userInfo.passwordCheck && (
                      <p className='text-xs italic text-red-500'>
                        Please enter the same password twice.
                      </p>
                    )}
                  </div>

                  <button
                    type='submit'
                    className='w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                  >
                    Sign up
                  </button>
                  <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                    Already have an account?{' '}
                    <Link
                      className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                      href={'/signin'}
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
};

export default Home;
