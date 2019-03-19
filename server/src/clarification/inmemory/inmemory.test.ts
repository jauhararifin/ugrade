import { Permission, ForbiddenAction } from 'ugrade/auth'
import { mockAuthService, MockedAuthService } from 'ugrade/auth/mocked'
import { ValidationError } from 'yup'
import { Clarification, ClarificationEntry } from '../clarification'
import { NoSuchClarification } from '../NoSuchClarification'
import { InMemoryClarificationService } from './inmemory'
import { clarificationServiceValidator } from '../validation'

describe('test in memory clarification service', () => {
  const getService = (
    clarifications: Clarification[] = [],
    clarificationEntries: ClarificationEntry[] = []
  ): [InMemoryClarificationService, MockedAuthService] => {
    const authService = mockAuthService()
    const clarificationService = new InMemoryClarificationService(
      authService,
      clarifications,
      clarificationEntries
    )
    return [clarificationService, authService]
  }

  const token = '12345678901234567890123456789009'
  const cid = token

  test('getClarificationById validation', async () => {
    const [service, _] = getService()
    await expect(
      service.getClarificationById('ivalidtoken', 'invalidcid')
    ).rejects.toBeInstanceOf(ValidationError)

    await service
      .getClarificationById(token, token)
      .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
  })

  test('getClarificationById should throw no such clarification', async () => {
    const [service, _] = getService()
    await expect(
      service.getClarificationById(token, cid)
    ).rejects.toBeInstanceOf(NoSuchClarification)
  })

  test('getClarificationById should throw no such clarification when clarification is in different contest', async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({ contestId: 'cid1' })
    authService.getUserById.mockResolvedValue({ contestId: 'cid2' })
    await expect(
      service.getClarificationById(token, cid)
    ).rejects.toBeInstanceOf(NoSuchClarification)
  })

  test('getClarificationById should throw no such clarification', async () => {
    const [service, authService] = getService([
      {
        id: cid,
        contestId: 'cid1',
        title: 'title1',
        subject: 'subject1',
        issuerId: 'uidanon',
        issuedTime: new Date(),
        entryIds: [],
      },
    ])
    authService.getMe.mockResolvedValue({
      id: 'uid1',
      contestId: 'cid1',
      permissions: [],
    })
    authService.getUserById.mockResolvedValue({ contestId: 'cid1' })
    await expect(
      service.getClarificationById(token, cid)
    ).rejects.toBeInstanceOf(NoSuchClarification)
  })

  test('getClarificationById should resolved when accessing own clarification', async () => {
    const clarif = {
      id: cid,
      contestId: 'cid1',
      title: 'title1',
      subject: 'subject1',
      issuerId: 'uid1',
      issuedTime: new Date(),
      entryIds: ['id1'],
    }
    const [service, authService] = getService([clarif])
    authService.getMe.mockResolvedValue({
      id: 'uid1',
      contestId: 'cid1',
      permissions: [],
    })
    authService.getUserById.mockResolvedValue({ contestId: 'cid1' })
    await expect(service.getClarificationById(token, cid)).resolves.toEqual(
      clarif
    )
  })

  test('getClarificationById should resolved when has clarifications:read permission', async () => {
    const clarif = {
      id: cid,
      contestId: 'cid1',
      title: 'title1',
      subject: 'subject1',
      issuerId: 'uid1',
      issuedTime: new Date(),
      entryIds: ['id1'],
    }
    const [service, authService] = getService([clarif])
    authService.getMe.mockResolvedValue({
      id: 'uid1',
      contestId: 'cid1',
      permissions: [Permission.ClarificationsRead],
    })
    authService.getUserById.mockResolvedValue({ contestId: 'cid1' })
    await expect(service.getClarificationById(token, cid)).resolves.toEqual(
      clarif
    )
  })

  test('getClarificationEntries validation', async () => {
    const [service, _] = getService()
    await expect(
      service.getClarificationEntries('ivalidtoken', 'invalidcid')
    ).rejects.toBeInstanceOf(ValidationError)

    await service
      .getClarificationEntries(token, token)
      .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
  })

  test('getClarificationEntries should throw no such clarification', async () => {
    const [service, _] = getService()
    await expect(
      service.getClarificationEntries(token, cid)
    ).rejects.toBeInstanceOf(NoSuchClarification)
  })

  test('getClarificationEntries should throw no such clarification when clarification is in different contest', async () => {
    const [service, authService] = getService()
    authService.getMe.mockResolvedValue({ contestId: 'cid1' })
    authService.getUserById.mockResolvedValue({ contestId: 'cid2' })
    await expect(
      service.getClarificationEntries(token, cid)
    ).rejects.toBeInstanceOf(NoSuchClarification)
  })

  test('getClarificationEntries should throw no such clarification', async () => {
    const [service, authService] = getService([
      {
        id: cid,
        contestId: 'cid1',
        title: 'title1',
        subject: 'subject1',
        issuerId: 'uidanon',
        issuedTime: new Date(),
        entryIds: [],
      },
    ])
    authService.getMe.mockResolvedValue({
      id: 'uid1',
      contestId: 'cid1',
      permissions: [],
    })
    authService.getUserById.mockResolvedValue({ contestId: 'cid1' })
    await expect(
      service.getClarificationById(token, cid)
    ).rejects.toBeInstanceOf(NoSuchClarification)
  })

  test('getClarificationEntries should resolved when accessing own clarification', async () => {
    const clarif = {
      id: cid,
      contestId: 'cid1',
      title: 'title1',
      subject: 'subject1',
      issuerId: 'uid1',
      issuedTime: new Date(),
      entryIds: ['id1'],
    }
    const clarifEntry = {
      id: 'id1',
      clarificationId: cid,
      senderId: 'uid1',
      content: 'content1',
      issuedTime: new Date(),
      read: false,
    }
    const [service, authService] = getService([clarif], [clarifEntry])
    authService.getMe.mockResolvedValue({
      id: 'uid1',
      contestId: 'cid1',
      permissions: [],
    })
    authService.getUserById.mockResolvedValue({ contestId: 'cid1' })
    await expect(service.getClarificationEntries(token, cid)).resolves.toEqual([
      clarifEntry,
    ])
  })

  test('getClarificationEntries should resolved when has clarifications:read permission', async () => {
    const clarif = {
      id: cid,
      contestId: 'cid1',
      title: 'title1',
      subject: 'subject1',
      issuerId: 'uid1',
      issuedTime: new Date(),
      entryIds: ['id1'],
    }
    const clarifEntry = {
      id: 'id1',
      clarificationId: cid,
      senderId: 'uid1',
      content: 'content1',
      issuedTime: new Date(),
      read: false,
    }
    const [service, authService] = getService([clarif], [clarifEntry])
    authService.getMe.mockResolvedValue({
      id: 'uid1',
      contestId: 'cid1',
      permissions: [Permission.ClarificationsRead],
    })
    authService.getUserById.mockResolvedValue({ contestId: 'cid1' })
    await expect(service.getClarificationEntries(token, cid)).resolves.toEqual([
      clarifEntry,
    ])
  })

  test('getContestClarifications validation', async () => {
    const [service, _] = getService()
    await expect(
      service.getContestClarifications('ivalidtoken', 'invalidcid')
    ).rejects.toBeInstanceOf(ValidationError)

    await service
      .getContestClarifications(token, token)
      .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
  })

  test('getContestClarifications should throw forbidden action when accessing different contest', async () => {
    const [clarifService, authService] = getService()
    authService.getMe.mockReturnValue({
      contestId: '000000000000000000000000somecid1',
    })
    await expect(
      clarifService.getContestClarifications(
        token,
        '00000000000000000000000othercid1'
      )
    ).rejects.toBeInstanceOf(ForbiddenAction)
  })

  test('getContestClarifications should resolve', async () => {
    const clarifTemplate: Clarification = {
      id: '',
      contestId: '',
      title: 'title1',
      subject: 'subject1',
      issuerId: '',
      issuedTime: new Date(),
      entryIds: [],
    }

    const clarif1 = {
      ...clarifTemplate,
      id: 'id1',
      issuerId: '',
      contestId: 'othercid',
    }
    const clarif2 = {
      ...clarifTemplate,
      id: 'id2',
      issuerId: 'uid1',
      contestId: '0000000000000000000000000000cid1',
    }
    const clarif3 = {
      ...clarifTemplate,
      id: 'id3',
      issuerId: 'uid2',
      contestId: '0000000000000000000000000000cid1',
    }
    const clarifs = [clarif1, clarif2, clarif3]

    const [clarifService, authService] = getService(clarifs)
    authService.getMe.mockReturnValue({
      id: 'uid1',
      contestId: '0000000000000000000000000000cid1',
      permissions: [],
    })
    await expect(
      clarifService.getContestClarifications(
        token,
        '0000000000000000000000000000cid1'
      )
    ).resolves.toEqual([clarif2])

    authService.getMe.mockReturnValue({
      id: 'uid1',
      contestId: '0000000000000000000000000000cid1',
      permissions: [Permission.ClarificationsRead],
    })
    await expect(
      clarifService.getContestClarifications(
        token,
        '0000000000000000000000000000cid1'
      )
    ).resolves.toEqual([clarif2, clarif3])
  })
})
