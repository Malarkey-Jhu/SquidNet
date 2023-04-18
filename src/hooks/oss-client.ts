import OSS from 'ali-oss';
import { api } from '@/utils/api';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export const useOSSClient = () => {
  const [ossClient, setOSSClient] = useState<OSS>();
  const {
    data: token,
    refetch,
    status,
  } = api.oss.getSTS.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (status === 'success') {
      const client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
        region: 'oss-cn-shanghai',
        accessKeyId: token?.AccessKeyId || '',
        accessKeySecret: token?.AccessKeySecret || '',
        stsToken: token?.SecurityToken || '',
        // 填写Bucket名称。
        bucket: '5610-final',
        // 刷新临时访问凭证。
        endpoint: 'https://oss-accelerate.aliyuncs.com',
        refreshSTSToken: async () => {
          const { data: refreshToken } = await refetch();
          return {
            accessKeyId: refreshToken?.AccessKeyId || '',
            accessKeySecret: refreshToken?.AccessKeySecret || '',
            stsToken: refreshToken?.SecurityToken || '',
          };
        },
      });

      setOSSClient(client);
    }
  }, [status]);

  return ossClient;
};
