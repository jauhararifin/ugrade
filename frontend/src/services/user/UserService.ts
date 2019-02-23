import { GenderType, ShirtSizeType, UserProfile } from './UserProfile'

export interface UserService {
  getMyProfile(token: string): Promise<UserProfile>

  setMyProfile(
    token: string,
    name?: string,
    gender?: GenderType,
    shirtSize?: ShirtSizeType,
    address?: string
  ): Promise<void>
}
