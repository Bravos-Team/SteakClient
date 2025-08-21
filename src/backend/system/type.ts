export interface SystemInfo {
  cpu: {
    manufacturer: string
    model: string
    brand: string
    cores: number
    speed: number
  }
  memory: {
    total: number
    free: number
    available: number
  }
  gpu: Array<{
    model: string
    vendor: string
    vram: number
  }> | null
  os: {
    platform: string
    distro: string
    release: string
    codename: string
  }
  wifi: {
    ssid: string
    signalLevel: number
  } | null
  storage: Array<{
    mount: string
    size: number
    used: number
    available: number
  }> | null
}
