import { ForbiddenAction, NoSuchUser, Permission } from 'ugrade/auth'
import { mockAuthService, MockedAuthService } from 'ugrade/auth/mocked'
import { NoSuchContest } from 'ugrade/contest'
import { mockContestService, MockedContestService } from 'ugrade/contest/mocked'
import { ValidationError } from 'yup'
import { AlreadyUsedId } from '../AlreadUsedId'
import { NoSuchProblem } from '../NoSuchProblem'
import { Problem, ProblemType } from '../problem'
import { InMemoryProblemService } from './inmemory'

describe('test in memory problem service', () => {
  const getService = (problems: Problem[] = []): [InMemoryProblemService, MockedAuthService, MockedContestService] => {
    const authService = mockAuthService()
    const contestService = mockContestService()
    const problemService = new InMemoryProblemService(authService, contestService, problems)
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
      await expect(service.getContestProblems('ivalidtoken', 'invalidcid')).rejects.toBeInstanceOf(ValidationError)

      await service.getContestProblems(token, token).catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('getContestProblems should throw ForbiddenAction when user doesnt has ProblemsRead permission', async () => {
      const [service, authService] = getService()
      authService.getMe.mockResolvedValue({ permissions: [] })
      await expect(service.getContestProblems(token, token)).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('getContestProblems should throw NoSuchContest when no contest is found', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
      })
      contestService.getContestById.mockRejectedValue(new NoSuchContest())
      await expect(service.getContestProblems(token, token)).rejects.toBeInstanceOf(NoSuchContest)
    })

    test('getContestProblems should throw ForbiddenError when contestId is belong to different contest', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
      })
      contestService.getContestById.mockResolvedValue({ id: 'someotherid' })
      await expect(service.getContestProblems(token, token)).rejects.toBeInstanceOf(ForbiddenAction)
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
      expect(result.map(r => r.id)).toEqual(['id1', 'id2', 'id3', 'id4', 'id5', 'id6'])
    })
  })

  describe('test getContestProblemById', () => {
    test('getContestProblemById validation', async () => {
      const [service, _] = getService()
      await expect(service.getContestProblemById('ivalidtoken', 'invalidcid', 'invalidpid')).rejects.toBeInstanceOf(
        ValidationError
      )

      await service
        .getContestProblemById(token, contestId, problemId)
        .catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('getContestProblemById should throw ForbiddenAction when user doesnt has ProblemsRead permission', async () => {
      const [service, authService] = getService()
      authService.getMe.mockResolvedValue({ permissions: [] })
      await expect(service.getContestProblemById(token, contestId, problemId)).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('getContestProblemById should throw NoSuchContest when no contest is found', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
      })
      contestService.getContestById.mockRejectedValue(new NoSuchContest())
      await expect(service.getContestProblemById(token, contestId, problemId)).rejects.toBeInstanceOf(NoSuchContest)
    })

    test('getContestProblemById should throw ForbiddenError when contestId is belong to different contest', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead],
      })
      contestService.getContestById.mockResolvedValue({ id: 'someotherid' })
      await expect(service.getContestProblemById(token, contestId, problemId)).rejects.toBeInstanceOf(ForbiddenAction)
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
      await expect(service.getContestProblemById(token, contestId, problemId)).rejects.toBeInstanceOf(NoSuchProblem)
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
      await expect(service.getContestProblemById(token, contestId, problemId)).resolves.toEqual({
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
      await expect(service.getContestProblemById(token, contestId, problemId)).resolves.toEqual({
        ...problemTemplate,
        id: problemId,
        contestId,
        disabled: false,
      })
    })
  })

  describe('test createProblem', () => {
    type argsT = [string, string, string, string, ProblemType, boolean, number, number, number, number]
    const argsTemplate: argsT = [
      token,
      'some-problem-id',
      'name',
      'stmt',
      ProblemType.Batch,
      true,
      1000,
      1.1,
      16 * 1024 * 1024,
      2,
    ]

    test('createProblem validation', async () => {
      const [service, _] = getService()
      await expect(
        service.createProblem('ivalidtoken', 'sid', '', '', ProblemType.Batch, true, 1, 1, 1, 1)
      ).rejects.toBeInstanceOf(ValidationError)

      await service.createProblem(...argsTemplate).catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('createProblem should throw ForbiddenAction when user doesnt has ProblemsCreate permission', async () => {
      const [service, authService] = getService()
      authService.getMe.mockResolvedValue({ permissions: [] })
      await expect(service.createProblem(...argsTemplate)).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('createProblem should throw AlreadyUsedId when shortId already used', async () => {
      const [service, authService] = getService([{ ...problemTemplate, contestId: 'cid1', shortId: 'some-short-id-1' }])
      authService.getMe.mockResolvedValue({ contestId: 'cid1', permissions: [Permission.ProblemsCreate] })
      const args = [...argsTemplate] as argsT
      args[1] = 'some-short-id-1'
      await expect(service.createProblem(...args)).rejects.toBeInstanceOf(AlreadyUsedId)
    })

    test('createProblem should resolved', async () => {
      const [service, authService] = getService([{ ...problemTemplate, contestId, shortId: 'some-short-id-1' }])
      authService.getMe.mockResolvedValue({ contestId, id: 'uid1', permissions: [Permission.ProblemsCreate] })
      const args = [...argsTemplate] as argsT
      args[1] = 'problem1' // shortId
      args[5] = false // enable
      const result = await service.createProblem(...args)
      expect(result.name).toEqual(args[2])
      expect(result.contestId).toEqual(contestId)
      expect(result.issuerId).toEqual('uid1')

      authService.getMe.mockResolvedValue({ contestId, id: 'uid1', permissions: [Permission.ProblemsRead] })
      const result2 = await service.getContestProblemById(token, contestId, result.id)
      expect(result2).toEqual(result)
    })
  })

  describe('test updateProblem', () => {
    type argsT = [string, string, string, string, ProblemType, boolean, number, number, number, number, number]
    const argsTemplate: argsT = [
      token,
      problemId,
      'name',
      'stmt',
      ProblemType.Batch,
      true,
      7,
      1000,
      1.1,
      16 * 1024 * 1024,
      2,
    ]

    test('updateProblem validation', async () => {
      const [service, _] = getService()
      await expect(
        service.updateProblem('ivalidtoken', 'sid', '', '', ProblemType.Batch, true, 7, 1, 1, 1, 1)
      ).rejects.toBeInstanceOf(ValidationError)

      await service.updateProblem(...argsTemplate).catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('updateProblem should throw ForbiddenAction when user doesnt has ProblemsUpdate permission', async () => {
      const [service, authService] = getService()
      authService.getMe.mockResolvedValue({ permissions: [] })
      await expect(service.updateProblem(...argsTemplate)).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('updateProblem should throw NoSuchContest when no contest is found', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        contestId,
        permissions: [Permission.ProblemsRead, Permission.ProblemsUpdate],
      })
      contestService.getContestById.mockRejectedValue(new NoSuchContest())
      await expect(service.updateProblem(...argsTemplate)).rejects.toBeInstanceOf(NoSuchContest)
    })

    test('updateProblem should throw NoSuchProblem when problem belong to different contest', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: problemId, contestId: 'some-other-contest', disabled: false },
      ])
      authService.getMe.mockResolvedValue({
        contestId,
        permissions: [Permission.ProblemsRead, Permission.ProblemsUpdate],
      })
      contestService.getContestById.mockResolvedValue({ id: 'someotherid' })
      await expect(service.updateProblem(...argsTemplate)).rejects.toBeInstanceOf(NoSuchProblem)
    })

    test('updateProblem should throw NoSuchProblem when user doesnt have ProblemsReadDisabled permission', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: problemId, contestId, disabled: true },
      ])
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead, Permission.ProblemsUpdate],
        contestId,
      })
      contestService.getContestById.mockResolvedValue({ id: contestId })
      await expect(service.updateProblem(...argsTemplate)).rejects.toBeInstanceOf(NoSuchProblem)
    })

    test('updateProblem should resolved', async () => {
      const [service, authService] = getService([
        { ...problemTemplate, id: problemId, issuerId: 'uuu', contestId, shortId: 'some-short-id-1', disabled: false },
      ])
      authService.getMe.mockResolvedValue({
        contestId,
        permissions: [Permission.ProblemsRead, Permission.ProblemsUpdate],
      })
      const args = [...argsTemplate] as argsT
      args[2] = 'new name'
      args[5] = false // enable
      const result = await service.updateProblem(...args)
      expect(result.name).toEqual(args[2])
      expect(result.contestId).toEqual(contestId)
      expect(result.issuerId).toEqual('uuu')

      authService.getMe.mockResolvedValue({ contestId, id: 'uid1', permissions: [Permission.ProblemsRead] })
      const result2 = await service.getContestProblemById(token, contestId, result.id)
      expect(result2).toEqual(result)
    })
  })

  describe('test deleteProblem', () => {
    test('deleteProblem validation', async () => {
      const [service, _] = getService()
      await expect(service.deleteProblem('ivalidtoken', 'invalidpid')).rejects.toBeInstanceOf(ValidationError)
      await service.deleteProblem(token, contestId).catch(err => expect(err).not.toBeInstanceOf(ValidationError))
    })

    test('deleteProblem should throw ForbiddenAction when user doesnt has ProblemsDelete permission', async () => {
      const [service, authService] = getService()
      authService.getMe.mockResolvedValue({ permissions: [] })
      await expect(service.deleteProblem(token, problemId)).rejects.toBeInstanceOf(ForbiddenAction)
    })

    test('deleteProblem should throw NoSuchContest when no contest is found', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        contestId: 'somefakecontestidthat32bytelong0',
        permissions: [Permission.ProblemsRead, Permission.ProblemsDelete],
      })
      contestService.getContestById.mockRejectedValue(new NoSuchContest())
      await expect(service.deleteProblem(token, problemId)).rejects.toBeInstanceOf(NoSuchContest)
    })

    test('deleteProblem should throw NoSuchProblem when contestId is belong to different contest', async () => {
      const [service, authService, contestService] = getService()
      authService.getMe.mockResolvedValue({
        contestId: 'somefakecontestidthat32bytelong0',
        permissions: [Permission.ProblemsRead, Permission.ProblemsDelete],
      })
      contestService.getContestById.mockResolvedValue({ id: 'someotherid' })
      await expect(service.deleteProblem(token, problemId)).rejects.toBeInstanceOf(NoSuchProblem)
    })

    test('deleteProblem should throw NoSuchProblem when user doesnt have ProblemsReadDisabled permission', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: problemId, contestId, disabled: true },
      ])
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead, Permission.ProblemsDelete],
        contestId,
      })
      contestService.getContestById.mockResolvedValue({ id: contestId })
      await expect(service.deleteProblem(token, problemId)).rejects.toBeInstanceOf(NoSuchProblem)
    })

    test('deleteProblem should resolve', async () => {
      const [service, authService, contestService] = getService([
        { ...problemTemplate, id: problemId, contestId, disabled: false },
      ])
      authService.getMe.mockResolvedValue({
        permissions: [Permission.ProblemsRead, Permission.ProblemsDelete],
        contestId,
      })
      contestService.getContestById.mockResolvedValue({ id: contestId })
      const deleteResult = await service.deleteProblem(token, problemId)
      expect(deleteResult).toEqual({
        ...problemTemplate,
        id: problemId,
        contestId,
        disabled: false,
      })

      await expect(service.getContestProblemById(token, contestId, deleteResult.id)).rejects.toBeInstanceOf(
        NoSuchProblem
      )
    })
  })
})
