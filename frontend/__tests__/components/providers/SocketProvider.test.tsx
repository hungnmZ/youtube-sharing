import React from 'react';
import { toast } from 'react-hot-toast';
import { act, render } from '@testing-library/react';
import { io } from 'socket.io-client';

import { SocketProvider } from '@/components/providers/SocketProvider';
import { ENV_CONFIG } from '@/constants/config';

// Mock dependencies
jest.mock('socket.io-client');
jest.mock('react-hot-toast');
jest.mock('@/constants/config', () => ({
  ENV_CONFIG: {
    BACKEND_URL: 'http://test-backend-url.com',
  },
}));
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: { id: 'test-user-id' },
    isSignedIn: true,
  }),
}));

// Mock console.log to avoid cluttering test output
console.log = jest.fn();

describe('SocketProvider', () => {
  let mockSocket: any;
  let mockOn: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    mockOn = jest.fn();
    mockDisconnect = jest.fn();
    mockSocket = {
      on: mockOn,
      disconnect: mockDisconnect,
    };
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes socket connection', () => {
    render(<SocketProvider>Test</SocketProvider>);

    expect(io).toHaveBeenCalledWith(ENV_CONFIG.BACKEND_URL);
    expect(mockOn).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('resource:shared', expect.any(Function));
  });

  it('logs connect and disconnect events', () => {
    render(<SocketProvider>Test</SocketProvider>);

    const connectHandler = mockOn.mock.calls.find((call) => call[0] === 'connect')[1];
    const disconnectHandler = mockOn.mock.calls.find(
      (call) => call[0] === 'disconnect',
    )[1];

    act(() => {
      connectHandler();
      disconnectHandler();
    });

    expect(console.log).toHaveBeenCalledWith('🚀 ~ newSocket.on ~ connect:');
    expect(console.log).toHaveBeenCalledWith('🚀 ~ newSocket.on ~ disconnect:');
  });

  it('handles resource:shared event', () => {
    render(<SocketProvider>Test</SocketProvider>);

    const resourceSharedHandler = mockOn.mock.calls.find(
      (call) => call[0] === 'resource:shared',
    )[1];

    const mockData = JSON.stringify({
      userName: 'Test User',
      title: 'Test Title',
      channelTitle: 'Test Channel',
      thumbnails: { url: 'test-url' },
      userId: 'other-user-id',
    });

    act(() => {
      resourceSharedHandler(mockData);
    });

    expect(toast.custom).toHaveBeenCalled();
  });

  it('does not show toast for current user', () => {
    render(<SocketProvider>Test</SocketProvider>);

    const resourceSharedHandler = mockOn.mock.calls.find(
      (call) => call[0] === 'resource:shared',
    )[1];

    const mockData = JSON.stringify({
      userName: 'Test User',
      title: 'Test Title',
      channelTitle: 'Test Channel',
      thumbnails: { url: 'test-url' },
      userId: 'test-user-id', // Same as mocked user ID
    });

    act(() => {
      resourceSharedHandler(mockData);
    });

    expect(toast.custom).not.toHaveBeenCalled();
  });

  it('disconnects socket on unmount', () => {
    const { unmount } = render(<SocketProvider>Test</SocketProvider>);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
