import { useEffect, useState, useRef } from 'react';
import { Card, Carousel, Button, Divider, Avatar } from '@douyinfe/semi-ui';
import Tiptap from '@/components/TipTap';
import Layout from '@/components/Layout';
import type { ReactElement } from 'react';
import { IconLikeHeart, IconComment } from '@douyinfe/semi-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';

import { api } from '@/utils/api';
import { NextPageWithLayout } from './_app';
import cx from 'classnames';
import { Post, PostImage } from '@prisma/client';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

const PostAction = ({
  postId,
  liked,
  likesCount = 0,
  commentsCount = 0,
}: {
  postId: string;
  liked: boolean;
  likesCount: number;
  commentsCount: number;
}) => {
  const { mutateAsync } = api.post.like.useMutation();
  const [curLiked, setCurLiked] = useState(liked);
  const handleLike = () => {
    mutateAsync({ postId, like: !curLiked })
      .then((res) => {
        setCurLiked(!curLiked);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className='flex items-center justify-start gap-x-4 pt-6'>
      <div className='flex items-center gap-x-1'>
        <IconLikeHeart
          onClick={handleLike}
          className={cx('cursor-pointer  hover:text-red-400', {
            'text-red-400': curLiked,
            'text-slate-500/50': !curLiked,
          })}
        />
        <span className='text-sm text-slate-400'>{likesCount}</span>
      </div>

      <Link href={`/post/${encodeURIComponent(postId)}`}>
        <div className='flex items-center gap-x-1'>
          <IconComment className='cursor-pointer text-slate-500/50 hover:text-sky-400' />
          <span className='text-sm text-slate-400'>{commentsCount}</span>
        </div>
      </Link>
    </div>
  );
};

export type PostItem = Post & {
  author: {
    id: string;
    image?: string;
    name: string;
  };
  likes: {
    id: string;
  }[];
  _count: {
    likes: number;
    comments: number;
  };
  images: PostImage[];
};

const PAGE_SIZE = 2;
const Home: NextPageWithLayout = () => {
  const curLastCursorId = useRef<string | undefined>();
  const session = useSession();
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [cursorId, setCursorId] = useState<string | undefined>();

  const { data, isFetching } = api.post.findMany.useQuery(
    { take: PAGE_SIZE, skip, cursor: cursorId },
    { refetchOnWindowFocus: false },
  );
  const [curPosts, setCurPosts] = useState<PostItem[]>([]);

  const onPublish = () => {};

  const handleNextPage = () => {
    if (curPosts.length > 0 && curPosts[curPosts.length - 1]) {
      setSkip(1);
      setCursorId(curPosts[curPosts.length - 1].id);
    }
  };

  useEffect(() => {
    const posts = data?.posts || [];
    const dataLastCursorId = posts[posts.length - 1]?.id || '';
    if (posts && !isFetching && dataLastCursorId && dataLastCursorId !== curLastCursorId.current) {
      setCurPosts((p) => [...p, ...posts]);
      setHasMore(data?.hasMore || false);
      curLastCursorId.current = dataLastCursorId;
    }
  }, [isFetching]);

  return (
    <>
      <main
        className='flex min-h-screen flex-col items-center justify-center
       bg-[url("/bg.webp")]
      '
      >
        <div className='container flex flex-col items-center justify-center px-4 py-14 '>
          {session.data && <Tiptap onPublish={onPublish} />}

          <div className='mt-8 flex flex-col items-center gap-2'>
            <InfiniteScroll
              dataLength={curPosts.length}
              next={handleNextPage}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p className='p-3	text-center font-semibold text-white'>Yay! You have seen it all</p>
              }
            >
              {curPosts.map((post) => {
                return (
                  <div className='group mb-6 w-[550px] rounded-lg bg-white p-8' key={post.id}>
                    <div className='flex items-center justify-between '>
                      <div className='flex items-center gap-x-4 '>
                        <Link href={`/profile/${encodeURIComponent(post.authorId)}`}>
                          {post.author.image ? (
                            <Avatar alt='avatar' src={post.author.image} />
                          ) : (
                            <Avatar alt='avatar'>{post.author.name[0]}</Avatar>
                          )}
                        </Link>
                        <div>
                          <div className='text-base	font-medium	'>{post.author.name}</div>
                          <div className='text-sm text-slate-500'>
                            {dayjs(post.createdAt).fromNow()}
                          </div>
                        </div>
                      </div>
                      <Link href={`/post/${encodeURIComponent(post.id)}`}>
                        <div className='h-[44px] w-[40px] bg-[url("/icon_arrow_1.png")] bg-cover group-hover:bg-[url("/icon_arrow_2.png")]' />
                      </Link>
                    </div>

                    <h3 className='mt-4 mb-2 text-xl font-medium'> {post.title}</h3>

                    <p className='py-4'>{post.content}</p>

                    <Carousel
                      style={{
                        width: '100%',
                        height: '240px',
                        display: post.images.length === 0 ? 'none' : 'block',
                      }}
                      theme='dark'
                      autoPlay={false}
                      showArrow={false}
                    >
                      {post.images.map((image) => {
                        return <Image alt='postimages' key={image.id} src={image.url} fill />;
                      })}
                    </Carousel>
                    <PostAction
                      likesCount={post._count.likes}
                      commentsCount={post._count.comments}
                      postId={post.id}
                      liked={post.likes.length > 0}
                    />
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
