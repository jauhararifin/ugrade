import { ProblemService } from '../service'

export interface MockedProblemService extends ProblemService {
  getContestProblems: jest.Mock
  getContestProblemById: jest.Mock
  createProblem: jest.Mock
  updateProblem: jest.Mock
  deleteProblem: jest.Mock
}

export function mockProblemService(): MockedProblemService {
  return {
    getContestProblems: jest.fn(),
    getContestProblemById: jest.fn(),
    createProblem: jest.fn(),
    updateProblem: jest.fn(),
    deleteProblem: jest.fn(),
  }
}
