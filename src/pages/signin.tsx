import Head from 'next/head';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SignIn: NextPage = (props): JSX.Element => {
  const [userInfo, setUserInfo] = useState({ email: 'alan61109@gmail.com', password: '123456' });

  const handleSubmit = async (e: any) => {
    // validate your userinfo
    e.preventDefault();

    const res = await signIn('credentials', {
      email: userInfo.email,
      password: userInfo.password,
      redirect: true,
      callbackUrl: 'http://localhost:3000/',
    });

    console.log(res);
  };
  return (
    <>
      <Head>
        <title>SquidNet</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <section className='h-screen bg-[url("/bg.webp")] bg-cover '>
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
                Sign in to your account
              </h1>
              <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor='email'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Your email
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
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
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
                <div className='flex items-center justify-between'>
                  <div className='flex items-start'>
                    <div className='flex h-5 items-center'>
                      <input
                        id='remember'
                        aria-describedby='remember'
                        type='checkbox'
                        className='focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600'
                      />
                    </div>
                    <div className='ml-3 text-sm'>
                      <label htmlFor='remember' className='text-gray-500 dark:text-gray-300'>
                        Remember me
                      </label>
                    </div>
                  </div>
                  {/* <a
                    href='#'
                    className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    Forgot password?
                  </a> */}
                </div>
                <button
                  type='submit'
                  className='w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                >
                  Sign in
                </button>
                <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                  Don’t have an account yet?{' '}
                  <Link
                    href='/signup'
                    className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
