'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Toast, Input, Divider, Avatar } from '@douyinfe/semi-ui';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import { IconImage, IconClose, IconEmoji } from '@douyinfe/semi-icons';
import { useOSSClient } from '@/hooks/oss-client';
import dayjs from 'dayjs';
import MyAvatar from '@/components/Avatar';
import cx from 'classnames';

import { api } from '@/utils/api';
import dynamic from 'next/dynamic';
import { EmojiClickData, Theme } from 'emoji-picker-react';

const Picker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false },
);

const Tiptap = ({ onPublish }: { onPublish: () => void }) => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const uploadRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Write something about Splatoon…',
      }),
    ],
    content: '',
  });

  const OSSClient = useOSSClient();
  const { mutateAsync } = api.post.create.useMutation();

  const handleUpload = async (e) => {
    const data = uploadRef.current?.files?.[0];
    if (!OSSClient || !data) {
      return;
    }
    const folder = dayjs().format('YYYY-MM-DD');
    const result = await OSSClient.put(`images/${folder}/${data?.name}`, data);
    setImages((imgs) => [...imgs, result.url]);
  };

  const clearContent = () => {
    editor?.chain().setContent('').run();
    setImages([]);
    setTitle('');
  };

  const handlePublish = () => {
    if (title.length === 0 || editor?.getText().length === 0) {
      Toast.error('Please input title and content');
      return;
    }

    mutateAsync({
      title,
      content: editor?.getText() as string,
      images,
    })
      .then(() => {
        clearContent();
        onPublish();
        Toast.success('Publish success');
      })
      .catch((e) => {
        console.error(e);
        Toast.error('Publish failed');
      });
  };

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (e.target instanceof HTMLElement && e.target.closest('.EmojiPickerReact')) ||
        e.target.closest('#toggle-emoji-btn')
      ) {
        return;
      }
      setShowEmoji(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDeleteImage = (index: number) => {
    setImages((imgs) => imgs.filter((_, i) => i !== index));
  };

  return (
    <div className='relative w-full rounded-lg bg-white	px-8 py-8 pl-6 pb-4 md:w-[600px]'>
      <div className='flex gap-x-3'>
        <MyAvatar />
        <div className='flex-1'>
          <input
            placeholder='Please input title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              border: 'none',
              padding: '12px 20px',
              borderRadius: 20,
              backgroundColor: '#f8f8f8',
              fontSize: 14,
              outline: 'none',
              width: '100%',
              marginBottom: 8,
            }}
          />
          <EditorContent editor={editor} />
          <div className='mt-8 flex max-w-lg snap-x overflow-x-scroll'>
            {images.map((src, index) => {
              return (
                <div key={src} className='relative snap-start scroll-ml-10'>
                  <div
                    className='h-40 w-60'
                    style={{ backgroundSize: 'cover', backgroundImage: `url(${src})` }}
                  />
                  <IconClose
                    style={{ cursor: 'pointer', position: 'absolute', right: 0, top: 0 }}
                    onClick={() => handleDeleteImage(index)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Divider style={{ margin: '26px 0 14px 0' }} />

      <div className='flex items-center justify-start'>
        <div className='flex flex-1 items-center justify-start'>
          <input hidden ref={uploadRef} id='file' type='file' onChange={handleUpload} />
          <Button
            icon={<IconImage style={{ color: '#673ab7' }} />}
            iconStyle={{ color: 'green' }}
            style={{ background: 'white', color: 'black', fontWeight: '400' }}
            onClick={() => uploadRef.current?.click()}
          >
            Image
          </Button>

          <Button
            icon={<IconEmoji style={{ color: 'rgb(244 63 94)' }} />}
            style={{ background: 'white', color: 'black', fontWeight: '400' }}
            id='toggle-emoji-btn'
            onClick={() => setShowEmoji((v) => !v)}
          >
            Emoji
          </Button>
        </div>

        <button
          className='rounded-full bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
          onClick={handlePublish}
        >
          Publish
        </button>
      </div>
      <div
        className={cx('absolute z-10', {
          invisible: !showEmoji,
        })}
      >
        <Picker searchDisabled theme={Theme.DARK} onEmojiClick={handleEmojiClick} />
      </div>
    </div>
  );
};

export default Tiptap;
