import { AuthService } from 'ugrade/services/auth'
import { GenderType, ShirtSizeType, UserProfile } from '../UserProfile'
import { UserService } from '../UserService'

export class InMemoryUserService implements UserService {
  private authService: AuthService
  private userProfile: { [userId: string]: UserProfile }

  constructor(authService: AuthService) {
    this.authService = authService
    this.userProfile = {}
  }

  async getMyProfile(token: string): Promise<UserProfile> {
    const user = await this.authService.getMe(token)
    if (!this.userProfile[user.id]) {
      this.userProfile[user.id] = user
    }
    return this.userProfile[user.id]
  }

  async setMyProfile(
    token: string,
    name?: string,
    gender?: GenderType,
    shirtSize?: ShirtSizeType,
    address?: string
  ): Promise<void> {
    const user = await this.authService.getMe(token)
    if (name && name.length > 0) await this.authService.setMyName(token, name)
    this.userProfile[user.id] = { ...user, gender, shirtSize, address }
  }
}
