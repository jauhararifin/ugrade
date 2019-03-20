import { ForbiddenAction, Permission } from 'ugrade/auth'
import { mockAuthService, MockedAuthService } from 'ugrade/auth/mocked'
import { NoSuchContest } from 'ugrade/contest'
import { mockContestService, MockedContestService } from 'ugrade/contest/mocked'
import { ValidationError } from 'yup'
import { NoSuchProblem } from '../NoSuchProblem'
import { Problem, ProblemType } from '../problem'
import { InMemoryProblemService } from './inmemory'

describe('test in memory problem service', () => {
  const getService = (
    problems: Problem[] = []
  ): [InMemoryProblemService, MockedAuthService, MockedContestService] => {
    const authService = mockAuthService()
    const contestService = mockContestService()
    const problemService = new InMemoryProblemService(
      authService,
      contestService,
      problems
    )
    return [problemService, authService, contestService]
  }

  const token = 'kasd892AS09dLSd1829SD0123jrH51Lp'
  const contestId = 'cuxXeoFFMfiAwMBUNeNsfujXFqKZBKw8'
  const problemId = '93VMyb2LzNihs70qVla6xYF3JOgkixHT'
  const problemTemplate: Problem = {
    id: '',
    contestId: '',
    issuerId: '',
    shortId: '',
    name: 'name',
    statement: 'statement',
    type: ProblemType.Batch,
    disabled: false,
    issuedTime: new Date(),
    order: 1,
    timeLimit: 1000,
    tolerance: 1.1,
    memoryLimit: 16 * 1024 * 1024,
    outputLimit: 1,
  }

  describe('test getContestProblems', () => {
    test('getContestProblems validation', async () => {
      const [service, _] = getService()
      await expect(
        service.getContestProblems('ivalidtoken', 'invalidcid')
      ).rejects.toBeInstanceOf(ValidationError)

      await service
        .getContestProblems(token, token)
        .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('getContestProblems should throw ForbiddenAction when user doesnt has ProblemsRead permission', async () => {
      const [service, authService] = getService()
      authService.getMe.mockResolvedValue({ permissions: [] })
      await expect(
        service.getContestProblems(token, token)
      ).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('getContestProblems should throw NoSuchContest when no contest is found', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
      })
      contestService.getContestById.mockRejectedValue(new NoSuchContest())
      await expect(
        service.getContestProblems(token, token)
      ).rejects.toBeInstanceOf(NoSuchContest)
    })

    test('getContestProblems should throw ForbiddenError when contestId is belong to different contest', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
      })
      contestService.getContestById.mockResolvedValue({ id: 'someotherid' })
      await expect(
        service.getContestProblems(token, token)
      ).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('getContestProblems should not returns disabled problem when user doesnt have ProblemsReadDisabled permission', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: 'id1', contestId, disabled: false },
        { ...problemTemplate, id: 'id2', contestId, disabled: true },
        { ...problemTemplate, id: 'id3', contestId, disabled: false },
        { ...problemTemplate, id: 'id4', contestId, disabled: true },
        { ...problemTemplate, id: 'id5', contestId, disabled: true },
        { ...problemTemplate, id: 'id6', contestId, disabled: false },
      ])
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
        contestId,
      })
      contestService.getContestById.mockResolvedValue({ id: contestId })
      const result = await service.getContestProblems(token, contestId)
      expect(result).toHaveLength(3)
      expect(result.map(r => r.id)).toEqual(['id1', 'id3', 'id6'])
    })

    test('getContestProblems should returns disabled problem when user have ProblemsReadDisabled permission', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: 'id1', contestId, disabled: false },
        { ...problemTemplate, id: 'id2', contestId, disabled: true },
        { ...problemTemplate, id: 'id3', contestId, disabled: false },
        { ...problemTemplate, id: 'id4', contestId, disabled: true },
        { ...problemTemplate, id: 'id5', contestId, disabled: true },
        { ...problemTemplate, id: 'id6', contestId, disabled: false },
      ])
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead, Permission.ProblemsReadDisabled],
        contestId,
      })
      contestService.getContestById.mockResolvedValue({ id: contestId })
      const result = await service.getContestProblems(token, contestId)
      expect(result).toHaveLength(6)
      expect(result.map(r => r.id)).toEqual([
        'id1',
        'id2',
        'id3',
        'id4',
        'id5',
        'id6',
      ])
    })
  })

  describe('test getContestProblemById', () => {
    test('getContestProblemById validation', async () => {
      const [service, _] = getService()
      await expect(
        service.getContestProblemById('ivalidtoken', 'invalidcid', 'invalidpid')
      ).rejects.toBeInstanceOf(ValidationError)

      await service
        .getContestProblemById(token, contestId, problemId)
        .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('getContestProblemById should throw ForbiddenAction when user doesnt has ProblemsRead permission', async () => {
      const [service, authService] = getService()
      authService.getMe.mockResolvedValue({ permissions: [] })
      await expect(
        service.getContestProblemById(token, contestId, problemId)
      ).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('getContestProblemById should throw NoSuchContest when no contest is found', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
      })
      contestService.getContestById.mockRejectedValue(new NoSuchContest())
      await expect(
        service.getContestProblemById(token, contestId, problemId)
      ).rejects.toBeInstanceOf(NoSuchContest)
    })

    test('getContestProblemById should throw ForbiddenError when contestId is belong to different contest', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
      })
      contestService.getContestById.mockResolvedValue({ id: 'someotherid' })
      await expect(
        service.getContestProblemById(token, contestId, problemId)
      ).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('getContestProblemById should throw NoSuchProblem when user doesnt have ProblemsReadDisabled permission', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: problemId, contestId, disabled: true },
      ])
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
        contestId,
      })
      contestService.getContestById.mockResolvedValue({ id: contestId })
      await expect(
        service.getContestProblemById(token, contestId, problemId)
      ).rejects.toBeInstanceOf(NoSuchProblem)
    })

    test('getContestProblemById should returns disabled problem when user have ProblemsReadDisabled permission', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: problemId, contestId, disabled: true },
      ])
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead, Permission.ProblemsReadDisabled],
        contestId,
      })
      contestService.getContestById.mockResolvedValue({ id: contestId })
      await expect(
        service.getContestProblemById(token, contestId, problemId)
      ).resolves.toEqual({
        ...problemTemplate,
        id: problemId,
        contestId,
        disabled: true,
      })
    })

    test('getContestProblemById should resolve', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: problemId, contestId, disabled: false },
      ])
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
        contestId,
      })
      contestService.getContestById.mockResolvedValue({ id: contestId })
      await expect(
        service.getContestProblemById(token, contestId, problemId)
      ).resolves.toEqual({
        ...problemTemplate,
        id: problemId,
        contestId,
        disabled: false,
      })
    })
  })
})
