import React from 'react';
import { Layout } from '@douyinfe/semi-ui';
import MyHeader from './header';
import MySider from './sider';
import { useSession } from 'next-auth/react';

const MyLayout = ({ children }) => {
  const { Header, Footer, Content, Sider } = Layout;
  return (
    <Layout className='semi-always-dark'>
      <Layout className='h-min-full relative bg-[url("/bg.webp")] bg-cover'>
        <MyHeader />
        {/* <MySider /> */}
        <Content className='mt-16'>{children}</Content>
        {/* <Footer className='flex justify-center p-10'>Footer</Footer> */}
      </Layout>
    </Layout>
  );
};

export default MyLayout;
