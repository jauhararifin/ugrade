import { ForbiddenAction, NoSuchUser, Permission } from 'ugrade/auth'
import { mockAuthService, MockedAuthService } from 'ugrade/auth/mocked/mocked'
import { ValidationError } from 'yup'
import { ProfileService } from '../service'
import { profileServiceValidator } from '../validations/validator'
import { InMemoryProfileService } from './inmemory'

describe('test in memory profile service', () => {
  const genService = (): [ProfileService, MockedAuthService] => {
    const authService = mockAuthService()
    const profileService = new InMemoryProfileService(authService)
    return [profileService, authService]
  }

  test.each([['pHNy5HryhffH6briYKeEtKKX9gkYg6sK', '-'], ['-', 'FQIYarKUA3XGu10oKQ6NkWI9VlpSshio'], ['', '']])(
    'getUserProfile %j should throw validation error',
    async (token, uid) => {
      const [service, _] = genService()
      const result = service.getUserProfile(token, uid)
      await expect(result).rejects.toBeInstanceOf(ValidationError)
    }
  )

  test.each([[], [Permission.UsersInvite], [Permission.UsersDelete, Permission.UsersPermissionsUpdate]])(
    'getUserProfile %j should throw forbidden action',
    async (...permissions) => {
      profileServiceValidator.getUserProfile = jest.fn().mockResolvedValue(true)
      const [profileService, authService] = genService()
      authService.getMe.mockResolvedValue({ permissions })
      authService.getUserById.mockResolvedValue({})

      await expect(profileService.getUserProfile('', '')).rejects.toBeInstanceOf(ForbiddenAction)
    }
  )

  test.each([
    [{ id: 'uid1' }, { id: 'uid1' }],
    [{ id: 'uid1', permissions: [Permission.ProfilesRead] }, { id: 'uid1' }],
    [{ id: 'uid1', permissions: [Permission.ProfilesRead] }, { id: 'uid2' }],
  ])('getUserProfile %j should not throw forbidden action', async (me, other) => {
    profileServiceValidator.getUserProfile = jest.fn().mockResolvedValue(true)
    const [profileService, authService] = genService()
    authService.getMe.mockResolvedValue(me)
    authService.getUserById.mockResolvedValue(other)

    await expect(profileService.getUserProfile('', '')).rejects.not.toBeInstanceOf(ForbiddenAction)
  })

  test('getUserProfile should throw no such user when auth service throw no such user', async () => {
    profileServiceValidator.getUserProfile = jest.fn().mockResolvedValue(true)
    const [profileService, authService] = genService()

    authService.getMe.mockResolvedValue({
      permissions: [Permission.ProfilesRead],
    })
    authService.getUserById.mockRejectedValue(new NoSuchUser())
    await expect(profileService.getUserProfile('', '')).rejects.toBeInstanceOf(NoSuchUser)
  })

  test('getUserProfile should throw no such user when the user is in different contest', async () => {
    profileServiceValidator.getUserProfile = jest.fn().mockResolvedValue(true)
    const [profileService, authService] = genService()

    authService.getMe.mockResolvedValue({
      contestId: 'cid1',
      permissions: [Permission.ProfilesRead],
    })
    authService.getUserById.mockResolvedValue({ contestId: 'cid2' })
    await expect(profileService.getUserProfile('', '')).rejects.toBeInstanceOf(NoSuchUser)
  })

  test.todo('getUserProfile should throw no such profile when profile is empty')

  test.todo('getUserProfile should return new profile when succeded')

  test.todo('setMyProfile should throw validation error')

  test.todo('setMyProfile should throw invalid token')

  test.todo('setMyProfile should update old profile if already exists')

  test.todo('setMyProfile should insert new profile if not yet exists')

  test.todo('getUserProfile should return right profile after setMyProfile')
})
