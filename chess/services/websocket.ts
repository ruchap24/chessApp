import { TokenStorage } from './tokenStorage';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, MessageHandler[]>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;

  async connect() {
    const token = await TokenStorage.get();
    const url = `wss://your-backend.com?token=${token}`;
    
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const handlers = this.handlers.get(message.type) || [];
      handlers.forEach((handler) => handler(message.payload));
    };

    this.ws.onclose = () => {
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      }
    };

    this.ws.onerror = (e) => console.error('WebSocket error:', e);
  }

  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type)!.push(handler);
    // Return cleanup function
    return () => {
      const handlers = this.handlers.get(type) || [];
      this.handlers.set(type, handlers.filter((h) => h !== handler));
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    this.ws?.close();
  }
}

export const wsService = new WebSocketService();