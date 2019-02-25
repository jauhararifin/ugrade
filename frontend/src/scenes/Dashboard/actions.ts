import { AppThunkAction } from '../../stores'
import {
  ContestInfo,
  Problem,
  setInfo,
  setProblems,
} from '../../stores/Contest'

export const getMyContestAction = (): AppThunkAction<ContestInfo> => {
  return async (dispatch, getState, { contestService }) => {
    const contest = getState().contest.info
    if (!contest) {
      const token = getState().auth.token
      const myContest = await contestService.getMyContest(token)
      dispatch(setInfo(myContest))
      return myContest
    }
    return contest
  }
}

// export const getContestById = (id: number): AppThunkAction<Contest> => {
//   return async (dispatch, _getState, { contestService }) => {
//     const contest = await contestService.getContestDetailById(id)
//     dispatch(setCurrentContest(contest))
//     return contest
//   }
// }

// export const getContestAnnouncements = (
//   contestId: number
// ): AppThunkAction<Announcement[]> => {
//   return async (dispatch, _getState, { contestService }) => {
//     const announcements = await contestService.getContestAnnouncements(
//       contestId
//     )
//     dispatch(setCurrentContestAnnouncements(contestId, announcements))
//     return announcements
//   }
// }

// export const subscribeContestAnnouncements = (
//   contest: Contest,
//   callback: AnnouncementSubscribeCallback
// ): AppThunkAction<AnnouncementUbsubscribeFunction> => {
//   return async (_dispatch, _getState, { contestService }) => {
//     return contestService.subscribeContestAnnouncements(contest.id, callback)
//   }
// }

// export const readAnnouncementsAction = (
//   contestId: number,
//   ids: number[]
// ): AppThunkAction<void> => {
//   return async (dispatch, getState, { contestService }) => {
//     const token = getState().auth.token
//     await contestService.readContestAnnouncements(token, contestId, ids)
//     dispatch(readAnnouncements(ids))
//   }
// }

// export const getContestProblemsByIds = (
//   contestId: number,
//   problemIds: number[]
// ): AppThunkAction<Problem[]> => {
//   return async (dispatch, _getState, { problemService }) => {
//     const problems = await problemService.getProblemByIds(problemIds)
//     dispatch(setCurrentContestProblems(contestId, problems, problemIds))
//     return problems
//   }
// }

export const getContestProblems = (): AppThunkAction<Problem[]> => {
  return async (dispatch, getState, { problemService, contestService }) => {
    const token = getState().auth.token
    const problemIds = await contestService.getProblemIds(token)
    const problems = await problemService.getProblemByIds(token, problemIds)
    const result = problems.map(
      (prob): Problem => ({
        ...prob,
        order: problemIds.indexOf(prob.id),
      })
    )
    console.log(result)
    dispatch(setProblems(result))
    return result
  }
}

// export const subscribeContestProblemIds = (
//   contest: Contest,
//   callback: ProblemIdsSubscribeCallback
// ): AppThunkAction<ProblemIdsUnsubscribeFunction> => {
//   return async (_dispatch, getState, { contestService }) => {
//     const token = getState().auth.token
//     return contestService.subscribeContestProblemIds(
//       token,
//       contest.id,
//       callback
//     )
//   }
// }

// export const loadContestProblem = (
//   contestId: number,
//   problemId: number
// ): AppThunkAction<void> => {
//   return async dispatch => {
//     dispatch(setCurrentContestCurrentProblem(contestId, problemId))
//     dispatch(push(`/contests/${contestId}/problems/${problemId}`))
//   }
// }

// export const getContestClarifications = (
//   contestId: number
// ): AppThunkAction<Clarification[]> => {
//   return async (dispatch, getState, { contestService }) => {
//     const token = getState().auth.token
//     const clarifications = await contestService.getContestClarifications(
//       token,
//       contestId
//     )
//     dispatch(setCurrentContestClarrifications(contestId, clarifications))
//     return clarifications
//   }
// }

// export const subscribeContestClarifications = (
//   contest: Contest,
//   callback: ClarificationSubscribeCallback
// ): AppThunkAction<ProblemIdsUnsubscribeFunction> => {
//   return async (_dispatch, getState, { contestService }) => {
//     const token = getState().auth.token
//     return contestService.subscribeContestClarifications(
//       token,
//       contest.id,
//       callback
//     )
//   }
// }
