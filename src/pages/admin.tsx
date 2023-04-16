import ProtectedAdminLayout from '@/components/Layout/admin';
import { ReactElement, useEffect, useState } from 'react';
import { Table, Avatar, Button, Modal, Toast } from '@douyinfe/semi-ui';
import dayjs from 'dayjs';
import { api } from '@/utils/api';
import { IconDelete, IconClose, IconTick } from '@douyinfe/semi-icons';
import Link from 'next/link';

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

  const deletePost = (postId: string, isDeleted: boolean) => {
    Modal.confirm({
      title: `${isDeleted ? 'Delete' : 'UnDelete'} this post`,
      content: `Are you are going to ${isDeleted ? 'delete' : 'undelete'} the post?`,
      onOk: async () => {
        try {
          await mutateAsync({ postId, isDeleted });
          Toast.success('Success');
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
      render: (value, record) => {
        return (
          <Link target='_blank' href={`/post/${record.id}`}>
            {value}
          </Link>
        );
      },
    },
    {
      title: 'Author',
      dataIndex: 'author',
      width: 150,
      render: (authorInfo, record, index) => {
        return (
          <Link target='_blank' href={`/profile/${authorInfo.id}`}>
            <div className='flex items-center justify-start gap-x-2'>
              <Avatar size='default' src={authorInfo.image || ''}>
                {authorInfo?.name?.charAt(0)}
              </Avatar>
              <span>{authorInfo.name}</span>
            </div>
          </Link>
        );
      },
    },
    {
      title: 'Published',
      dataIndex: 'published',
      render: (published) => {
        return (
          <>
            {published ? (
              <IconTick style={{ color: 'lightgreen' }} />
            ) : (
              <IconClose style={{ color: 'red' }} />
            )}
          </>
        );
      },
    },
    {
      title: 'Deleted',
      dataIndex: 'isDeleted',
      render: (isDeleted) => {
        return <>{isDeleted ? <IconTick style={{ color: 'red' }} /> : '-'}</>;
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
        <>
          {!record.isDeleted ? (
            <Button theme='borderless' onClick={() => deletePost(record.id, true)}>
              Delete
            </Button>
          ) : (
            <Button theme='borderless' onClick={() => deletePost(record.id, false)}>
              UnDelete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='-mt-10	flex max-w-2xl flex-col items-center justify-center	gap-4	text-white'>
        <h1 className='text-3xl text-white'>All Posts</h1>
        <Table
          style={{ width: 800 }}
          columns={columns}
          dataSource={postData?.posts || []}
          pagination={{
            currentPage: page,
            pageSize: PAGE_SIZE,
            total: postData?.total || 0,
            onPageChange: (p) => setPage(p),
            showTotal: false,
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
