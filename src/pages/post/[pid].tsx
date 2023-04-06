import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import { ReactElement } from 'react';
import { api } from '@/utils/api';
import { Carousel } from '@douyinfe/semi-ui';
import Image from 'next/image';

const Post: NextPageWithLayout = () => {
  const router = useRouter();
  const { pid } = router.query;
  const post = api.post.findOne.useQuery({ id: pid as string });

  console.log(post.data);

  return (
    <div className='m-auto max-w-xl	'>
      <p>Post: {pid}</p>
      <Carousel
        style={{
          width: '300px',
          height: '160px',
          display: post.data?.images.length === 0 ? 'none' : 'block',
        }}
        theme='dark'
        autoPlay={false}
        showArrow={false}
      >
        {post.data?.images.map((image) => {
          return <Image alt='postimages' key={image.id} src={image.url} fill />;
        })}
      </Carousel>
      <div dangerouslySetInnerHTML={{ __html: post.data?.content || '' }} />
    </div>
  );
};

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Post;
