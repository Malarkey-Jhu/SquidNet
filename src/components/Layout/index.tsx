import React from 'react';
import { Layout } from '@douyinfe/semi-ui';
import MyHeader from './header';
import Head from 'next/head';
import MySider from './sider';
import { useSession } from 'next-auth/react';

const MyLayout = ({ children }) => {
  const { Header, Footer, Content, Sider } = Layout;
  return (
    <>
      <Head>
        <title>SquidNet</title>
        <meta name='description' content='Forum for Splatoon' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout className='semi-always-dark'>
        <Layout className='h-min-full relative bg-[url("/bg.webp")] bg-cover'>
          <MyHeader />
          {/* <MySider /> */}
          <Content className='mt-16'>{children}</Content>
          {/* <Footer className='flex justify-center p-10'>Footer</Footer> */}
        </Layout>
      </Layout>
    </>
  );
};

export default MyLayout;
