import React, { useEffect } from 'react';
import { useState } from 'react';
import { api } from '@/utils/api';
import { IconLikeHeart, IconComment } from '@douyinfe/semi-icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import cx from 'classnames';

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
  const session = useSession();
  const { mutateAsync } = api.post.like.useMutation();
  const [curLiked, setCurLiked] = useState(liked);
  const isLoggedIn = session.status === 'authenticated';
  const [likeCntCopy, setLikeCntCopy] = useState(likesCount);

  useEffect(() => {
    if (likesCount !== likeCntCopy) setLikeCntCopy(likesCount);
  }, [likesCount]);

  const handleLike = () => {
    if (!isLoggedIn) return;

    mutateAsync({ postId, like: !curLiked })
      .then((res) => {
        setCurLiked(!curLiked);
        setLikeCntCopy(!curLiked ? likeCntCopy + 1 : likeCntCopy - 1);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className='flex items-center justify-start gap-x-4 pt-6'>
      <div className='flex items-center gap-x-1'>
        <IconLikeHeart
          onClick={handleLike}
          className={cx({
            'text-red-400': isLoggedIn && curLiked,
            'text-slate-500/50': !isLoggedIn || !curLiked,
            'cursor-not-allowed': !isLoggedIn,
            'cursor-pointer': isLoggedIn,
            'hover:text-red-400': isLoggedIn,
          })}
        />
        <span className='text-sm text-slate-400'>{likeCntCopy}</span>
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

export const MusicPostAction = ({
  musicId,
  liked,
  likesCount = 0,
  commentsCount = 0,
}: {
  musicId: string;
  liked: boolean;
  likesCount: number;
  commentsCount: number;
}) => {
  const session = useSession();
  const { mutateAsync } = api.music.like.useMutation();
  const [curLiked, setCurLiked] = useState(liked);
  const isLoggedIn = session.status === 'authenticated';
  const [likeCntCopy, setLikeCntCopy] = useState(likesCount);

  useEffect(() => {
    if (likesCount !== likeCntCopy) setLikeCntCopy(likesCount);
  }, [likesCount]);

  const handleLike = () => {
    if (!isLoggedIn) return;

    mutateAsync({ musicId, like: !curLiked })
      .then((res) => {
        setCurLiked(!curLiked);
        setLikeCntCopy(!curLiked ? likeCntCopy + 1 : likeCntCopy - 1);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className='flex items-center justify-start gap-x-4 pt-6'>
      <div className='flex items-center gap-x-1'>
        <IconLikeHeart
          onClick={handleLike}
          className={cx({
            'text-red-400': isLoggedIn && curLiked,
            'text-slate-500/50': !isLoggedIn || !curLiked,
            'cursor-not-allowed': !isLoggedIn,
            'cursor-pointer': isLoggedIn,
            'hover:text-red-400': isLoggedIn,
          })}
        />
        <span className='text-sm text-slate-400'>{likeCntCopy}</span>
      </div>

      <Link href={`/music/${encodeURIComponent(musicId)}`}>
        <div className='flex items-center gap-x-1'>
          <IconComment className='cursor-pointer text-slate-500/50 hover:text-sky-400' />
          <span className='text-sm text-slate-400'>{commentsCount}</span>
        </div>
      </Link>
    </div>
  );
};

export default PostAction;
