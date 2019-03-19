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

  test('test createAnnouncement validation', async () => {
    const [service, _] = getService()
    await expect(
      service.createAnnouncement('ivalidtoken', '', '')
    ).rejects.toBeInstanceOf(ValidationError)
    await service
      .createAnnouncement(token, 'title', 'content')
      .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
  })

  test('test createAnnouncement should fail when user has no permission', async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({ permissions: [] })
    await expect(
      service.createAnnouncement(token, 'title', 'content')
    ).rejects.toBeInstanceOf(ForbiddenAction)
  })

  test('createAnnouncement should resolves', async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({
      id: 'someuserid',
      permissions: [Permission.AnnouncementCreate],
      contestId: cid,
    })

    const pvalue = service.createAnnouncement(token, 'title', 'content')
    await expect(pvalue).resolves.toBeDefined()
    const value = await pvalue
    expect(value.title).toEqual('title')
    expect(value.content).toEqual('content')
    expect(value.read).toBeTruthy()
    expect(value.issuerId).toEqual('someuserid')

    authService.getMe.mockResolvedValue({
      id: 'someuserid',
      permissions: [Permission.AnnouncementRead],
      contestId: cid,
    })

    const getPValue = service.getContestAnnouncements(token, cid)
    await expect(getPValue).resolves.toBeDefined()
    const getValue = await getPValue
    expect(getValue).toHaveLength(1)
    expect(getValue[0].title).toEqual('title')
    expect(getValue[0].content).toEqual('content')
    expect(getValue[0].read).toBeTruthy()
    expect(getValue[0].issuerId).toEqual('someuserid')
  })
})
