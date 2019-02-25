import { push } from 'connected-react-router'
import { AppThunkAction } from '../../../stores'
import { setInfo } from '../../../stores/Contest'

export function setContestAction(contestId: string): AppThunkAction {
  return async (dispatch, _getState, { contestService }) => {
    const contest = await contestService.getContestByShortId(contestId)
    dispatch(setInfo(contest))
    dispatch(push('/enter-contest/enter-email'))
  }
}
