'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Disc3Icon } from 'lucide-react';

import { getVideos } from '@/data/video';
import { VideoType } from '@/types/VideoType';

import VideoCardList from './VideoCardList';

let page = 1;

type LoadMoreProps = {
  limit: number;
};

const LoadMore: React.FC<LoadMoreProps> = ({ limit }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [endOfList, setEndOfList] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    getVideos({ skip: page * limit, limit }).then((response) => {
      if (!response.data?.length) {
        setEndOfList(true);
        return;
      }
      setVideos((prev) => [...prev, ...response.data]);
      page++;
    });
  }, [isInView, limit]);

  return (
    <>
      {videos.length > 0 && <VideoCardList videos={videos} />}
      {!endOfList && (
        <div ref={ref} className='mx-auto mb-6 w-max'>
          <Disc3Icon
            className='h-6 w-6 animate-spin text-muted-foreground'
            data-testid='disc-3-icon'
          />
        </div>
      )}
    </>
  );
};

export default LoadMore;
