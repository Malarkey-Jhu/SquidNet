import ProtectedAdminLayout from '@/components/Layout/admin';
import { ReactElement, useEffect, useState } from 'react';
import { Table, Avatar, Button, Modal, Toast } from '@douyinfe/semi-ui';
import dayjs from 'dayjs';
import { api } from '@/utils/api';
import { IconDelete } from '@douyinfe/semi-icons';

const PAGE_SIZE = 4;

const Admin = () => {
  const [page, setPage] = useState(1);

  const {
    data: postData,
    isFetching,
    refetch,
  } = api.admin.findManyPosts.useQuery(
    { page, pageSize: PAGE_SIZE },
    { refetchOnWindowFocus: false },
  );

  const { mutateAsync } = api.admin.deletePost.useMutation();

  const deletePost = (postId: string) => {
    Modal.confirm({
      title: 'Delete this post',
      content: 'Are you are going to delete the post?',
      onOk: async () => {
        try {
          await mutateAsync({ postId });
          Toast.success('Deleted');
          refetch();
        } catch (e) {
          Toast.error('Something went wrong');
        } finally {
          return Promise.resolve();
        }
      },
      okText: 'OK',
      cancelText: 'Cancel',
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: 300,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      width: 150,
      render: (authorInfo, record, index) => {
        return (
          <div className='flex items-center justify-start gap-x-2'>
            <Avatar size='default' src={authorInfo.image || ''}>
              {authorInfo?.name?.charAt(0)}
            </Avatar>
            <span>{authorInfo.name}</span>
          </div>
        );
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: (a, b) => (a.createdAt - b.createdAt > 0 ? 1 : -1),
      render: (value) => {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operate',
      width: 100,
      render: (text, record) => (
        <Button icon={<IconDelete />} theme='borderless' onClick={() => deletePost(record.id)} />
      ),
    },
  ];

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='-mt-10	flex max-w-2xl flex-col items-center justify-center	text-white	'>
        <h1 className='text-lg text-white'>Admin</h1>
        <Table
          style={{ width: 800 }}
          columns={columns}
          dataSource={postData?.posts || []}
          pagination={{
            currentPage: page,
            pageSize: PAGE_SIZE,
            total: postData?.total || 0,
            onPageChange: (p) => setPage(p),
          }}
          loading={isFetching}
        />
      </div>
    </div>
  );
};

Admin.getLayout = function getLayout(page: ReactElement) {
  return <ProtectedAdminLayout>{page}</ProtectedAdminLayout>;
};

export default Admin;
