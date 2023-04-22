import React from 'react';
import Layout from '@/components/Layout';
import { type NextPageWithLayout } from '../_app';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import { api } from '@/utils/api';
import { Carousel, Divider } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { MusicPostAction } from '@/components/PostAction';
import Image from 'next/image';
import { events } from '@/helpers/event-emitter';

import { List, Button, Avatar, Toast, TextArea } from '@douyinfe/semi-ui';
import { type User, type Comment, PostImage } from '@prisma/client';
import { useSession } from 'next-auth/react';
import MyEmpty from '@/components/Empty';
import dayjs from 'dayjs';

const COMMENT_CREATED = 'COMMENT_CREATED';
const COMMENT_NUM = 'COMMENT_NUM';
type CommmentItem = Comment & { user: User };

const PAGE_SIZE = 3;

const CommentList = ({ musicId }: { musicId: string }) => {
  const curPostIdRef = useRef(musicId);
  const preSkipRef = useRef(-1);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [curComments, setCurComments] = useState<CommmentItem[]>([]);
  const [totalComments, setTotalComments] = useState(0);

  const { data, isLoading, refetch, isSuccess } = api.comment.findMusic.useQuery(
    { musicId, skip, take: PAGE_SIZE },
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (curPostIdRef.current !== musicId) {
      setCurComments([]);
      setTotalComments(0);
      setSkip(0);
      curPostIdRef.current = musicId;
      preSkipRef.current = -1;
      refetch();
    }
    if (curPostIdRef.current === musicId && isSuccess && skip !== preSkipRef.current) {
      setCurComments((p) => [...p, ...data.comments]);
      preSkipRef.current = skip;
      setHasMore(data.hasMore);
      setTotalComments(data.total);
    }
  }, [isSuccess, skip, musicId]);

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
          header={
            <div className='flex w-[80px] flex-col items-center justify-center gap-2 md:w-[150px] md:flex-row'>
              {item.user.image ? (
                <Avatar size='medium' alt='avatar' src={item.user?.image} />
              ) : (
                <Avatar size='medium' alt='avatar'>
                  {item.user.name?.[0]}
                </Avatar>
              )}
              <div className='text-center md:text-start'>
                <div className='text-sm	text-white'>{item.user.name}</div>
                <div className='hidden text-xs text-slate-300 md:block'>
                  {dayjs(item?.createdAt).fromNow()}
                </div>
              </div>
            </div>
          }
          main={<p className='break-all text-slate-100'>{item.content}</p>}
        />
      )}
    />
  );
};

const LeaveComment = ({
  musicId,
  liked,
  likesCount,
}: {
  musicId: string;
  liked: boolean;
  likesCount: number;
}) => {
  const [numOfComments, setNumOfComments] = useState(0);
  const [comment, setComment] = useState('');
  const { mutateAsync } = api.comment.createMusic.useMutation();
  const sessionData = useSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutateAsync({ musicId, content: comment })
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
    <section className='bg-transparent'>
      <div className='mx-auto max-w-2xl'>
        <div className='mb-6 flex items-center justify-between'>
          <MusicPostAction
            musicId={musicId}
            commentsCount={numOfComments}
            liked={liked}
            likesCount={likesCount}
          />
        </div>
        <form className='mb-6' onSubmit={handleSubmit}>
          <div className='mb-4 rounded-lg rounded-t-lg '>
            <label htmlFor='comment' className='sr-only'>
              Your comment
            </label>
            <TextArea
              onChange={(e) => setComment(e)}
              autosize
              rows={3}
              placeholder='Write a comment...'
              required
              maxLength={190}
            ></TextArea>
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

const MusicDetail = () => {
  const router = useRouter();
  const { id: musicId } = router.query;
  const session = useSession();

  const { data } = api.music.findLikes.useQuery({ musicId: musicId as string });

  console.log(data, 'data====');

  if (musicId === undefined) {
    return <div>Please provide musicId</div>;
  }

  return (
    <div className='m-auto max-w-xl	p-10'>
      <iframe
        width='560'
        height='315'
        src={`https://www.youtube.com/embed/${musicId}`}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      ></iframe>

      {musicId && typeof musicId === 'string' && session.status === 'authenticated' && (
        <LeaveComment
          musicId={musicId}
          liked={data?.liked || false}
          likesCount={data?.total || 0}
        />
      )}
      <Divider />

      {musicId && typeof musicId === 'string' && (
        <div className='mt-5'>
          <CommentList musicId={musicId || ''} />
        </div>
      )}
    </div>
  );
};

MusicDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MusicDetail;
