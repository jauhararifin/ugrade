import { InMemoryAnnouncementService } from './inmemory'
import { ValidationError } from 'yup'
import { mockAuthService, MockedAuthService } from 'ugrade/auth/mocked'
import { ForbiddenAction, Permission } from 'ugrade/auth'

describe('test in memory announcement service', () => {
  const getService = (): [InMemoryAnnouncementService, MockedAuthService] => {
    const authService = mockAuthService()
    const announcementService = new InMemoryAnnouncementService(authService)
    return [announcementService, authService]
  }

  test('test getContestAnnouncements validation', async () => {
    const [service, _] = getService()
    await expect(
      service.getContestAnnouncements('ivalidtoken', 'invalidcid')
    ).rejects.toBeInstanceOf(ValidationError)

    const token = '12345678901234567890123456789009'
    await service
      .getContestAnnouncements(token, token)
      .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
  })

  const token = '12345678901234567890123456789009'
  const cid = token

  test('test getContestAnnouncements should fail when user has no permission', async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({ permissions: [] })

    await expect(
      service.getContestAnnouncements(token, token)
    ).rejects.toBeInstanceOf(ForbiddenAction)
  })

  test(`test getContestAnnouncements should fail when contest is different from user's contest`, async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({
      permissions: [Permission.AnnouncementRead],
      contestId: 'someweirdid',
    })
    await expect(
      service.getContestAnnouncements(token, token)
    ).rejects.toBeInstanceOf(ForbiddenAction)
  })

  test('test getContestAnnouncements should resolved', async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({
      permissions: [Permission.AnnouncementRead],
      contestId: cid,
    })
    await expect(
      service.getContestAnnouncements(token, token)
    ).resolves.toBeDefined()
  })
})
