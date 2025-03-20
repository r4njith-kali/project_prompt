type MessageCallback = (message: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageCallback: MessageCallback | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/chat';
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.messageCallback) {
        this.messageCallback(data);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ content: message }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  public onMessage(callback: MessageCallback) {
    this.messageCallback = callback;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new WebSocketService(); 