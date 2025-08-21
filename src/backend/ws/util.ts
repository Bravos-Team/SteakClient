import { WebSocket } from 'ws'
import { WebSocketConfig, WebSocketEventHandler } from './types'

const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 5000
const PING_INTERVAL = 30 * 60 * 1000
class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimeout: NodeJS.Timeout | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null
  private lastPingTime = Date.now()
  private isReconnecting = false

  constructor(
    private config: WebSocketConfig,
    private eventHandlers: WebSocketEventHandler,
  ) {
    this.config = {
      maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectDelay: RECONNECT_DELAY,
      pingInterval: PING_INTERVAL,
      ...config,
    }
  }

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already open, disconnecting first.')
      this.disconnect()
    }
    if (!this.config.endpoint.match(/^wss?:\/\//)) {
      this.eventHandlers.onError?.(new Error('Invalid WebSocket endpoint'))
      return
    }
    try {
      this.ws = new WebSocket(this.config.endpoint, { headers: this.config.headers })
      this.ws.on('open', () => {
        this.reconnectAttempts = 0
        this.isReconnecting = false
        this.startHeartbeat()
        this.eventHandlers.onConnect?.()
      })

      this.ws.on('pong', () => {
        this.lastPingTime = Date.now()
        console.log(`WebSocket pong received at ${new Date().toLocaleTimeString('vi-VN')}`)
      })
      this.ws.on('error', (error) => {
        this.eventHandlers.onError?.(error)
        this.handleReconnect()
      })
      this.ws.on('close', () => {
        this.eventHandlers.onClose?.()
        this.stopHeartbeat()
        if (this.isReconnecting) {
          this.handleReconnect()
        }
      })
    } catch (error) {
      this.eventHandlers.onError?.(error)
      this.handleReconnect()
    }
  }

  disconnect(): void {
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

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping()
      }
      if (Date.now() - this.lastPingTime > 2 * (this.config.pingInterval || 0)) {
        console.warn('WebSocket ping timeout')
        this.ws?.terminate()
      }
    }, this.config.pingInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }
  private handleReconnect(): void {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5) || this.isReconnecting) {
      this.eventHandlers.onError?.(new Error('Max reconnect attempts reached'))
      return
    }
    this.reconnectAttempts++
    this.isReconnecting = true
    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, this.config.reconnectDelay)
  }
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
export async function initWebSocketManager(
  config: WebSocketConfig,
  handlers: WebSocketEventHandler = {},
): Promise<WebSocketManager> {
  return new WebSocketManager(config, handlers)
}
