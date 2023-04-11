import { Avatar } from '@douyinfe/semi-ui';
import { useSession } from 'next-auth/react';

let defaultStyle = {
  flexBasis: '48px',
  flexShrink: 0,
};
const MyAvatar = ({ src }: { src: string }) => {
  const { data: sessionData } = useSession();

  return (
    <>
      {sessionData?.user?.image ? (
        <Avatar alt='avatar' src={src} style={defaultStyle} />
      ) : (
        <Avatar alt='avatar' style={defaultStyle}>
          {sessionData?.user?.name?.charAt(0) || 'UU'}
        </Avatar>
      )}
    </>
  );
};

export default MyAvatar;
