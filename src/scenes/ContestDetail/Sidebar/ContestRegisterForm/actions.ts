import { AppThunkAction } from '../../../../stores'
import { setCurrentContest } from '../../../../stores/Contest'

export const registerContest = (contestId: number): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    await contestService.registerContest(token, contestId)
    const currentContest = getState().contest.currentContest
    if (currentContest && currentContest.id === contestId) {
      dispatch(setCurrentContest({ ...currentContest, registered: true }))
    }
  }
}

export const unregisterContest = (contestId: number): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    await contestService.unregisterContest(token, contestId)
    const currentContest = getState().contest.currentContest
    if (currentContest && currentContest.id === contestId) {
      dispatch(setCurrentContest({ ...currentContest, registered: false }))
    }
  }
}
