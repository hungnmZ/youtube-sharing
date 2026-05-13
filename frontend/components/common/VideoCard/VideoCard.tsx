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
      className='animate-fade-in w-full cursor-pointer rounded-lg opacity-0 sm:rounded-2xl'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className='cardWrapper flex w-full flex-col gap-4 rounded-lg p-3 shadow-lg ring-1 ring-foreground/5 ring-opacity-0 transition-transform hover:scale-[1.01] dark:ring-foreground/15 sm:rounded-2xl sm:p-6 lg:w-[60rem] lg:flex-row lg:gap-6 lg:hover:scale-105'>
        <div className='thumbnailWrapper aspect-video w-full overflow-hidden rounded-sm bg-muted lg:w-96 lg:shrink-0'>
          {thumbnails?.url ? (
            <Image
              className='h-full w-full object-cover'
              src={thumbnails.url}
              alt='thumbnail'
              width={thumbnails?.width || 1280}
              height={thumbnails?.height || 720}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <TvMinimalPlayIcon className='h-10 w-10 text-muted-foreground' />
            </div>
          )}
        </div>
        <div className='flex min-w-0 flex-col gap-2'>
          <h3 className='line-clamp-2 overflow-ellipsis text-base font-semibold sm:text-lg'>
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
              <TvMinimalPlayIcon className='h-5 w-5 shrink-0' color='red' />
              <p className='min-w-0 truncate text-sm text-muted-foreground'>
                {channelTitle}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <ShareIcon className='h-5 w-5 shrink-0' color='deepskyblue' />
              <p className='min-w-0 truncate text-sm text-muted-foreground'>
                Shared by {sharedBy.userName}
              </p>
            </div>
            <div className='flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground sm:gap-x-8'>
              <div className='flex items-center gap-2'>
                <EyeIcon className='h-5 w-5 shrink-0' />
                <p className='text-sm'>{statistics?.viewCount}</p>
              </div>
              <div className='flex items-center gap-2'>
                <ThumbsUpIcon className='h-5 w-5 shrink-0' />
                <p className='text-sm'>{statistics?.likeCount}</p>
              </div>
              <div className='flex items-center gap-2'>
                <MessageCircleMoreIcon className='h-5 w-5 shrink-0' />
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
