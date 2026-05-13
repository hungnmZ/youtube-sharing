import React from 'react';

import { VideoType } from '@/types/VideoType';

import VideoCard from './VideoCard';

type VideoCardListProps = {
  videos: VideoType[];
};

const VideoCardList: React.FC<VideoCardListProps> = ({ videos }) => {
  return (
    <div className='mx-auto my-6 flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-4 md:px-6'>
      {videos.map((video, index) => (
        <VideoCard key={video._id} data={video} index={index} />
      ))}
    </div>
  );
};

export default VideoCardList;
