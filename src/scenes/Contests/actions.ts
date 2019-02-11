import { AppThunkAction } from '../../stores'
import { Contest, setContests } from '../../stores/Contest'

export const getContestsAction = (): AppThunkAction<Contest[]> => {
  return async (dispatch, getState, { contestService }) => {
    const contests = await contestService.getAllContests()
    await dispatch(setContests(contests))
    return contests
  }
}
