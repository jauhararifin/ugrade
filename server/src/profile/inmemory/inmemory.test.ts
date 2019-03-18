import { AuthService, ForbiddenAction, Permission, User } from 'ugrade/auth'
import { ValidationError } from 'yup'
import { profileServiceValidator } from '../validations/validator'
import { InMemoryProfileService } from './inmemory'

// TODO: complete this
describe('test in memory profile service', () => {
  test.each([
    ['pHNy5HryhffH6briYKeEtKKX9gkYg6sK', '-'],
    ['-', 'FQIYarKUA3XGu10oKQ6NkWI9VlpSshio'],
    ['', ''],
  ])('getUserProfile %j should throw validation error', async (token, uid) => {
    const service = new InMemoryProfileService({} as any)
    const result = service.getUserProfile(token, uid)
    expect(result).rejects.toBeInstanceOf(ValidationError)
  })

  test.each([
    [],
    [Permission.UsersInvite],
    [Permission.UsersDelete, Permission.UsersPermissionsUpdate],
  ])(
    'getUserProfile %j should throw forbidden action',
    async (...permissions) => {
      profileServiceValidator.getUserProfile = jest.fn().mockResolvedValue(true)
      const me = Promise.resolve(({ permissions } as unknown) as User)
      const getMe = jest.fn<Promise<User>, []>().mockReturnValue(me)
      const otherUser = Promise.resolve(({} as unknown) as User)
      const getUserById = jest
        .fn<Promise<User>, []>()
        .mockReturnValue(otherUser)
      const auth = ({
        getMe,
        getUserById,
      } as unknown) as AuthService
      const service = new InMemoryProfileService(auth)

      await expect(service.getUserProfile('', '')).rejects.toBeInstanceOf(
        ForbiddenAction
      )
    }
  )

  test.each([
    [{ id: 'uid1' }, { id: 'uid1' }],
    [{ id: 'uid1', permissions: [Permission.ProfilesRead] }, { id: 'uid1' }],
    [{ id: 'uid1', permissions: [Permission.ProfilesRead] }, { id: 'uid2' }],
  ])(
    'getUserProfile %j should not throw forbidden action',
    async (me, other) => {
      profileServiceValidator.getUserProfile = jest.fn().mockResolvedValue(true)
      const getMe = jest.fn().mockReturnValue(Promise.resolve(me))
      const getUserById = jest.fn().mockReturnValue(Promise.resolve(other))
      const auth = ({
        getMe,
        getUserById,
      } as unknown) as AuthService
      const service = new InMemoryProfileService(auth)

      const result = service.getUserProfile('', '')
      await expect(result).rejects.not.toBeInstanceOf(ForbiddenAction)
    }
  )
})
