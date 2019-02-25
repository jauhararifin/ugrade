import { push } from 'connected-react-router'
import moment from 'moment'

import { AppThunkAction } from '../../../stores'
import { setMe } from '../../../stores/Auth'
import { setInfo } from '../../../stores/Contest'

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
