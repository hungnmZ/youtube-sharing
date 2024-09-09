import React from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { io } from 'socket.io-client';

import Home from '@/app/(main)/home/page';
import SharePage from '@/app/(main)/share/page';
import { SocketProvider } from '@/components/providers/SocketProvider';
import { getVideos, shareVideo } from '@/data/video';

// Mock dependencies
jest.mock('@clerk/nextjs');
jest.mock('socket.io-client');
jest.mock('react-hot-toast');
jest.mock('@/data/video');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockVideos = [
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

// Add this at the top of the file, after the imports
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect: jest.Mock = jest.fn();
  observe: jest.Mock = jest.fn();
  takeRecords: jest.Mock = jest.fn();
  unobserve: jest.Mock = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

describe('Video Sharing Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({
      user: { id: 'testuser' },
      isSignedIn: true,
    });
    (getVideos as jest.Mock).mockResolvedValue({ status: 200, data: mockVideos });
    (io as jest.Mock).mockReturnValue({
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    });
  });

  it('lists videos on the home page', async () => {
    await act(async () => {
      render(await Home());
    });

    await waitFor(() => {
      expect(screen.getByText('Test Video 1')).toBeInTheDocument();
      expect(screen.getByText('Test Video 2')).toBeInTheDocument();
    });
  });

  it('allows sharing a video', async () => {
    const user = userEvent.setup();
    (shareVideo as jest.Mock).mockResolvedValue({ status: 200 });

    await act(async () => {
      render(<SocketProvider>{await SharePage()}</SocketProvider>);
    });

    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    const shareButton = screen.getByRole('button', { name: /share/i });

    await user.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await user.click(shareButton);

    await waitFor(() => {
      expect(shareVideo).toHaveBeenCalledWith(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      );
      expect(toast.custom).toHaveBeenCalled();
    });
  });

  it('notifies about new shared videos', async () => {
    let socketHandler: (data: string) => void;
    (io as jest.Mock).mockReturnValue({
      on: (event: string, handler: (data: string) => void) => {
        if (event === 'resource:shared') {
          socketHandler = handler;
        }
      },
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    });

    render(
      <SocketProvider>
        <div>Test Component</div>
      </SocketProvider>,
    );

    await act(async () => {
      socketHandler(
        JSON.stringify({
          userName: 'Test User',
          title: 'New Shared Video',
          channelTitle: 'Test Channel',
          thumbnails: {
            url: 'http://example.com/new-thumbnail.jpg',
            width: 120,
            height: 90,
          },
          userId: 'otheruserid',
        }),
      );
    });

    await waitFor(() => {
      expect(toast.custom).toHaveBeenCalled();
      const toastCall = (toast.custom as jest.Mock).mock.calls[0][0];
      const toastComponent = toastCall({ visible: true });
      expect(toastComponent.props.title).toBe('New Shared Video');
    });
  });

  it('does not notify about videos shared by the current user', async () => {
    let socketHandler: (data: string) => void;
    (io as jest.Mock).mockReturnValue({
      on: (event: string, handler: (data: string) => void) => {
        if (event === 'resource:shared') {
          socketHandler = handler;
        }
      },
      off: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    });

    render(
      <SocketProvider>
        <div>Test Component</div>
      </SocketProvider>,
    );

    await act(async () => {
      socketHandler(
        JSON.stringify({
          userName: 'Test User',
          title: 'New Shared Video',
          channelTitle: 'Test Channel',
          thumbnails: {
            url: 'http://example.com/new-thumbnail.jpg',
            width: 120,
            height: 90,
          },
          userId: 'testuser', // Same as the mocked current user
        }),
      );
    });

    await waitFor(() => {
      expect(toast.custom).not.toHaveBeenCalled();
    });
  });
});
