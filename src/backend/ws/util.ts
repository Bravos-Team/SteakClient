import { endPointWS } from '../constants/url'
import { WebSocket } from 'ws'
class WebSocketClient {
  private ws: WebSocket | null = null
  private readonly headers: { [key: string]: string }
  private reconnectAttempts = 0
  private readonly maxReconnectAttempts = 5
  private readonly reconnectDelay = 5000 // 5 seconds
  private reconnectTimeout: NodeJS.Timeout | null = null
  private lastPingTime = Date.now()
  private heartBeatInterval: NodeJS.Timeout | null = null
  private isReconnecting = false
  constructor(
    private endpoint: string,
    private gameId: string,
    private authToken: string,
    private deviceId: string,
  ) {
    this.headers = {
      Authorization: this.authToken,
      'Game-Id': gameId,
      'Device-Id': deviceId,
    }
  }

  connect(onConnect: () => void, onError: (error: unknown) => void): void {
    console.log('Attempting to open WebSocket to:', this.endpoint)

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already open, disconnecting first.')
      this.disconnect()
    }
    try {
      if (!this.endpoint.startsWith('wss://') && !this.endpoint.startsWith('ws://')) {
        console.error('Invalid WebSocket endpoint:', this.endpoint)
        onError(new Error('Invalid WebSocket endpoint'))
        return
      }
      this.ws = new WebSocket(this.endpoint, { headers: this.headers })
      this.ws.on('open', () => {
        console.log(`WebSocket connected at ${new Date().toLocaleTimeString('vi-VN')}`)
        this.reconnectAttempts = 0
        this.isReconnecting = false
        this.startHeartBeat()
        onConnect()
      })
      this.ws.on('pong', () => {
        console.log(`WebSocket pong received at ${new Date().toLocaleTimeString('vi-VN')}`)
        // Đánh dấu connection vẫn sống
        this.lastPingTime = Date.now()
      })
      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error)
        onError(error)
        this.handleReconnect(onConnect, onError)
      })

      this.ws.on('close', () => {
        console.log(`WebSocket closed at ${new Date().toLocaleTimeString('vi-VN')}`)
        this.stopHeartBeat()
        if (this.isReconnecting) {
          this.handleReconnect(onConnect, onError)
        }
      })
    } catch (error) {
      console.error('Error during WebSocket connection:', error)
      onError(error)
      this.handleReconnect(onConnect, onError)
    }
  }

  startHeartBeat(): void {
    this.heartBeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping()
      }
      if (Date.now() - this.lastPingTime > 60000) {
        console.warn('WebSocket ping timeout')
        this.ws?.terminate()
      }
    }, 30000)
  }
  stopHeartBeat(): void {
    if (this.heartBeatInterval) {
      clearInterval(this.heartBeatInterval)
      this.heartBeatInterval = null
    }
  }
  disconnect(): void {
    console.log('WebSocket disconnecting')

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close()
      console.log('WebSocket disconnected')
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    this.ws = null
    this.isReconnecting = false
  }

  private handleReconnect(onConnect: () => void, onError: (error: unknown) => void): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || this.isReconnecting) {
      console.warn('Max reconnect attempts reached or already reconnecting')
      onError(new Error('Max reconnect attempts reached'))
      return
    }
    this.reconnectAttempts++
    this.isReconnecting = true
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
    this.reconnectTimeout = setTimeout(() => {
      this.connect(onConnect, onError)
    }, this.reconnectDelay)
  }
}

export function initWebSocket(token: string, gameId: string, deviceId: string) {
  return new WebSocketClient(endPointWS, gameId, token, deviceId)
}
