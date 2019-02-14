import { push } from 'connected-react-router'
import { Announcement } from '../../services/contest/Announcement'
import {
  AnnouncementSubscribeCallback,
  AnnouncementUbsubscribeFunction,
  ClarificationSubscribeCallback,
  ProblemIdsSubscribeCallback,
  ProblemIdsUnsubscribeFunction,
} from '../../services/contest/ContestService'
import { Problem } from '../../services/problem'
import { AppThunkAction } from '../../stores'
import {
  Clarification,
  Contest,
  readAnnouncements,
  setCurrentContest,
  setCurrentContestAnnouncements,
  setCurrentContestCurrentProblem,
  setCurrentContestProblems,
} from '../../stores/Contest'
import { setCurrentContestClarrifications } from '../../stores/Contest/ContestSetCurrentContestClarrifications'

export const getContestById = (id: number): AppThunkAction<Contest> => {
  return async (dispatch, _getState, { contestService }) => {
    const contest = await contestService.getContestDetailById(id)
    dispatch(setCurrentContest(contest))
    return contest
  }
}

export const getContestAnnouncements = (
  contestId: number
): AppThunkAction<Announcement[]> => {
  return async (dispatch, _getState, { contestService }) => {
    const announcements = await contestService.getContestAnnouncements(
      contestId
    )
    dispatch(setCurrentContestAnnouncements(contestId, announcements))
    return announcements
  }
}

export const subscribeContestAnnouncements = (
  contest: Contest,
  callback: AnnouncementSubscribeCallback
): AppThunkAction<AnnouncementUbsubscribeFunction> => {
  return async (_dispatch, _getState, { contestService }) => {
    return contestService.subscribeContestAnnouncements(contest.id, callback)
  }
}

export const readAnnouncementsAction = (
  contestId: number,
  ids: number[]
): AppThunkAction<void> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    await contestService.readContestAnnouncements(token, contestId, ids)
    dispatch(readAnnouncements(ids))
  }
}

export const getContestProblemsByIds = (
  contestId: number,
  problemIds: number[]
): AppThunkAction<Problem[]> => {
  return async (dispatch, _getState, { problemService }) => {
    const problems = await problemService.getProblemByIds(problemIds)
    dispatch(setCurrentContestProblems(contestId, problems, problemIds))
    return problems
  }
}

export const getContestProblems = (
  contestId: number
): AppThunkAction<Problem[]> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const problemIds = await contestService.getContestProblemIds(
      token,
      contestId
    )
    return dispatch(getContestProblemsByIds(contestId, problemIds))
  }
}

export const subscribeContestProblemIds = (
  contest: Contest,
  callback: ProblemIdsSubscribeCallback
): AppThunkAction<ProblemIdsUnsubscribeFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeContestProblemIds(
      token,
      contest.id,
      callback
    )
  }
}

export const loadContestProblem = (
  contestId: number,
  problemId: number
): AppThunkAction<void> => {
  return async dispatch => {
    dispatch(setCurrentContestCurrentProblem(contestId, problemId))
    dispatch(push(`/contests/${contestId}/problems/${problemId}`))
  }
}

export const getContestClarifications = (
  contestId: number
): AppThunkAction<Clarification[]> => {
  return async (dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    const clarifications = await contestService.getContestClarifications(
      token,
      contestId
    )
    dispatch(setCurrentContestClarrifications(contestId, clarifications))
    return clarifications
  }
}

export const subscribeContestClarifications = (
  contest: Contest,
  callback: ClarificationSubscribeCallback
): AppThunkAction<ProblemIdsUnsubscribeFunction> => {
  return async (_dispatch, getState, { contestService }) => {
    const token = getState().auth.token
    return contestService.subscribeContestClarifications(
      token,
      contest.id,
      callback
    )
  }
}
