import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Client from './client/index';
import LoginPage from './login/index';

const Index = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Client /> : <LoginPage />;
};

export default Index;
