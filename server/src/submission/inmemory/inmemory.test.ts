import { ForbiddenAction, Permission } from 'ugrade/auth'
import { mockAuthService, MockedAuthService } from 'ugrade/auth/mocked'
import { mockContestService, MockedContestService } from 'ugrade/contest/mocked'
import { NoSuchLanguage } from 'ugrade/language'
import { MockedProblemService, mockProblemService } from 'ugrade/problem/mocked'
import { NoSuchProblem } from 'ugrade/problem/NoSuchProblem'
import { ValidationError } from 'yup'
import { GradingVerdict, Submission } from '../Submission'
import { InMemorySubmissionService } from './inmemory'

describe('test in memory submission service', () => {
  const getService = (
    submissions: Submission[] = []
  ): [InMemorySubmissionService, MockedAuthService, MockedContestService, MockedProblemService] => {
    const authService = mockAuthService()
    const contestService = mockContestService()
    const problemService = mockProblemService()
    const submissionService = new InMemorySubmissionService(authService, contestService, problemService, submissions)
    return [submissionService, authService, contestService, problemService]
  }

  const token = 'kasd892AS09dLSd1829SD0123jrH51Lp'
  const cid = 'jasd1214jqAHg6J1oo9PkJau1ahzLUW6'
  const pid = 'wasd1214jqAHg6J1oo9PkJau1ahzLUW6'
  const lid = 'lpK15HiqjqAHg6J1oo9PkJau1ahzLUW6'
  const sourceCode = 'http://example.com/'
  const templateSubmission: Submission = {
    id: '',
    issuerId: '',
    contestId: '',
    problemId: '',
    languageId: '',
    issuedTime: new Date(),
    verdict: GradingVerdict.Pending,
    sourceCode: 'http://example.com/',
    gradings: [],
  }

  describe('test getContestSubmissions', () => {
    test('getContestSubmissions validation', async () => {
      const [service, _] = getService()
      await expect(service.getContestSubmissions('ivalidtoken', 'invalidcid')).rejects.toBeInstanceOf(ValidationError)

      await service.getContestSubmissions(token, cid).catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('getContestSubmissions should throw ForbiddenAction when trying to access submission in different contest', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({ contestId: 'cid727' })
      contestService.getContestById.mockResolvedValue({ id: 'cid111' })
      await expect(service.getContestSubmissions(token, cid)).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('getContestSubmissions should returns own submission only when user doesnt have Permission.SubmissionsRead permission', async () => {
      const [service, authService, contestService] = getService([
        { ...templateSubmission, contestId: cid, id: 's1', issuerId: 'uid812' },
        { ...templateSubmission, contestId: cid, id: 's2', issuerId: 'uid810' },
        { ...templateSubmission, contestId: cid, id: 's3', issuerId: 'uid812' },
        { ...templateSubmission, contestId: cid, id: 's4', issuerId: 'uid819' },
      ])
      authService.getMe.mockResolvedValue({ id: 'uid812', contestId: cid, permissions: [] })
      contestService.getContestById.mockResolvedValue({ id: cid })

      const subs = await service.getContestSubmissions(token, cid)
      expect(subs.map(s => s.id)).toEqual(['s1', 's3'])
    })

    test('getContestSubmissions should returns all submission when user have Permission.SubmissionsRead permission', async () => {
      const [service, authService, contestService] = getService([
        { ...templateSubmission, contestId: cid, id: 's1', issuerId: 'uid812' },
        { ...templateSubmission, contestId: cid, id: 's2', issuerId: 'uid810' },
        { ...templateSubmission, contestId: cid, id: 's3', issuerId: 'uid812' },
        { ...templateSubmission, contestId: cid, id: 's4', issuerId: 'uid819' },
      ])
      authService.getMe.mockResolvedValue({
        id: 'uid812',
        contestId: cid,
        permissions: [Permission.SubmissionsRead],
      })
      contestService.getContestById.mockResolvedValue({ id: cid })

      const subs = await service.getContestSubmissions(token, cid)
      expect(subs.map(s => s.id)).toEqual(['s1', 's2', 's3', 's4'])
    })
  })

  describe('test createSubmission', () => {
    test('createSubmission validation', async () => {
      const [service, _] = getService()
      await expect(
        service.createSubmission('ivalidtoken', 'invalidpid', 'invalidlid', 'invalidsource')
      ).rejects.toBeInstanceOf(ValidationError)

      await service
        .createSubmission(token, pid, lid, sourceCode)
        .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('createSubmission should throw ForbiddenError when user doesnt have Permission.SubmissionCreate permission', async () => {
      const [service, authService] = getService()
      authService.getMe.mockResolvedValue({ contestId: cid, permissions: [] })
      await expect(service.createSubmission(token, pid, lid, sourceCode)).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('createSubmission should throw NoSuchLanguage when contest not permitted certain language', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({ contestId: cid, permissions: [Permission.SubmissionsCreate] })
      contestService.getContestById.mockResolvedValue({ id: cid, permittedLanguageIds: ['123'] })
      await expect(service.createSubmission(token, pid, lid, sourceCode)).rejects.toBeInstanceOf(NoSuchLanguage)
    })

    test('createSubmission should throw NoSuchProblem when problem service gives NoSuchProblem', async () => {
      const [service, authService, contestService, problemService] = getService()
      authService.getMe.mockResolvedValue({ contestId: cid, permissions: [Permission.SubmissionsCreate] })
      contestService.getContestById.mockResolvedValue({ id: cid, permittedLanguageIds: [lid] })
      problemService.getContestProblemById.mockRejectedValue(new NoSuchProblem())
      await expect(service.createSubmission(token, pid, lid, sourceCode)).rejects.toBeInstanceOf(NoSuchProblem)
    })

    test('createSubmission should resolved', async () => {
      const [service, authService, contestService, problemService] = getService()
      authService.getMe.mockResolvedValue({ id: 'uid888', contestId: cid, permissions: [Permission.SubmissionsCreate] })
      contestService.getContestById.mockResolvedValue({ id: cid, permittedLanguageIds: [lid] })
      problemService.getContestProblemById.mockResolvedValue({})
      const result = await service.createSubmission(token, pid, lid, sourceCode)
      expect(result.contestId).toEqual(cid)
      expect(result.issuerId).toEqual('uid888')
      expect(result.languageId).toEqual(lid)
      expect(result.problemId).toEqual(pid)

      const getResult = await service.getContestSubmissions(token, cid)
      expect(getResult).toHaveLength(1)
      expect(getResult[0].id).toEqual(result.id)
    })
  })
})
