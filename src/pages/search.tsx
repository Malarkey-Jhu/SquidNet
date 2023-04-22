import Layout from '@/components/Layout';
import { type ReactElement } from 'react';
import {
  Input,
  Modal,
  InputGroup,
  Select,
  Spin,
  List,
  Pagination,
  Button,
} from '@douyinfe/semi-ui';

import { IconSearch } from '@douyinfe/semi-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import MyEmpty from '@/components/Empty';
import { api } from '@/utils/api';
import { debounce } from 'throttle-debounce';
import dayjs from 'dayjs';
import { type Post, type User } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

const PAGE_SIZE = 6;
const DEFAULT_PAGE = 1;

enum SEARCH_TYPE {
  POST = 'POST',
  PLAYER = 'PLAYER',
  MUSIC = 'MUSIC',
}

const Search = () => {
  const router = useRouter();
  const [inputTxt, setInputTxt] = useState((router.query.q as string) || '');
  const [searchText, setSearchText] = useState((router.query.q as string) || '');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageToken, setPageToken] = useState<undefined | string>();
  const [searchType, setSearchType] = useState<SEARCH_TYPE>(
    (router.query.type as SEARCH_TYPE) || SEARCH_TYPE.POST,
  );

  const {
    data: userData,
    isFetching: isUserFetching,
    status: userAPIStatus,
    refetch: refetchUser,
  } = api.search.findUsers.useQuery(
    { text: searchText, pageSize: PAGE_SIZE, page },
    { enabled: false, refetchOnWindowFocus: false },
  );

  const {
    data: postData,
    isFetching: isPostFetching,
    status: postAPIStatus,
    refetch: refetchPost,
  } = api.search.findPosts.useQuery(
    { text: searchText, pageSize: PAGE_SIZE, page },
    { enabled: false, refetchOnWindowFocus: false },
  );

  const {
    data: musicDataRes,
    isFetching: isMusicFetching,
    status: musicAPIStatus,
    refetch: refetchMusic,
  } = api.search.findYoutubeVideos.useQuery(
    {
      text: searchText,
      pageToken,
    },
    { enabled: false, refetchOnWindowFocus: false },
  );

  const f = useCallback(
    debounce(1500, (e: string) => {
      if (e.trim() === '') {
        setSearchText('');
      } else {
        setSearchText(e);
      }
    }),
    [],
  );

  useEffect(() => {
    if (
      userAPIStatus === 'success' ||
      postAPIStatus === 'success' ||
      musicAPIStatus === 'success'
    ) {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('q', searchText);
      urlParams.set('type', searchType);
      const newUrl =
        searchText.trim() === ''
          ? window.location.pathname
          : `${window.location.pathname}?${urlParams.toString()}`;
      if (window.location.search !== urlParams.toString()) {
        console.log(window.location.search);
        console.log(urlParams.toString());
        router.replace(newUrl, undefined, { shallow: true });
      }
    }
  }, [userAPIStatus, postAPIStatus, musicAPIStatus, searchText, searchType]);

  useEffect(() => {
    if (router.query.q) {
      setInputTxt(router.query.q as string);
      setSearchText(router.query.q as string);
    }
  }, [router.query.q]);

  useEffect(() => {
    if (searchText.trim() !== '') {
      if (searchType === SEARCH_TYPE.PLAYER) {
        refetchUser();
      } else if (searchType === SEARCH_TYPE.POST) {
        refetchPost();
      } else if (searchType === SEARCH_TYPE.MUSIC) {
        refetchMusic();
      }
    }
  }, [searchText, searchType, page]);

  useEffect(() => {
    setPage(DEFAULT_PAGE);
    setPageToken('');
  }, [searchType]);

  const handleOnChange = (e) => {
    setInputTxt(e);
    f(e);
  };

  const musicData = musicDataRes?.data;
  const total = (searchType === SEARCH_TYPE.PLAYER ? userData?.total : postData?.total) ?? 0;
  const loadMore =
    total === 0 ? null : (
      <Pagination
        onPageChange={(p) => setPage(p)}
        currentPage={page}
        pageSize={PAGE_SIZE}
        total={total}
        style={{ marginBottom: 12 }}
      />
    );

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <div className='mt-20 w-[600px]'>
        <InputGroup style={{ flexWrap: 'noWrap', width: '100%' }}>
          <Select
            style={{ width: '100px' }}
            value={searchType}
            onChange={(e) => setSearchType(e as SEARCH_TYPE)}
          >
            <Select.Option value={SEARCH_TYPE.PLAYER}>Player</Select.Option>
            <Select.Option value={SEARCH_TYPE.POST}>Posts</Select.Option>
            <Select.Option value={SEARCH_TYPE.MUSIC}>Music</Select.Option>
          </Select>
          <Input
            onChange={handleOnChange}
            suffix={<IconSearch />}
            className='flex-1'
            placeholder='Find player, nscode, posts, musics..'
            value={inputTxt}
            showClear
          />
        </InputGroup>

        {searchType === SEARCH_TYPE.PLAYER && (
          <List
            loadMore={loadMore}
            dataSource={userData?.users || []}
            emptyContent={<MyEmpty className='mt-8' title='Nothing here' desc='no results found' />}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                main={
                  <Link href={`/profile/${item.id}`}>
                    <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>
                      {item.name}
                    </span>
                    <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                      {item.nscode}
                    </p>
                  </Link>
                }
              />
            )}
          />
        )}

        {searchType === SEARCH_TYPE.POST && (
          <List
            loadMore={loadMore}
            dataSource={postData?.posts || []}
            emptyContent={<MyEmpty className='mt-8' title='Nothing here' desc='no results found' />}
            renderItem={(item) => (
              <List.Item
                main={
                  <Link href={`/post/${item.id}`}>
                    <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>
                      {item.title}
                    </span>
                    <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                      {dayjs(item.createdAt).format('DD/MM/YYYY')}
                    </p>
                  </Link>
                }
              />
            )}
          />
        )}

        {searchType === SEARCH_TYPE.MUSIC && (
          <List
            loadMore={
              <div className='flex w-full items-center justify-center gap-x-4 py-4'>
                {musicData?.nextPageToken && (
                  <Button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      setPageToken(musicData?.nextPageToken as string);
                    }}
                  >
                    Next Page
                  </Button>
                )}
                {musicData?.prevPageToken && (
                  <Button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      setPageToken(musicData?.prevPageToken as string);
                    }}
                  >
                    Pre Page
                  </Button>
                )}
              </div>
            }
            dataSource={musicData?.items || []}
            emptyContent={<MyEmpty className='mt-8' title='Nothing here' desc='no results found' />}
            renderItem={(music) => (
              <List.Item
                key={music.id?.videoId}
                main={
                  <Link href={`/music/${music.id?.videoId}`}>
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
        )}

        {(isUserFetching || isPostFetching || isMusicFetching) && <Spin />}
      </div>
    </div>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Search;
