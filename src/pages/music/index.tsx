import MyEmpty from '@/components/Empty';
import Layout from '@/components/Layout';
import { api } from '@/utils/api';
import { Button, List, Pagination } from '@douyinfe/semi-ui';
import { type youtube_v3 } from 'googleapis';
import Link from 'next/link';
import { type ReactElement, useState } from 'react';

const Music = () => {
  const [pageToken, setPageToken] = useState('');

  const { data, refetch } = api.music.findAll.useQuery(
    { pageToken },
    {
      refetchOnWindowFocus: false,
    },
  );

  const ytMusicData = data as youtube_v3.Schema$PlaylistItemListResponse;

  const loadMore = (
    <div className='flex w-full items-center justify-center gap-x-4 py-4'>
      {ytMusicData?.nextPageToken && (
        <Button
          onClick={() => {
            window.scrollTo(0, 0);
            setPageToken(ytMusicData?.nextPageToken);
          }}
        >
          Next Page
        </Button>
      )}
      {ytMusicData?.prevPageToken && (
        <Button
          onClick={() => {
            window.scrollTo(0, 0);
            setPageToken(ytMusicData?.prevPageToken);
          }}
        >
          Pre Page
        </Button>
      )}
    </div>
  );

  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <div className='container flex flex-col items-center justify-center px-4 py-14 '>
        <h1 className='text-3xl font-semibold text-white'> Jukebox Music </h1>
        <List
          loadMore={loadMore}
          dataSource={ytMusicData?.items || []}
          emptyContent={<MyEmpty className='mt-8' title='Nothing here' desc='no results found' />}
          renderItem={(music) => (
            <List.Item
              key={music.id}
              main={
                <Link href={`/music/${music.snippet?.resourceId?.videoId}`}>
                  <img
                    src={music.snippet?.thumbnails?.default?.url}
                    width={music.snippet?.thumbnails?.default?.width}
                    height={music.snippet?.thumbnails?.default?.height}
                  />
                  <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>
                    {music.snippet?.title}
                  </span>
                </Link>
              }
            />
          )}
        />
      </div>
    </main>
  );
};

Music.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Music;
