import * as React from 'react';
import {
  EyeIcon,
  MessageCircleMoreIcon,
  ShareIcon,
  ThumbsUpIcon,
  TvMinimalPlayIcon,
} from 'lucide-react';
import Image from 'next/image';

import { VideoType } from '@/types/VideoType';

type VideoCardProps = {
  data: VideoType;
  index: number;
};

const VideoCard: React.FC<VideoCardProps> = ({ data, index }) => {
  const { thumbnails, title, description, channelTitle, statistics, sharedBy } = data;

  return (
    <div
      className='animate-fade-in cursor-pointer rounded-2xl opacity-0'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className='cardWrapper flex w-[60rem] gap-6 rounded-2xl p-6 shadow-lg ring-1 ring-foreground/5 ring-opacity-0 transition-transform hover:scale-105 dark:ring-foreground/15'>
        <div className='thumbnailWrapper min-w-96 max-w-96'>
          <Image
            className='rounded-sm'
            src={thumbnails?.url || ''}
            alt='thumbnail'
            width={thumbnails?.width || 1280}
            height={thumbnails?.height || 720}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <h3 className='line-clamp-2 overflow-ellipsis text-lg font-semibold'>
            {title}
          </h3>
          <div className='relative mb-2'>
            <p
              className='line-clamp-3 overflow-ellipsis text-sm text-foreground/70'
              title={description}
            >
              {description}
            </p>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <TvMinimalPlayIcon className='h-5 w-5' color='red' />
              <p className='text-sm text-muted-foreground'>{channelTitle}</p>
            </div>
            <div className='flex items-center gap-2'>
              <ShareIcon className='h-5 w-5' color='deepskyblue' />
              <p className='text-sm text-muted-foreground'>
                Shared by {sharedBy.userName}
              </p>
            </div>
            <div className='flex gap-8 text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <EyeIcon className='h-5 w-5' />
                <p className='text-sm'>{statistics?.viewCount}</p>
              </div>
              <div className='flex items-center gap-2'>
                <ThumbsUpIcon className='h-5 w-5' />
                <p className='text-sm'>{statistics?.likeCount}</p>
              </div>
              <div className='flex items-center gap-2'>
                <MessageCircleMoreIcon className='h-5 w-5' />
                <p className='text-sm'>{statistics?.commentCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
