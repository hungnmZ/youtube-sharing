/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import { Server, Socket } from 'socket.io';

import { SocketService } from '../../frameworks/webserver/services/socket.service';

jest.mock('socket.io');

describe('SocketService', () => {
  let mockIo: jest.Mocked<Server>;
  let mockSocket: jest.Mocked<Socket>;
  let socketService: SocketService;

  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
    } as unknown as jest.Mocked<Socket>;

    mockIo = {
      on: jest.fn(),
      emit: jest.fn(),
    } as unknown as jest.Mocked<Server>;

    (mockIo.on as jest.Mock).mockImplementation(
      (event: string, callback: (socket: Socket) => void) => {
        if (event === 'connection') {
          callback(mockSocket);
        }
      },
    );

    socketService = new SocketService(mockIo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set up event handlers on construction', () => {
    expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledTimes(2);
    expect(mockSocket.on).toHaveBeenNthCalledWith(1, 'disconnect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenNthCalledWith(
      2,
      'resource:shared',
      expect.any(Function),
    );
  });

  it('should log when a user connects', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    new SocketService(mockIo);
    expect(consoleSpy).toHaveBeenCalledWith('A user connected');
  });

  it('should log when a user disconnects', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    type SocketOnCall = [event: string, listener: (...args: any[]) => void];
    const disconnectCallback = (mockSocket.on as jest.Mock).mock.calls.find(
      (call): call is SocketOnCall => Array.isArray(call) && call[0] === 'disconnect',
    )?.[1];

    if (disconnectCallback) {
      disconnectCallback();
      expect(consoleSpy).toHaveBeenCalledWith('User disconnected');
    } else {
      fail('Disconnect callback not found');
    }
  });

  it('should emit to all clients when resource:shared event is received', () => {
    type SocketOnCall = [event: string, listener: (...args: any[]) => void];
    const sharedCallback = (mockSocket.on as jest.Mock).mock.calls.find(
      (call): call is SocketOnCall =>
        Array.isArray(call) && call[0] === 'resource:shared',
    )?.[1];

    if (sharedCallback) {
      const testMessage = 'Test shared resource';
      sharedCallback(testMessage);
      expect(mockIo.emit).toHaveBeenCalledWith('resource:shared', testMessage);
    } else {
      fail('Resource:shared callback not found');
    }
  });

  it('should emit events to all clients', () => {
    const testEvent = 'test:event';
    const testData = { key: 'value' };
    socketService.emitEvent(testEvent, testData);
    expect(mockIo.emit).toHaveBeenCalledWith(testEvent, testData);
  });
});
