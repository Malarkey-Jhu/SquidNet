import { Avatar } from '@douyinfe/semi-ui';
import { useSession } from 'next-auth/react';
import { useUser } from '../User/UserProvider';

const defaultStyle = {
  flexBasis: '48px',
  flexShrink: 0,
  color: 'rgb(33 33 33)',
  backgroundColor: '#35A2E1',
};
const MyAvatar = () => {
  const { user } = useUser();

  return (
    <>
      {user?.image ? (
        <Avatar alt='avatar' src={user?.image} style={defaultStyle} />
      ) : (
        <Avatar alt='avatar' style={defaultStyle}>
          {user?.name?.charAt(0) || 'UU'}
        </Avatar>
      )}
    </>
  );
};

export default MyAvatar;
