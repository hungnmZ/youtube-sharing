import React from 'react';
import { render } from '@testing-library/react';

import Home from '@/app/(main)/home/page';
import { getVideos } from '@/data/video';
import { VideoType } from '@/types/VideoType';

jest.mock('@/data/video', () => ({
  getVideos: jest.fn(),
}));

jest.mock('@/components/common/VideoCard', () => ({
  VideoCardList: () => <div data-testid='video-card-list'>VideoCardList</div>,
  LoadMore: () => <div data-testid='load-more'>LoadMore</div>,
}));

describe('Home Page', () => {
  const mockVideos: VideoType[] = [
    {
      _id: '1',
      title: 'Test Video',
      description: 'Test Description',
      thumbnails: { url: 'http://example.com/thumbnail.jpg', width: 120, height: 90 },
      channelTitle: 'Test Channel',
      statistics: { viewCount: '1000', likeCount: '100', commentCount: '10' },
      sharedBy: { userName: 'Test User', userId: '1' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders VideoCardList and LoadMore components when videos are fetched successfully', async () => {
    (getVideos as jest.Mock).mockResolvedValue({ status: 200, data: mockVideos });

    const { findByTestId } = render(await Home());

    expect(await findByTestId('video-card-list')).toBeInTheDocument();
    expect(await findByTestId('load-more')).toBeInTheDocument();
  });

  it('does not render components when video fetch fails', async () => {
    (getVideos as jest.Mock).mockResolvedValue({ status: 500, data: null });

    const { container } = render(await Home());

    expect(container.firstChild).toBeNull();
  });

  it('calls getVideos with correct limit', async () => {
    (getVideos as jest.Mock).mockResolvedValue({ status: 200, data: mockVideos });

    await Home();

    expect(getVideos).toHaveBeenCalledWith({ limit: 5 });
  });
});
