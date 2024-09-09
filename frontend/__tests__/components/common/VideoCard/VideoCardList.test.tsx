import React from 'react';
import { render, screen } from '@testing-library/react';

import VideoCardList from '@/components/common/VideoCard/VideoCardList';
import { VideoType } from '@/types/VideoType';

jest.mock('@/components/common/VideoCard/VideoCard', () => ({
  __esModule: true,
  default: ({ data }: { data: VideoType }) => (
    <div data-testid={`video-card-${data._id}`}>{data.title}</div>
  ),
}));

describe('VideoCardList Component', () => {
  const mockVideos: VideoType[] = [
    {
      _id: '1',
      title: 'Test Video 1',
      description: 'Description 1',
      thumbnails: { url: 'http://example.com/thumbnail1.jpg', width: 120, height: 90 },
      channelTitle: 'Channel 1',
      statistics: { viewCount: '1000', likeCount: '100', commentCount: '10' },
      sharedBy: { userName: 'User 1', userId: '1' },
    },
    {
      _id: '2',
      title: 'Test Video 2',
      description: 'Description 2',
      thumbnails: { url: 'http://example.com/thumbnail2.jpg', width: 120, height: 90 },
      channelTitle: 'Channel 2',
      statistics: { viewCount: '2000', likeCount: '200', commentCount: '20' },
      sharedBy: { userName: 'User 2', userId: '2' },
    },
  ];

  it('renders all video cards', () => {
    render(<VideoCardList videos={mockVideos} />);

    expect(screen.getByTestId('video-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('video-card-2')).toBeInTheDocument();
    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
  });

  it('applies correct classes to the container', () => {
    const { container } = render(<VideoCardList videos={mockVideos} />);
    expect(container.firstChild).toHaveClass(
      'my-6',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'gap-6',
    );
  });

  it('applies animation delay to each video card', () => {
    render(<VideoCardList videos={mockVideos} />);

    const videoCards = screen.getAllByTestId(/^video-card-/);
    videoCards.forEach((card, index) => {
      expect(card.parentElement).toHaveStyle(`animation-delay: ${index * 100}ms`);
    });
  });

  it('renders nothing when no videos are provided', () => {
    const { container } = render(<VideoCardList videos={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('handles a large number of videos', () => {
    const manyVideos = Array.from({ length: 50 }, (_, i) => ({
      ...mockVideos[0],
      _id: `${i + 1}`,
      title: `Test Video ${i + 1}`,
    }));

    render(<VideoCardList videos={manyVideos} />);

    expect(screen.getAllByTestId(/^video-card-/)).toHaveLength(50);
  });

  it('handles videos with missing data', () => {
    const incompleteVideo: VideoType = {
      _id: '3',
      title: 'Incomplete Video',
      description: '',
      thumbnails: { url: '' },
      channelTitle: '',
      statistics: { viewCount: '', likeCount: '', commentCount: '' },
      sharedBy: { userName: '', userId: '' },
    };

    render(<VideoCardList videos={[incompleteVideo]} />);

    expect(screen.getByTestId('video-card-3')).toBeInTheDocument();
    expect(screen.getByText('Incomplete Video')).toBeInTheDocument();
  });
});
