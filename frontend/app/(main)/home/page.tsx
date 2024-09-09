import * as React from 'react';

import { LoadMore, VideoCardList } from '@/components/common/VideoCard';
import { getVideos } from '@/data/video';
import { VideoType } from '@/types/VideoType';

const limit = 5;

const Home = async () => {
  const videos = await getVideos({ limit });

  if (videos.status !== 200) {
    return;
  }

  return (
    <main>
      <VideoCardList videos={videos.data as VideoType[]} />
      <LoadMore limit={limit} />
    </main>
  );
};

export default Home;
