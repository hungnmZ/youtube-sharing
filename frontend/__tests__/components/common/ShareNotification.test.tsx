import React from 'react';
import { render, screen } from '@testing-library/react';

import ShareNotification from '@/components/common/ShareNotification/ShareNotification';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('ShareNotification', () => {
  const mockProps = {
    toast: { visible: true },
    title: 'Test Video Title',
    channelTitle: 'Test Channel',
    thumbnails: {
      url: 'https://example.com/thumbnail.jpg',
      width: 120,
      height: 90,
    },
    userName: 'Test User',
  };

  it('renders correctly with given props', () => {
    render(<ShareNotification {...mockProps} />);

    expect(screen.getByText('Test User just shared a video 🚀')).toBeInTheDocument();
    expect(screen.getByText('Test Video Title')).toBeInTheDocument();
    expect(screen.getByText('--- Test Channel ---')).toBeInTheDocument();
    const img = screen.getByAltText('thumbnail');
    expect(img).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
    expect(img).toHaveAttribute('width', '120');
    expect(img).toHaveAttribute('height', '90');
  });

  it('applies correct animation class when visible', () => {
    const { container } = render(<ShareNotification {...mockProps} />);
    expect(container.firstChild).toHaveClass('animate-in');
  });

  it('applies correct animation class when not visible', () => {
    const { container } = render(
      <ShareNotification {...mockProps} toast={{ visible: false }} />,
    );
    expect(container.firstChild).toHaveClass('animate-out');
  });

  it('uses default width and height for thumbnail when not provided', () => {
    const propsWithoutDimensions = {
      ...mockProps,
      thumbnails: {
        url: 'https://example.com/thumbnail.jpg',
        width: 1280,
        height: 720,
      },
    };
    render(<ShareNotification {...propsWithoutDimensions} />);
    const img = screen.getByAltText('thumbnail');
    expect(img).toHaveAttribute('width', '1280');
    expect(img).toHaveAttribute('height', '720');
  });

  it('truncates long video titles', () => {
    const longTitleProps = {
      ...mockProps,
      title:
        'This is a very long video title that should be truncated in the notification',
    };
    render(<ShareNotification {...longTitleProps} />);
    const titleElement = screen.getByText(/This is a very long video title/);
    expect(titleElement).toHaveClass('line-clamp-2 overflow-ellipsis');
  });

  it('handles missing channel title', () => {
    const propsWithoutChannel = {
      ...mockProps,
      channelTitle: '',
    };
    render(<ShareNotification {...propsWithoutChannel} />);
    expect(screen.queryByText('--- ---')).not.toBeInTheDocument();
  });

  it('renders user name correctly', () => {
    render(<ShareNotification {...mockProps} />);
    expect(screen.getByText(/Test User/)).toHaveClass('font-medium');
  });
});
