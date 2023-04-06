import React from 'react';
import { Layout } from '@douyinfe/semi-ui';
import MyHeader from './header';
const MyLayout = ({ children }) => {
  const { Header, Footer, Sider, Content } = Layout;
  return (
    <Layout className='components-layout-demo'>
      <Sider>Sider</Sider>
      <Layout>
        <MyHeader />
        <Content>{children}</Content>
        <Footer className='flex justify-center'>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
