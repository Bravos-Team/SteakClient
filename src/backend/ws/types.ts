export interface WebSocketEventHandler {
  onConnect?(): void
  onError?(error: unknown): void
  onMessage?(data: unknown): void
  onClose?(): void
}

export interface WebSocketConfig {
  endpoint: string
  headers?: Record<string, string>
  maxReconnectAttempts?: number
  reconnectDelay?: number
  pingInterval?: number
}

