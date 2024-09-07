import { Server, Socket } from 'socket.io';

export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log('A user connected');

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });

      // Add more custom event handlers here
      socket.on('resource:shared', (msg: string) => {
        this.io.emit('resource:shared', msg);
      });
    });
  }

  public emitEvent(event: string, data) {
    this.io.emit(event, data);
  }
}
