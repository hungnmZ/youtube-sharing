'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import io, { Socket } from 'socket.io-client';

import ShareNotification from '@/components/common/ShareNotification';
import { ENV_CONFIG } from '@/constants/config';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const SocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const newSocket = io(ENV_CONFIG.BACKEND_URL_PUBLIC!);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🚀 ~ newSocket.on ~ connect:');
    });

    newSocket.on('disconnect', () => {
      console.log('🚀 ~ newSocket.on ~ disconnect:');
    });

    newSocket.on('resource:shared', (data) => {
      const { userName, title, channelTitle, thumbnails, userId } = JSON.parse(data);
      if (user?.id !== userId) {
        toast.custom((t) => (
          <ShareNotification
            toast={t}
            title={title}
            channelTitle={channelTitle}
            thumbnails={thumbnails}
            userName={userName}
          />
        ));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
