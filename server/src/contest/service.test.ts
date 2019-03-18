import { InMemoryAuthService } from 'ugrade/auth/inmemory'
import { InMemoryLanguageService } from 'ugrade/language/inmemory'
import { Contest } from './contest'
import { InMemoryContestService } from './inmemory'

describe('contest service test', () => {
  const contest1: Contest = {
    id: 'somerandom32bytestring0123456789',
    shortId: 'some-short-id',
    name: 'Fake contest',
    startTime: new Date(),
    finishTime: new Date(Date.now() + 100000),
    permittedLanguageIds: [],
    shortDescription: 'short desc',
    description: 'desc',
    freezed: false,
  }

  const createService = () =>
    new InMemoryContestService(
      new InMemoryAuthService(),
      new InMemoryLanguageService()
    )

  test('can create', async () => {
    const service = createService()
    const contest = await service.createContest(
      'fake@email.com',
      contest1.shortId,
      contest1.name,
      contest1.shortDescription,
      contest1.description,
      contest1.startTime,
      contest1.finishTime,
      []
    )

    const actual = {
      shortId: contest.shortId,
      name: contest.name,
      startTime: contest.startTime,
      finishTime: contest.finishTime,
      permittedLanguageIds: contest.permittedLanguageIds,
    }
    const expected = {
      shortId: contest1.shortId,
      name: contest1.name,
      startTime: contest1.startTime,
      finishTime: contest1.finishTime,
      permittedLanguageIds: contest1.permittedLanguageIds,
    }

    expect(actual).toEqual(expected)
  })
})
