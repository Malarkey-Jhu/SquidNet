import React, { ReactNode } from 'react';
import { Layout, Empty } from '@douyinfe/semi-ui';
import MyHeader from './header';
import { IllustrationNoAccessDark, IllustrationNoAccess } from '@douyinfe/semi-illustrations';
import { useSession } from 'next-auth/react';
import { useUser } from '../User/UserProvider';

const ProtectedAdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const session = useSession();
  const { user, isLoading } = useUser();
  const { Content } = Layout;
  const renderContent = () => {
    if (isLoading) {
      return null;
    }
    if (session.data?.user && user?.roleId === 1) {
      return children;
    } else {
      return (
        <div className='flex h-full w-full items-center justify-center text-4xl font-bold text-white'>
          <Empty
            image={<IllustrationNoAccess style={{ width: 250, height: 250 }} />}
            darkModeImage={<IllustrationNoAccessDark style={{ width: 250, height: 250 }} />}
            description={'Unauthorized'}
            style={{ padding: 30 }}
          />
        </div>
      );
    }
  };
  return (
    <Layout className='semi-always-dark'>
      <Layout className='relative	h-screen bg-[url("/bg.webp")] bg-cover'>
        <MyHeader />
        <Content className='mt-16'>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default ProtectedAdminLayout;
