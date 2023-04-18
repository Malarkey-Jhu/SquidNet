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
import MyEmpty from '../Empty';
import { api } from '@/utils/api';
import { debounce } from 'throttle-debounce';

const PAGE_SIZE = 6;
const DEFAULT_PAGE = 1;

enum SEARCH_TYPE {
  POST = 'POST',
  PLAYER = 'PLAYER',
  MUSIC = 'MUSIC',
}

import { type Post, type User } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';

const MySearch = () => {
  const [visible, setVisible] = useState(false);
  const [inputTxt, setInputTxt] = useState('');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageToken, setPageToken] = useState<undefined | string>();
  const [searchType, setSearchType] = useState<SEARCH_TYPE>(SEARCH_TYPE.POST);

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

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
    const handleKeyDown = (e) => {
      if (e.metaKey && e.key === 'k') {
        setVisible((v) => !v);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  useEffect(() => {
    if (!visible) {
      setInputTxt('');
      setSearchText('');
      setPageToken('');
      setPage(DEFAULT_PAGE);
    }
  }, [visible]);

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
    <>
      <div
        className='text-semi-color-text-2 flex w-fit cursor-pointer items-center rounded-full bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#98CDFD]'
        style={{ padding: '10px 13px', marginRight: 12, fontSize: 14, lineHeight: '20px' }}
        onClick={() => setVisible(true)}
      >
        <IconSearch />
        <div className='mx-1.5 font-semibold'>Search</div>
        <div className='ml-4px'>⌘ K</div>
      </div>

      <Modal
        width={700}
        header={null}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className='p-6'>
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
              emptyContent={
                <MyEmpty className='mt-8' title='Nothing here' desc='no results found' />
              }
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  main={
                    <Link href={`/profile/${item.id}`} onClick={() => setVisible(false)}>
                      <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>
                        {(item ).name}
                      </span>
                      <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                        {(item ).nscode}
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
              emptyContent={
                <MyEmpty className='mt-8' title='Nothing here' desc='no results found' />
              }
              renderItem={(item) => (
                <List.Item
                  main={
                    <Link href={`/post/${item.id}`} onClick={() => setVisible(false)}>
                      <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>
                        {(item ).title}
                      </span>
                      <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                        {dayjs((item ).createdAt).format('DD/MM/YYYY')}
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
              emptyContent={
                <MyEmpty className='mt-8' title='Nothing here' desc='no results found' />
              }
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

          {(isUserFetching || isPostFetching) && <Spin />}
        </div>
      </Modal>
    </>
  );
};

export default MySearch;
