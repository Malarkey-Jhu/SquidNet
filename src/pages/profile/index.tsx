import React, { ReactElement, useEffect, useRef, useState } from 'react';
import ProtectedLayout from '@/components/Layout/protected';
import { Avatar, Button, Card, Form, Tabs, TabPane, Empty, Toast } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { api } from '@/utils/api';
import Icon, { IconMale, IconFemale, IconHelpCircle, IconCamera } from '@douyinfe/semi-icons';
import { useOSSClient } from '@/hooks/oss-client';
import { PostItem } from '.';
import dayjs from 'dayjs';
import MyEmpty from '@/components/Empty';
import { Like, Post } from '@prisma/client';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';
import { useSession } from 'next-auth/react';
import { useUser } from '@/components/User/UserProvider';
import GenderIcon from '@/components/Gender';

const PAGE_SIZE = 3;

const MyPostList = ({ userId }: { userId: string }) => {
  const curLastCursorId = useRef<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [cursorId, setCursorId] = useState<string | undefined>();
  const [curPosts, setCurPosts] = useState<PostItem[]>([]);

  const { data, isLoading, isFetching } = api.user.findPosts.useQuery(
    {
      userId,
      take: PAGE_SIZE,
      skip,
      cursor: cursorId,
    },
    { refetchOnWindowFocus: false },
  );

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
    <div className='flex w-full flex-col justify-center'>
      {curPosts.length > 0 ? (
        <div className='grid grid-cols-3 gap-4'>
          {curPosts.map((post, idx) => {
            return (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div className='relative'>
                  <Card
                    style={{ maxWidth: 300 }}
                    bodyStyle={{
                      padding: 10,
                    }}
                    cover={
                      <div className='relative'>
                        <Image
                          src={`/card-bg-${(idx % 3) + 1}.webp`}
                          width={298}
                          height={86}
                          alt='example'
                        />
                        <h3 className='text-md	 absolute	top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-extrabold text-white	drop-shadow'>
                          {post.title}
                          {post.id}
                        </h3>
                      </div>
                    }
                  >
                    {dayjs(post.createdAt).format('YYYY-MM-DD')}
                  </Card>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <MyEmpty title='No posts' desc='no posts yet' />
      )}

      {hasMore && (
        <Button
          loading={isLoading}
          className='w-full'
          style={{ margin: '20px 0' }}
          onClick={handleNextPage}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

type Posts = (Like & {
  post: Post | null;
})[];
const MyLikeList = ({ userId }: { userId: string }) => {
  const curLastCursorId = useRef<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [cursorId, setCursorId] = useState<string | undefined>();
  const [curPosts, setCurPosts] = useState<Posts>([]);

  const { data, isFetching, isLoading } = api.user.findLikes.useQuery(
    {
      userId,
      take: PAGE_SIZE,
      skip,
      cursor: cursorId,
    },
    { refetchOnWindowFocus: false },
  );

  const handleNextPage = () => {
    if (curPosts.length > 0 && curPosts[curPosts.length - 1]) {
      setSkip(1);
      setCursorId(curPosts[curPosts.length - 1].id);
    }
  };

  useEffect(() => {
    const posts = data?.likes || [];
    const dataLastCursorId = posts[posts.length - 1]?.id || '';
    if (!isFetching && dataLastCursorId && dataLastCursorId !== curLastCursorId.current) {
      setCurPosts((p) => [...p, ...posts]);
      setHasMore(data?.hasMore || false);
      curLastCursorId.current = dataLastCursorId;
    }
  }, [isFetching]);

  return (
    <div className='flex w-full flex-col  justify-center'>
      {curPosts.length > 0 ? (
        <div className='grid grid-cols-3 gap-4'>
          {curPosts.map((post, idx) => {
            return (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div className='relative'>
                  <Card
                    style={{ maxWidth: 300 }}
                    bodyStyle={{
                      padding: 10,
                    }}
                    cover={
                      <div className='relative'>
                        <Image
                          src={`/card-bg-${(idx % 3) + 1}.webp`}
                          width={298}
                          height={86}
                          alt='example'
                        />
                        <h3 className='absolute	 top-1/2	left-1/2 -translate-y-1/2 -translate-x-1/2 text-xl font-extrabold text-white	drop-shadow'>
                          {post.post?.title}
                        </h3>
                      </div>
                    }
                  ></Card>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <MyEmpty title='No likes' desc='no likes yet' />
      )}

      {hasMore && (
        <Button
          loading={isLoading}
          className='w-full'
          style={{ margin: '20px 0' }}
          onClick={handleNextPage}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

const Profile = () => {
  const formRef = useRef<Form<any>>(null);
  const { data } = useSession();
  const id = data?.user.id;
  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadFieldRef = useRef('image');
  const [isEditing, setIsEditing] = useState(false);

  const { user, refetch, isLoading } = useUser();

  const { mutateAsync } = api.user.update.useMutation();

  const OSSClient = useOSSClient();

  const handleUpload = async () => {
    try {
      const data = uploadRef.current?.files?.[0];
      if (!OSSClient || !data) {
        return;
      }
      const folder = dayjs().format('YYYY-MM-DD');
      const result = await OSSClient.put(`images/${folder}/${data?.name}`, data);
      const field = uploadFieldRef.current || 'image';
      await mutateAsync({
        [field]: result.url,
      });
      await refetch();
      Toast.success('Updated');
    } catch (e) {
      Toast.error('Upload failed');
    }
  };

  const handleSave = () => {
    const formVals = formRef.current?.formApi.getValues();
    mutateAsync(formVals)
      .then((res) => {
        Toast.success('profile updated');
        setIsEditing(false);
        refetch();
      })
      .catch((err) => Toast.error('error'));
  };

  if (!id) {
    return (
      <div>
        <Link href='/login'>
          <div>Please Login</div>
        </Link>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen	justify-center bg-[url("/bg.webp")] text-white'>
      {isLoading ? (
        <>Loading</>
      ) : (
        <div className='relative max-w-5xl overflow-hidden '>
          <input hidden ref={uploadRef} id='file' type='file' onChange={handleUpload} />
          <div className='relative'>
            <div
              style={{
                backgroundImage: `url(${user?.banner || '/banner-default.jpeg'})`,
              }}
              className={`group flex h-[300px] w-full cursor-pointer items-center justify-center bg-cover`}
            >
              <div
                className='flex hidden h-full w-full items-center justify-center bg-gray-300/10 group-hover:flex'
                onClick={() => {
                  uploadFieldRef.current = 'banner';
                  uploadRef.current?.click();
                }}
              >
                <IconCamera />
              </div>
            </div>
          </div>

          <div className='relative z-10 mt-[-20px] flex w-full items-center justify-between px-5'>
            <div className='flex gap-x-2'>
              <Avatar
                size='extra-large'
                src={user?.image || ''}
                alt='avatar'
                hoverMask={
                  <div
                    className='bg-red flex h-full w-full items-center justify-center bg-gray-300/10'
                    onClick={() => {
                      uploadFieldRef.current = 'image';
                      uploadRef.current?.click();
                    }}
                  >
                    <IconCamera />
                  </div>
                }
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </div>

            <div className='mt-[80px] flex gap-x-1'>
              {/* <button className='rounded-full bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>
                Message
              </button> */}
              {id === user?.id ? (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className='rounded-full bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className='rounded-full bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing((v) => !v)}
                      className='rounded-full bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                    >
                      Edit
                    </button>
                  )}
                </>
              ) : (
                <button className='rounded-full bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>
                  Follow
                </button>
              )}
            </div>
          </div>

          <div className='mt-4 px-6'>
            {isEditing ? (
              <ProfileForm ref={formRef} user={user} />
            ) : (
              <>
                <h3 className='text-3xl	font-semibold	'>@{user?.name}</h3>
                <div className='my-2 py-4'>
                  {user?.country && <div>Country: {user?.country}</div>}
                  {user?.showNsCode && user?.nscode && <div>Switch Code: {user?.nscode}</div>}
                  {user?.gender > 0 && (
                    <div className='flex items-center gap-x-2'>
                      <span>Gender:</span> <GenderIcon gender={user?.gender as number} />{' '}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className='mt-4 px-6'>
            <Tabs type='line'>
              <TabPane tab='Posts' itemKey='1' className='py-3'>
                <MyPostList userId={id as string} />
              </TabPane>
              <TabPane tab='Likes' itemKey='2' className='py-3'>
                <MyLikeList userId={id as string} />
              </TabPane>
              <TabPane tab='Follows (Under Development)' itemKey='3' className='py-3'>
                <MyEmpty desc='This person has no follows' title='No follows' />
              </TabPane>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <ProtectedLayout>{page}</ProtectedLayout>;
};

export default Profile;
