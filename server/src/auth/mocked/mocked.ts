import { AuthService } from '../service'

export interface MockedAuthService extends AuthService {
  signin: jest.Mock
  signup: jest.Mock
  forgotPassword: jest.Mock
  resetPassword: jest.Mock
  addUser: jest.Mock
  addContest: jest.Mock
  setMyPassword: jest.Mock
  setMyName: jest.Mock
  setPermissions: jest.Mock
  getMe: jest.Mock
  getUserById: jest.Mock
  getUserByEmail: jest.Mock
  getUserByUsername: jest.Mock
}

export function mockAuthService(): MockedAuthService {
  return {
    signin: jest.fn(),
    signup: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    addUser: jest.fn(),
    addContest: jest.fn(),
    setMyPassword: jest.fn(),
    setMyName: jest.fn(),
    setPermissions: jest.fn(),
    getMe: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByUsername: jest.fn(),
  }
}
