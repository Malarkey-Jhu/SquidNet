import React, { ReactElement } from 'react';
import Layout from '@/components/Layout';

const Profile = () => {
  return (
    <>
      <main className='profile-page bg-gray-50'>
        <section className='relative block' style={{ height: '500px' }}>
          <div className='absolute top-0 h-full w-full '></div>
          <div
            className='pointer-events-none absolute top-auto bottom-0 left-0 right-0 w-full overflow-hidden'
            style={{ height: '70px' }}
          ></div>
        </section>
        <section className='relative py-16'>
          <div className='mx-auto w-[700px] px-4'>
            <div className='relative mb-6 -mt-64 flex min-w-0 flex-col break-words rounded-lg bg-white shadow-xl'>
              <div className='px-6'>
                <div className='flex flex-wrap justify-center'>
                  <div className='flex w-full justify-center px-4 lg:order-2 lg:w-3/12'>
                    <div className='relative'>
                      <img
                        alt='...'
                        src={'team-2-800x800.jpg'}
                        className='absolute -m-16 -ml-20 h-auto rounded-full border-none align-middle shadow-xl lg:-ml-16'
                        style={{ maxWidth: '150px' }}
                      />
                    </div>
                  </div>
                  <div className='w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right'>
                    <div className='mt-32 py-6 px-3 sm:mt-0'>
                      <button
                        className='mb-1 rounded bg-pink-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none hover:shadow-md focus:outline-none active:bg-pink-600 sm:mr-2'
                        type='button'
                        style={{ transition: 'all .15s ease' }}
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                  <div className='w-full px-4 lg:order-1 lg:w-4/12'>
                    <div className='flex justify-center py-4 pt-8 lg:pt-4'>
                      <div className='mr-4 p-3 text-center'>
                        <span className='block text-xl font-bold uppercase tracking-wide text-gray-700'>
                          22
                        </span>
                        <span className='text-sm text-gray-500'>Friends</span>
                      </div>
                      <div className='mr-4 p-3 text-center'>
                        <span className='block text-xl font-bold uppercase tracking-wide text-gray-700'>
                          10
                        </span>
                        <span className='text-sm text-gray-500'>Photos</span>
                      </div>
                      <div className='p-3 text-center lg:mr-4'>
                        <span className='block text-xl font-bold uppercase tracking-wide text-gray-700'>
                          89
                        </span>
                        <span className='text-sm text-gray-500'>Comments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-12 text-center'>
                  <h3 className='mb-2 text-4xl font-semibold leading-normal text-gray-800'>
                    Jenna Stones
                  </h3>
                  <div className='mt-0 mb-2 text-sm font-bold uppercase leading-normal text-gray-500'>
                    <i className='fas fa-map-marker-alt mr-2 text-lg text-gray-500'></i> Los
                    Angeles, California
                  </div>
                  <div className='mb-2 mt-10 text-gray-700'>
                    <i className='fas fa-briefcase mr-2 text-lg text-gray-500'></i>
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div className='mb-2 text-gray-700'>
                    <i className='fas fa-university mr-2 text-lg text-gray-500'></i>
                    University of Computer Science
                  </div>
                </div>
                <div className='mt-10 border-t border-gray-300 py-10 text-center'>
                  <div className='flex flex-wrap justify-center'>
                    <div className='w-full px-4 lg:w-9/12'>
                      <p className='mb-4 text-lg leading-relaxed text-gray-800'>
                        An artist of considerable range, Jenna the name taken by Melbourne-raised,
                        Brooklyn-based Nick Murphy writes, performs and records all of his own
                        music, giving it a warm, intimate feel with a solid groove structure. An
                        artist of considerable range.
                      </p>
                      <a
                        href='#pablo'
                        className='font-normal text-pink-500'
                        onClick={(e) => e.preventDefault()}
                      >
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Profile;
