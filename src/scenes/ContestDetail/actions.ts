import { AppThunkAction } from "../../stores"
import { Contest, setCurrentContest } from "../../stores/Contest"

export const getContestById = (id: number): AppThunkAction<Contest> => {
    return async (dispatch, getState, { contestService }) => {
        const contest = await contestService.getContestById(id)
        await dispatch(setCurrentContest(contest))
        return contest
    }
}
