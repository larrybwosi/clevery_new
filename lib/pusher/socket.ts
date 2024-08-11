import io, { Socket } from 'socket.io-client';

type EventHandler = (event: any) => void;
type ChannelEventHandler = { [eventName: string]: Set<EventHandler> };

interface SocketIOSDKOptions {
  authEndpoint?: string;
  auth?: { [key: string]: any };
}

interface SocketIOSDK {
  /**
   * Connects to the Socket.IO server
   * @returns A promise that resolves when the connection is established
   * @example
   * const sdk = createSocketIOSDK('https://socket-io-server.com');
   * await sdk.connect();
   */
  connect: () => Promise<void>;

  /**
   * Disconnects from the Socket.IO server
   * @example
   * sdk.disconnect();
   */
  disconnect: () => void;

  /**
   * Subscribes to a channel
   * @param channelName - The name of the channel to subscribe to
   * @returns A promise that resolves when the subscription is complete
   * @example
   * await sdk.subscribe('chat-room');
   */
  subscribe: (channelName: string) => Promise<void>;

  /**
   * Unsubscribes from a channel
   * @param channelName - The name of the channel to unsubscribe from
   * @returns A promise that resolves when the unsubscription is complete
   * @example
   * await sdk.unsubscribe('chat-room');
   */
  unsubscribe: (channelName: string) => Promise<void>;

  /**
   * Binds an event handler to a specific channel and event
   * @param channelName - The name of the channel
   * @param eventName - The name of the event
   * @param callback - The event handler function
   * @example
   * sdk.bind('chat-room', 'new-message', (data) => {
   *   console.log('New message:', data);
   * });
   */
  bind: (channelName: string, eventName: string, callback: EventHandler) => void;

  /**
   * Unbinds an event handler from a specific channel and event
   * @param channelName - The name of the channel
   * @param eventName - The name of the event
   * @param callback - The event handler function to remove (optional)
   * @example
   * // Unbind a specific handler
   * sdk.unbind('chat-room', 'new-message', myHandler);
   * 
   * // Unbind all handlers for an event
   * sdk.unbind('chat-room', 'new-message');
   */
  unbind: (channelName: string, eventName: string, callback?: EventHandler) => void;

  /**
   * Triggers an event on a specific channel
   * @param channelName - The name of the channel
   * @param eventName - The name of the event
   * @param data - The data to send with the event
   * @returns A promise that resolves when the event is triggered
   * @example
   * await sdk.trigger('chat-room', 'send-message', { text: 'Hello, world!' });
   */
  trigger: (channelName: string, eventName: string, data: any) => Promise<void>;

  /**
   * Gets the list of subscribed channels
   * @returns An array of channel names
   * @example
   * const channels = sdk.getChannels();
   * console.log('Subscribed channels:', channels);
   */
  getChannels: () => string[];

  /**
   * Gets the event handlers for a specific channel
   * @param channelName - The name of the channel
   * @returns The channel's event handlers or undefined if the channel doesn't exist
   * @example
   * const chatRoomHandlers = sdk.getChannel('chat-room');
   * if (chatRoomHandlers) {
   *   console.log('Chat room event handlers:', chatRoomHandlers);
   * }
   */
  getChannel: (channelName: string) => ChannelEventHandler | undefined;

  /**
   * Checks if the SDK is currently connected to the Socket.IO server
   * @returns True if connected, false otherwise
   * @example
   * if (sdk.isConnected()) {
   *   console.log('Connected to the server');
   * } else {
   *   console.log('Not connected');
   * }
   */
  isConnected: () => boolean;
}

/**
 * Creates a SocketIOSDK instance for managing Socket.IO connections and events
 * @param url - The URL of the Socket.IO server
 * @param options - Configuration options for the SDK
 * @returns A new instance of SocketIOSDK
 * @example
 * const sdk = createSocketIOSDK('https://socket-io-server.com', {
 *   auth: { token: 'user-token' }
 * });
 * 
 * await sdk.connect();
 * await sdk.subscribe('chat-room');
 * 
 * sdk.bind('chat-room', 'new-message', (data) => {
 *   console.log('New message:', data);
 * });
 * 
 * await sdk.trigger('chat-room', 'send-message', { text: 'Hello!' });
 * 
 * // Later, when done:
 * await sdk.unsubscribe('chat-room');
 * sdk.disconnect();
 */
export const createSocketIOSDK = (url: string, options: SocketIOSDKOptions = {}): SocketIOSDK => {
  let socket: Socket | null = null;
  const channels: { [key: string]: ChannelEventHandler } = {};

  const connect = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      socket = io(url, {
        auth: options.auth,
        autoConnect: false,
      });

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        resolve();
      });

      socket.on('connect_error', (error: Error) => {
        console.error('Connection error:', error);
        reject(error);
      });

      socket.on('disconnect', (reason: string) => {
        console.log('Disconnected from Socket.IO server:', reason);
      });

      socket.on('message', (data: { channel: string; event: string; data: any }) => {
        const channelHandlers = channels[data.channel];
        if (channelHandlers && channelHandlers[data.event]) {
          channelHandlers[data.event].forEach(handler => handler(data.data));
        }
      });

      socket.connect();
    });
  };

  const disconnect = (): void => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const subscribe = async (channelName: string): Promise<void> => {
    if (!socket) {
      throw new Error('Not connected to Socket.IO server');
    }

    if (!channels[channelName]) {
      channels[channelName] = {};
      await new Promise<void>((resolve, reject) => {
        socket!.emit('subscribe', channelName, (error: Error | null) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      console.log(`Subscribed to channel: ${channelName}`);
    }
  };

  const unsubscribe = async (channelName: string): Promise<void> => {
    if (!socket) {
      throw new Error('Not connected to Socket.IO server');
    }

    if (channels[channelName]) {
      delete channels[channelName];
      await new Promise<void>((resolve, reject) => {
        socket!.emit('unsubscribe', channelName, (error: Error | null) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      console.log(`Unsubscribed from channel: ${channelName}`);
    }
  };

  const bind = (channelName: string, eventName: string, callback: EventHandler): void => {
    if (!channels[channelName]) {
      channels[channelName] = {};
    }
    if (!channels[channelName][eventName]) {
      channels[channelName][eventName] = new Set();
    }
    channels[channelName][eventName].add(callback);
  };

  const unbind = (channelName: string, eventName: string, callback?: EventHandler): void => {
    if (channels[channelName] && channels[channelName][eventName]) {
      if (callback) {
        channels[channelName][eventName].delete(callback);
      } else {
        delete channels[channelName][eventName];
      }
    }
  };

  const trigger = async (channelName: string, eventName: string, data: any): Promise<void> => {
    if (!socket) {
      throw new Error('Not connected to Socket.IO server');
    }

    await new Promise<void>((resolve, reject) => {
      socket!.emit('client-event', { channel: channelName, event: eventName, data }, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };

  // Additional Pusher-like functionality
  const getChannels = (): string[] => Object.keys(channels);

  const getChannel = (channelName: string): ChannelEventHandler | undefined => channels[channelName];

  const isConnected = (): boolean => socket?.connected ?? false;

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    bind,
    unbind,
    trigger,
    getChannels,
    getChannel,
    isConnected,
  };
};