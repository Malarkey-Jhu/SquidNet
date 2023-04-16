import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { api } from '@/utils/api';
import { Carousel } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';

import Image from 'next/image';
import { events } from '@/helpers/event-emitter';

import { List, Skeleton, Button, Avatar, Toast } from '@douyinfe/semi-ui';
import React from 'react';
import { User, Comment, PostImage, Post } from '@prisma/client';
import { useSession } from 'next-auth/react';
import MyEmpty from '@/components/Empty';

const COMMENT_CREATED = 'COMMENT_CREATED';
const COMMENT_NUM = 'COMMENT_NUM';
type CommmentItem = Comment & { user: User };

const PAGE_SIZE = 3;

const CommentList = ({ postId }: { postId: string }) => {
  const curPostIdRef = useRef(postId);
  const preSkipRef = useRef(-1);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [curComments, setCurComments] = useState<CommmentItem[]>([]);
  const [totalComments, setTotalComments] = useState(0);

  const { data, isLoading, refetch, isSuccess } = api.comment.findMany.useQuery(
    { postId, skip, take: PAGE_SIZE },
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (curPostIdRef.current !== postId) {
      setCurComments([]);
      setTotalComments(0);
      setSkip(0);
      curPostIdRef.current = postId;
      preSkipRef.current = -1;
      refetch();
    }
    if (curPostIdRef.current === postId && isSuccess && skip !== preSkipRef.current) {
      setCurComments((p) => [...p, ...data.comments]);
      preSkipRef.current = skip;
      setHasMore(data.hasMore);
      setTotalComments(data.total);
    }
  }, [isSuccess, skip, postId]);

  useEffect(() => {
    events.emit(COMMENT_NUM, totalComments);
  }, [totalComments]);

  useEffect(() => {
    const commentCreatedHandler = (res: CommmentItem) => {
      setCurComments((p) => [res, ...p]);
      setTotalComments((p) => p + 1);
    };

    events.on(COMMENT_CREATED, commentCreatedHandler);
    return () => {
      events.off(COMMENT_CREATED, commentCreatedHandler);
    };
  }, []);

  const loadMore =
    !isLoading && hasMore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={() => setSkip(curComments.length)}>显示更多</Button>
      </div>
    ) : null;
  return (
    <List
      loading={false}
      loadMore={loadMore}
      dataSource={curComments}
      emptyContent={<MyEmpty title='No comments' desc='Feel free to leave your comments' />}
      renderItem={(item: CommmentItem) => (
        <List.Item
          key={item.id}
          header={<Avatar>{item.user.name}</Avatar>}
          main={
            <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>{item.content}</p>
          }
        />
      )}
    />
  );
};

const LeaveComment = ({ postId }: { postId: string }) => {
  const [numOfComments, setNumOfComments] = useState(0);
  const [comment, setComment] = useState('');
  const { mutateAsync } = api.comment.create.useMutation();
  const sessionData = useSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutateAsync({ postId, content: comment })
      .then((res) => {
        Toast.success('Comment created successfully');
        events.emit(COMMENT_CREATED, { ...res, user: sessionData.data?.user });
      })
      .catch((err) => Toast.error(err.message));
  };

  useEffect(() => {
    const changeNumOfComments = (num: number) => {
      setNumOfComments(num);
    };
    events.on(COMMENT_NUM, changeNumOfComments);

    return () => {
      events.off(COMMENT_NUM, changeNumOfComments);
    };
  }, []);

  return (
    <section className='bg-white py-4 dark:bg-gray-900'>
      <div className='mx-auto max-w-2xl px-4'>
        <div className='mb-6 flex items-center justify-between'>
          <h3 className='text-md font-bold text-gray-900 dark:text-white'>
            Discussion ({numOfComments})
          </h3>
        </div>
        <form className='mb-6' onSubmit={handleSubmit}>
          <div className='mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white py-2 px-4 dark:border-gray-700 dark:bg-gray-800'>
            <label htmlFor='comment' className='sr-only'>
              Your comment
            </label>
            <textarea
              onChange={(e) => setComment(e.target.value)}
              id='comment'
              rows={6}
              className='w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400'
              placeholder='Write a comment...'
              required
            ></textarea>
          </div>
          <button
            type='submit'
            className='inline-flex items-center rounded-lg bg-primary-700 py-2.5 px-4 text-center text-xs font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900'
          >
            Post comment
          </button>
        </form>
      </div>
    </section>
  );
};

type PostItem = Post & {
  likes: {
    id: string;
  }[];
  _count: {
    likes: number;
  };
  images: PostImage[];
};

const Post: NextPageWithLayout = () => {
  const router = useRouter();
  const { pid } = router.query;
  const post = pid
    ? api.post.findOne.useQuery({ id: pid as string }, { refetchOnWindowFocus: false })
    : ({ data: {} } as { data: PostItem });

  const { Title, Paragraph } = Typography;

  return (
    <main
      className='min-h-screen pt-10
  '
    >
      <div className='m-auto max-w-xl	pb-10'>
        <Carousel
          style={{
            width: '100%',
            height: '300px',
            display: post?.data?.images?.length === 0 ? 'none' : 'block',
          }}
          theme='dark'
          autoPlay={false}
          showArrow={false}
        >
          {post?.data?.images?.map((image) => {
            return <Image alt='postimages' key={image.id} src={image.url} fill />;
          })}
        </Carousel>
        <Title heading={2} style={{ margin: '20px 0' }}>
          {post?.data?.title}
        </Title>

        <Paragraph spacing='extended' style={{ margin: '20px 0' }}>
          {post?.data?.content}
        </Paragraph>

        {pid && typeof pid === 'string' && <LeaveComment postId={pid} />}
        {pid && typeof pid === 'string' && <CommentList postId={pid || ''} />}
      </div>
    </main>
  );
};

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Post;
