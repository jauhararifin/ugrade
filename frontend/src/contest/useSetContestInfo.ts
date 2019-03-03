import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/store'
import { Language, setInfo } from './store'

export function setContestInfoAction(
  name?: string,
  shortDescription?: string,
  description?: string,
  startTime?: Date,
  freezed?: boolean,
  finishTime?: Date,
  permittedLanguages?: Language[]
): AppThunkAction {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const contest = await contestService.updateContestInfo(
      token,
      name,
      shortDescription,
      description,
      startTime,
      freezed,
      finishTime,
      permittedLanguages
    )
    dispatch(setInfo(contest))
  }
}

export function useSetContestInfo() {
  const dispatch = useAppThunkDispatch()
  return (
    name?: string,
    shortDescription?: string,
    description?: string,
    startTime?: Date,
    freezed?: boolean,
    finishTime?: Date,
    permittedLanguages?: Language[]
  ) =>
    dispatch(
      setContestInfoAction(
        name,
        shortDescription,
        description,
        startTime,
        freezed,
        finishTime,
        permittedLanguages
      )
    )
}
