export interface UserInfo {
  displayName: string | null
  avatarUrl: string | null
  Authentication: {
    accessToken: string | null
    refreshToken: string | null
  }
  deviceId: string | null
}
