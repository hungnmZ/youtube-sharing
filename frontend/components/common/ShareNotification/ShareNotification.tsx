import * as React from 'react';
import Image from 'next/image';

type ShareNotificationProps = {
  toast: {
    visible: boolean;
  };
  title: string;
  channelTitle: string;
  thumbnails: {
    url: string;
    width: number;
    height: number;
  };
  userName: string;
};

const ShareNotification: React.FC<ShareNotificationProps> = (props) => {
  const { toast, title, channelTitle, thumbnails, userName } = props;
  return (
    <div
      className={`${
        toast.visible ? 'animate-enter' : 'animate-leave'
      } pointer-events-auto flex w-full max-w-md rounded-lg bg-background/95 p-3 shadow-lg ring-1 ring-black ring-opacity-5 dark:border`}
    >
      <div className='flex items-center justify-center'>
        <div className='flex h-full items-center bg-black'>
          <Image
            className='h-20 w-auto'
            src={thumbnails.url}
            alt='thumbnail'
            width={thumbnails.width || 1280}
            height={thumbnails.height || 720}
          />
        </div>
        <div className='ml-3 flex-1'>
          <p className='text-sm font-medium text-foreground/90'>
            {userName} just shared a video 🚀
          </p>
          <p className='mt-1 line-clamp-2 overflow-ellipsis text-sm text-foreground/75'>
            {title}
          </p>
          {channelTitle && (
            <p className='mt-1 text-sm italic text-foreground/75'>
              --- {channelTitle} ---
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareNotification;
