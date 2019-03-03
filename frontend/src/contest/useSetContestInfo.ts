import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'

export function setContestInfoAction(): AppThunkAction {
  return async (_dispatch, getState, _extras) => {
    getState()
  }
}

export function useSetContestInfo() {
  const dispatch = useAppThunkDispatch()
  return () => dispatch(setContestInfoAction())
}
