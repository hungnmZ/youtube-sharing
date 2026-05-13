import * as React from 'react';

import HelloAnimation from '@/components/common/Icons/HelloAnimation';
import ShareGroup from '@/components/common/ShareGroup';

const Home = async () => {
  return (
    <main>
      <div className='flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-4 px-4 py-8 sm:gap-6'>
        <HelloAnimation />
        <ShareGroup />
      </div>
    </main>
  );
};

export default Home;
