import { AppThunkAction } from '../../stores'
import { Contest, setContests } from '../../stores/Contest'

export const getContestsAction = (): AppThunkAction<Contest[]> => {
  return async (dispatch, _, { contestService }) => {
    const contests = await contestService.getAllContests()
    dispatch(setContests(contests))
    return contests
  }
}
