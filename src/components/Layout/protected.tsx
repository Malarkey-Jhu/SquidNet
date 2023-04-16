import React, { ReactNode } from 'react';
import { Layout } from '@douyinfe/semi-ui';
import MyHeader from './header';
import MySider from './sider';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const ProtectedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const session = useSession();
  const { Header, Footer, Content, Sider } = Layout;
  return (
    <Layout className='semi-always-dark'>
      <Layout className='relative	h-screen bg-[url("/bg.webp")] bg-cover'>
        <MyHeader />
        <Content className='mt-16'>
          {session.data?.user ? (
            children
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <h1 className='text-4xl font-bold text-white'>
                Please{' '}
                <Link href={'/signin'}>
                  <span className='hover:underline'> signin</span>
                </Link>{' '}
                to view this page{' '}
              </h1>
            </div>
          )}
        </Content>
        {/* <Footer className='flex justify-center p-10'>Footer</Footer> */}
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
