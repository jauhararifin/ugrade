import { ForbiddenAction, Permission } from 'ugrade/auth'
import { mockAuthService, MockedAuthService } from 'ugrade/auth/mocked'
import { ValidationError } from 'yup'
import { Announcement } from '../announcement'
import { NoSuchAnnouncement } from '../NoSuchAnnouncement'
import { InMemoryAnnouncementService } from './inmemory'

describe('test in memory announcement service', () => {
  const getService = (
    announcements: Announcement[] = []
  ): [InMemoryAnnouncementService, MockedAuthService] => {
    const authService = mockAuthService()
    const announcementService = new InMemoryAnnouncementService(
      authService,
      announcements
    )
    return [announcementService, authService]
  }

  const token = '12345678901234567890123456789009'
  const cid = token

  test('test getContestAnnouncements validation', async () => {
    const [service, _] = getService()
    await expect(
      service.getContestAnnouncements('ivalidtoken', 'invalidcid')
    ).rejects.toBeInstanceOf(ValidationError)

    await service
      .getContestAnnouncements(token, token)
      .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
  })

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

  test('readAnnouncement validation', async () => {
    const [service, _] = getService()
    await expect(
      service.readAnnouncement('ivalidtoken', 'invalidcid')
    ).rejects.toBeInstanceOf(ValidationError)

    await service
      .readAnnouncement(token, token)
      .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
  })

  test('readAnnouncement should fail when user has no permission', async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({ permissions: [] })
    await expect(service.readAnnouncement(token, token)).rejects.toBeInstanceOf(
      ForbiddenAction
    )
  })

  test('readAnnouncement should fail when no announcement found', async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({
      permissions: [Permission.AnnouncementRead],
    })
    await expect(
      service.readAnnouncement(token, 'a'.repeat(32))
    ).rejects.toBeInstanceOf(NoSuchAnnouncement)
  })

  test('readAnnouncement should fail when announcement is in different contest', async () => {
    const annId = 'a'.repeat(32)
    const [service, authService] = getService([
      {
        id: annId,
        contestId: 'anothercontest',
        title: 'title',
        content: 'content',
        issuedTime: new Date(),
        issuerId: '',
        read: false,
      },
    ])
    authService.getMe.mockResolvedValue({
      contestId: 'usercid',
      permissions: [Permission.AnnouncementRead],
    })
    await expect(service.readAnnouncement(token, annId)).rejects.toBeInstanceOf(
      NoSuchAnnouncement
    )
  })

  test('readAnnouncement should resolve', async () => {
    const annId = 'a'.repeat(32)
    const [service, authService] = getService([
      {
        id: annId,
        contestId: 'usercid',
        title: 'title',
        content: 'content',
        issuedTime: new Date(),
        issuerId: '',
        read: false,
      },
    ])
    authService.getMe.mockResolvedValue({
      contestId: 'usercid',
      permissions: [Permission.AnnouncementRead],
    })

    const pvalue = service.readAnnouncement(token, annId)
    await expect(pvalue).resolves.toBeDefined()
    const value = await pvalue
    expect(value.read).toBeTruthy()
  })

  test('create get read get', async () => {
    const [service, authService] = getService()

    // user 1 create announcement
    authService.getMe.mockResolvedValue({
      id: 'uid1',
      permissions: [Permission.AnnouncementCreate],
      contestId: cid,
    })
    const value = await service.createAnnouncement(token, 'title', 'content')
    expect(value.read).toBeTruthy()

    // user 2 get announcement
    authService.getMe.mockResolvedValue({
      id: 'uid2',
      permissions: [Permission.AnnouncementRead],
      contestId: cid,
    })
    const getValue = await service.getContestAnnouncements(token, cid)
    expect(getValue).toHaveLength(1)
    expect(getValue[0].read).toBeFalsy()
    expect(getValue[0].issuerId).toEqual('uid1')

    // user 2 read announcement
    const readValue = await service.readAnnouncement(token, value.id)
    expect(readValue.read).toBeTruthy()
    expect(readValue.issuerId).toEqual('uid1')

    // user 2 get announcement again
    const getValue2 = await service.getContestAnnouncements(token, cid)
    expect(getValue2).toHaveLength(1)
    expect(getValue2[0].read).toBeTruthy()
    expect(getValue2[0].issuerId).toEqual('uid1')
  })
})
