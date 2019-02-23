import { Contest } from '../../services/contest/Contest'
import { AppThunkAction } from '../../stores'

export const enterContest = (contestId: string): AppThunkAction<Contest> => {
  return async (_dispatch, _getState, { contestService }) => {
    const contest = await contestService.getContestByShortId(contestId)
    return contest
  }
}

export const enterUser = (
  contestId: string,
  email: string
): AppThunkAction<boolean> => {
  return async (_dispatch, _getState, { authService }) => {
    return authService.isRegistered(contestId, email)
  }
}

export const signUp = (
  contestId: string,
  email: string,
  username: string,
  name: string,
  password: string
): AppThunkAction<string> => {
  return async (_dispatch, _getState, { authService }) => {
    return authService.signup(contestId, username, email, password, name)
  }
}

export const signIn = (
  contestId: string,
  email: string,
  password: string
): AppThunkAction<string> => {
  return async (_dispatch, _getState, { authService }) => {
    return authService.signin(contestId, email, password)
  }
}
