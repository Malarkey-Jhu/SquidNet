'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Toast, Input, Carousel, Divider } from '@douyinfe/semi-ui';
import { IconImage } from '@douyinfe/semi-icons';
import { useOSSClient } from '@/hooks/oss-client';
import { TextArea } from '@douyinfe/semi-ui';
import cx from 'classnames';
import dayjs from 'dayjs';

import { api } from '@/utils/api';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const fakeImg = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-1.png';
// const imgList = [
//   'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-1.png',
//   'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-2.png',
//   'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-3.png',
// ];

const MyEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const uploadRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const OSSClient = useOSSClient();
  const { mutateAsync } = api.post.create.useMutation();

  const handleUpload = async (e) => {
    // const data = uploadRef.current?.files?.[0];
    // if (!OSSClient || !data) {
    //   return;
    // }
    // const folder = dayjs().format('YYYY-MM-DD');
    // const result = await OSSClient.put(`images/${folder}/${data?.name}`, data);
    // result.url
    setImages((imgs) => [...imgs, fakeImg]);
  };

  const handlePublish = () => {
    if (title.length === 0 || editor?.getHTML().length === 0) {
      Toast.error('Please input title and content');
      return;
    }

    console.log(editor?.getHTML(), 'editor?.getHTML()');

    mutateAsync({
      title,
      content: editor?.getHTML() as string,
    })
      .then(() => {
        Toast.success('Publish success');
      })
      .catch((e) => {
        console.error(e);
        Toast.error('Publish failed');
      });
  };

  const handleEmojiClick = (emoji: any) => {
    setContent((c) => c + emoji.native);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('#toggle-emoji-btn')) {
      return;
    }
    if (showEmoji) {
      setShowEmoji(false);
    }
  };

  return (
    <div>
      <Input
        placeholder='Please input title'
        value={title}
        onChange={(e) => setTitle(e)}
        style={{ background: '#fff', border: 'none' }}
      />
      <Divider />
      <TextArea
        style={{ background: '#fff', border: 'none' }}
        value={content}
        placeholder='Please input content'
        autosize
        rows={3}
        onChange={(e) => setContent(e)}
      />

      <Carousel
        className={cx('w-100 h-52', {
          hidden: images.length === 0,
        })}
        theme='primary'
        autoPlay={false}
      >
        {images.map((src, index) => {
          return (
            <div key={index} style={{ backgroundSize: 'cover', backgroundImage: `url(${src})` }} />
          );
        })}
      </Carousel>
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

export default MyEditor;
