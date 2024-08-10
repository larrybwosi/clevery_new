import io, { Socket } from 'socket.io-client';

type EventHandler = (event: any) => void;

class SocketIOSDK {
  private socket: Socket | null = null;
  private channels: { [key: string]: Set<EventHandler> } = {};

  constructor(private url: string) {}

  connect() {
    this.socket = io(this.url);
    
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Handle incoming messages for all channels
    this.socket.on('message', (data: { channel: string; event: string; data: any }) => {
      const handlers = this.channels[data.channel];
      if (handlers) {
        handlers.forEach(handler => handler({ eventName: data.event, data: data.data }));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  async subscribe({ channelName, onEvent }: { channelName: string; onEvent: EventHandler }) {
    if (!this.socket) {
      throw new Error('Not connected to Socket.IO server');
    }

    if (!this.channels[channelName]) {
      this.channels[channelName] = new Set();
      this.socket.emit('subscribe', channelName);
    }

    this.channels[channelName].add(onEvent);
    console.log(`Subscribed to channel: ${channelName}`);
  }

  async unsubscribe({ channelName }: { channelName: string }) {
    if (!this.socket) {
      throw new Error('Not connected to Socket.IO server');
    }

    if (this.channels[channelName]) {
      this.channels[channelName].clear();
      delete this.channels[channelName];
      this.socket.emit('unsubscribe', channelName);
      console.log(`Unsubscribed from channel: ${channelName}`);
    }
  }
}

export const createSocketIOSDK = (url: string) => new SocketIOSDK(url);