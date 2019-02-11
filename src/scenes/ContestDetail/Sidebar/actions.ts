import { AppThunkAction } from '../../../stores'
import { Contest, setCurrentContest } from '../../../stores/Contest'

export const getContestById = (id: number): AppThunkAction<Contest> => {
  return async (dispatch, _, { contestService }) => {
    const contest = await contestService.getContestById(id)
    dispatch(setCurrentContest(contest))
    return contest
  }
}
