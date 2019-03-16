import { ProfileModel } from './model'

export interface ProfileStore {
  getProfile(userId: string): Promise<ProfileModel>
  putProfile(profile: ProfileModel): Promise<ProfileModel>
}
