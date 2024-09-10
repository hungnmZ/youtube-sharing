import { Toaster } from 'react-hot-toast';

import Header from '@/components/common/Header';
import SocketProvider from '@/components/providers/SocketProvider';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketProvider>
      <Header />
      {children}
      <Toaster position='bottom-right' toastOptions={{ duration: 5000 }} />
    </SocketProvider>
  );
};

export default MainLayout;
