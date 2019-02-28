import { push } from 'connected-react-router'
import moment from 'moment'
import { useAppThunkDispatch } from 'ugrade/common'
import { AppThunkAction } from 'ugrade/stores'
import { setMe } from 'ugrade/stores/Auth'
import { setInfo } from 'ugrade/stores/Contest'

export function createContestAction(
  email: string,
  contestShortId: string,
  contestName: string,
  shortDescription?: string
): AppThunkAction {
  return async (dispatch, getState, { contestService }) => {
    if (!shortDescription || shortDescription.length === 0) {
      shortDescription = `Just another competitive programming contest`
    }
    const description = `Your new competitive programming contest`
    const serverDate = getState().server.clock || new Date()
    const localDate = getState().server.localClock || new Date()
    const startMoment = moment(
      new Date().getTime() - localDate.getTime() + serverDate.getTime()
    ).add(10, 'days')
    const startDate = startMoment.toDate()
    const finishDate = startMoment.add(5, 'days').toDate()

    const [contest, user] = await contestService.createContest(
      email,
      contestShortId,
      contestName,
      shortDescription,
      description,
      startDate,
      finishDate
    )
    dispatch(setInfo(contest))
    dispatch(setMe(user))
    dispatch(push('/enter-contest/signup'))
  }
}

export function useCreateContest() {
  const dispatch = useAppThunkDispatch()
  return (
    email: string,
    contestShortId: string,
    contestName: string,
    shortDescription?: string
  ) => {
    return dispatch(
      createContestAction(email, contestShortId, contestName, shortDescription)
    )
  }
}
