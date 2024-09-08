import * as React from 'react';

import HelloAnimation from '@/components/common/Icons/HelloAnimation';
import ShareGroup from '@/components/common/ShareGroup';

const Home = async () => {
  return (
    <main>
      <div className='-mt-14 flex h-dvh flex-col items-center justify-center pt-14'>
        <HelloAnimation />
        <ShareGroup />
      </div>
    </main>
  );
};

export default Home;
