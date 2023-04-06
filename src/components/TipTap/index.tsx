'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Toast, Input, Divider, Carousel } from '@douyinfe/semi-ui';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import { IconImage, IconClose } from '@douyinfe/semi-icons';
import { useOSSClient } from '@/hooks/oss-client';
import dayjs from 'dayjs';
import cx from 'classnames';

import { api } from '@/utils/api';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

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

  const handleEmojiClick = (emoji: any) => {
    editor?.chain().focus().insertContent(emoji.native).run();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('#toggle-emoji-btn')) {
      return;
    }
    if (showEmoji) {
      setShowEmoji(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((imgs) => imgs.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Input
        placeholder='Please input title'
        value={title}
        onChange={(e) => setTitle(e)}
        style={{
          background: '#fff',
          border: 'none',
        }}
      />
      <Divider />
      <EditorContent editor={editor} />

      <div className='flex max-w-lg snap-x overflow-x-scroll'>
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
      {/* <Carousel
        className={cx('w-100 h-52', {
          hidden: images.length === 0,
        })}
        theme='primary'
        autoPlay={false}
      >
        {images.map((src, index) => {
          return (
            <div key={src}>
              <div style={{ backgroundSize: 'cover', backgroundImage: `url(${src})` }} />
              <IconClose style={{ cursor: 'pointer' }} onClick={() => handleDeleteImage(index)} />
            </div>
          );
        })}
      </Carousel> */}
      <Divider />
      <div className='flex justify-center'>
        <div>
          <input hidden ref={uploadRef} id='file' type='file' onChange={handleUpload} />
          <Button icon={<IconImage />} onClick={() => uploadRef.current?.click()} />
        </div>
        <Button id='toggle-emoji-btn' onClick={() => setShowEmoji((v) => !v)}>
          😀
        </Button>
        <Button onClick={handlePublish}>Publish</Button>
      </div>
      <div>
        {showEmoji && (
          <Picker
            data={data}
            onEmojiSelect={handleEmojiClick}
            onClickOutside={handleClickOutside}
          />
        )}
      </div>
    </div>
  );
};

export default Tiptap;
