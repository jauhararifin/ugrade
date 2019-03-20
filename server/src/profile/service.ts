import { GenderType, Profile, ShirtSizeType } from './profile'

export interface ProfileService {
  getUserProfile(token: string, userId: string): Promise<Profile>
  setMyProfile(token: string, gender?: GenderType, shirtSize?: ShirtSizeType, address?: string): Promise<Profile>
}
