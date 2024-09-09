import React from 'react';
import { render, screen } from '@testing-library/react';

import VideoCard from '@/components/common/VideoCard/VideoCard';
import { VideoType } from '@/types/VideoType';

describe('VideoCard Component', () => {
  const mockVideo: VideoType = {
    _id: '1',
    title: 'Test Video',
    description: 'This is a test video description',
    thumbnails: {
      url: 'http://example.com/thumbnail.jpg',
      width: 120,
      height: 90,
    },
    channelTitle: 'Test Channel',
    statistics: {
      viewCount: '1000',
      likeCount: '100',
      commentCount: '10',
    },
    sharedBy: {
      userName: 'Test User',
      userId: '1',
    },
  };

  it('renders video information correctly', () => {
    render(<VideoCard data={mockVideo} />);

    expect(screen.getByText('Test Video')).toBeInTheDocument();
    expect(screen.getByText('This is a test video description')).toBeInTheDocument();
    expect(screen.getByText('Test Channel')).toBeInTheDocument();
    expect(screen.getByText('Shared by Test User')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders thumbnail image with correct attributes', () => {
    render(<VideoCard data={mockVideo} />);

    const thumbnailImage = screen.getByAltText('thumbnail') as HTMLImageElement;
    expect(thumbnailImage).toHaveAttribute('width', '120');
    expect(thumbnailImage).toHaveAttribute('height', '90');
  });

  it('applies animation classes', () => {
    const { container } = render(<VideoCard data={mockVideo} />);
    expect(container.firstChild).toHaveClass('animate-fade-in', 'opacity-0');
  });

  it('truncates long titles and descriptions', () => {
    const longVideo: VideoType = {
      ...mockVideo,
      title: 'A'.repeat(100),
      description: 'B'.repeat(200),
    };

    render(<VideoCard data={longVideo} />);

    const title = screen.getByText('A'.repeat(100));
    const description = screen.getByText('B'.repeat(200));

    expect(title).toHaveClass('line-clamp-2');
    expect(description).toHaveClass('line-clamp-3');
  });

  it('renders default thumbnail dimensions when not provided', () => {
    const videoWithoutThumbnailDimensions: VideoType = {
      ...mockVideo,
      thumbnails: {
        url: 'http://example.com/thumbnail.jpg',
      },
    };

    render(<VideoCard data={videoWithoutThumbnailDimensions} />);

    const thumbnailImage = screen.getByAltText('thumbnail') as HTMLImageElement;
    expect(thumbnailImage).toHaveAttribute('width', '1280');
    expect(thumbnailImage).toHaveAttribute('height', '720');
  });
});
