import { api } from '@/utils/api';
import { type User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect } from 'react';

const UserContext = createContext<{
  user: User | null;
  refetch: () => Promise<any>;
  isLoading: boolean;
}>({ user: null, refetch: () => Promise.resolve(), isLoading: true });

export const UserProivder = ({ children }) => {
  const userId = useSession().data?.user?.id || '';

  const {
    data: userData,
    refetch,
    isLoading,
  } = api.user.find.useQuery({ userId: userId  }, { refetchOnWindowFocus: false });

  const userConfig = {
    user: userData,
    refetch,
    isLoading,
  };

  return <UserContext.Provider value={userConfig}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
