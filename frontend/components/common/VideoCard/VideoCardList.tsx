import React from 'react';

import { VideoType } from '@/types/VideoType';

import VideoCard from './VideoCard';

type VideoCardListProps = {
  videos: VideoType[];
};

const VideoCardList: React.FC<VideoCardListProps> = ({ videos }) => {
  return (
    <div className='my-6 flex flex-col items-center justify-center gap-6'>
      {videos.map((video, index) => (
        <div key={video._id} style={{ animationDelay: `${index * 100}ms` }}>
          <VideoCard data={video} />
        </div>
      ))}
    </div>
  );
};

export default VideoCardList;
