import lodash from 'lodash'
import { ProfileModel } from '../model'
import { NoSuchProfile } from '../NoSuchProfile'
import { ProfileStore } from '../store'

export class InMemoryProfileStore implements ProfileStore {
  private profiles: ProfileModel[]
  private userProfile: { [userId: string]: ProfileModel }

  constructor(profiles: ProfileModel[] = []) {
    this.profiles = lodash.cloneDeep(profiles)
    this.userProfile = {}
    for (const prof of this.profiles) {
      this.userProfile[prof.userId] = prof
    }
  }

  async getProfile(userId: string): Promise<ProfileModel> {
    if (this.userProfile[userId]) {
      return lodash.cloneDeep(this.userProfile[userId])
    }
    throw new NoSuchProfile('No Such Profile')
  }

  async putProfile(profile: ProfileModel): Promise<ProfileModel> {
    const newProfile = lodash.cloneDeep(profile)
    if (this.userProfile[newProfile.userId]) {
      for (let i = 0; i < this.profiles.length; i++) {
        if (this.profiles[i].userId === newProfile.userId) {
          this.profiles[i] = newProfile
          break
        }
      }
    } else {
      this.profiles.push(newProfile)
    }
    this.userProfile[newProfile.userId] = newProfile
    return lodash.cloneDeep(this.userProfile[profile.userId])
  }
}
