import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useInView } from 'framer-motion';

import LoadMore from '@/components/common/VideoCard/LoadMore';
import { getVideos } from '@/data/video';
import { VideoType } from '@/types/VideoType';

jest.mock('framer-motion', () => ({
  useInView: jest.fn(),
}));

jest.mock('@/data/video', () => ({
  getVideos: jest.fn(),
}));

jest.mock('@/components/common/VideoCard/VideoCardList', () => ({
  __esModule: true,
  default: () => <div data-testid='video-card-list'>VideoCardList</div>,
}));

describe('LoadMore Component', () => {
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
    (useInView as jest.Mock).mockReturnValue(false);
  });

  it('renders loading spinner when not at end of list', () => {
    render(<LoadMore limit={5} />);
    expect(screen.getByTestId('disc-3-icon')).toBeInTheDocument();
  });

  it('does not render VideoCardList when no videos are loaded', () => {
    render(<LoadMore limit={5} />);
    expect(screen.queryByTestId('video-card-list')).not.toBeInTheDocument();
  });

  it('loads more videos when in view', async () => {
    (useInView as jest.Mock).mockReturnValue(true);
    (getVideos as jest.Mock).mockResolvedValue({ data: mockVideos });

    await act(async () => {
      render(<LoadMore limit={5} />);
    });

    expect(getVideos).toHaveBeenCalledWith({ skip: 5, limit: 5 });
    expect(screen.getByTestId('video-card-list')).toBeInTheDocument();
  });

  it('sets endOfList to true when no more videos are returned', async () => {
    (useInView as jest.Mock).mockReturnValue(true);
    (getVideos as jest.Mock).mockResolvedValue({ data: [] });

    await act(async () => {
      render(<LoadMore limit={5} />);
    });

    expect(screen.queryByTestId('disc-3-icon')).not.toBeInTheDocument();
  });
});
