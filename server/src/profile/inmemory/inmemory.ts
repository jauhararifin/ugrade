import lodash from 'lodash'
import {
  AuthService,
  ForbiddenAction,
  NoSuchUser,
  Permission,
} from 'ugrade/auth'
import { NoSuchProfile } from '../NoSuchProfile'
import { GenderType, Profile, ShirtSizeType } from '../profile'
import { ProfileService } from '../service'
import { profileServiceValidator as validator } from '../validations/validator'

export class InMemoryProfileService implements ProfileService {
  private authService: AuthService
  private profiles: Profile[]
  private userProfile: { [userId: string]: Profile }

  constructor(authService: AuthService, profiles: Profile[] = []) {
    this.authService = authService
    this.profiles = lodash.cloneDeep(profiles)
    this.userProfile = {}
    for (const prof of this.profiles) {
      this.userProfile[prof.userId] = prof
    }
  }

  async getUserProfile(token: string, userId: string): Promise<Profile> {
    await validator.getUserProfile(token, userId)

    // check permission
    const issuer = await this.authService.getMe(token)
    if (
      issuer.id !== userId &&
      !issuer.permissions.includes(Permission.ProfilesRead)
    ) {
      throw new ForbiddenAction()
    }

    // check user exists
    const resultUser = await this.authService.getUserById(userId)
    if (resultUser.contestId !== issuer.contestId) {
      throw new NoSuchUser()
    }

    if (this.userProfile[userId]) {
      return lodash.cloneDeep(this.userProfile[userId])
    }
    throw new NoSuchProfile()
  }

  async setMyProfile(
    token: string,
    gender?: GenderType,
    shirtSize?: ShirtSizeType,
    address?: string
  ): Promise<Profile> {
    await validator.setMyProfile(token, gender, shirtSize, address)
    const me = await this.authService.getMe(token)
    const newProfile = {
      gender,
      shirtSize,
      address,
      userId: me.id,
    }

    // insert profile
    this.userProfile[me.id] = newProfile
    let inserted = false
    for (let i = 0; i < this.profiles.length; i++) {
      if (this.profiles[i].userId === me.id) {
        this.profiles[i] = newProfile
        inserted = true
        break
      }
    }
    if (!inserted) this.profiles.push(newProfile)

    return lodash.cloneDeep(this.userProfile[me.id])
  }
}
