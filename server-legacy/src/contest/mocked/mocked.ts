import { ContestService } from '../service'

export interface MockedContestService extends ContestService {
  getContestById: jest.Mock
  getContestByShortId: jest.Mock
  createContest: jest.Mock
  setMyContest: jest.Mock
}

export function mockContestService(): MockedContestService {
  return {
    getContestById: jest.fn(),
    getContestByShortId: jest.fn(),
    createContest: jest.fn(),
    setMyContest: jest.fn(),
  }
}
