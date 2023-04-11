import React from 'react';
import { Layout } from '@douyinfe/semi-ui';
import MyHeader from './header';
import MySider from './sider';

const MyLayout = ({ children }) => {
  const { Header, Footer, Content, Sider } = Layout;
  return (
    <Layout className='components-layout-demo'>
      <Layout className='relative bg-[#F8F8F8]'>
        <MyHeader />
        {/* <MySider /> */}
        <Content className='mt-16'>{children}</Content>
        <Footer className='flex justify-center p-10'>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
