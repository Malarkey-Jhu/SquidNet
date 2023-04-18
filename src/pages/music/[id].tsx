import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { type ReactElement } from 'react';

const MusicDetail = () => {
  const router = useRouter();
  const { id: videoId } = router.query;

  if (videoId === undefined) {
    return <div>Please provide videoId</div>;
  }

  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <iframe
        width='560'
        height='315'
        src={`https://www.youtube.com/embed/${videoId}`}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      ></iframe>
    </div>
  );
};

MusicDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MusicDetail;
