import React from 'react';
import { Layout } from '@douyinfe/semi-ui';
import MyHeader from './header';
import Head from 'next/head';

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
        <Layout
          className='relative min-h-screen bg-[url("/bg.webp")] bg-repeat-y'
          style={{ minHeight: '100vh' }}
        >
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
