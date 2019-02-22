import { ContestReadAnnouncements } from './ContestReadAnnouncements'
import { ContestSetContests } from './ContestSetContests'
import { ContestSetCurrentContest } from './ContestSetCurrentContest'
import { ContestSetCurrentContestAnnouncements } from './ContestSetCurrentContestAnnouncements'
import { ContestSetCurrentContestClarifications } from './ContestSetCurrentContestClarrifications'
import { ContestSetCurrentContestCurrentProblem } from './ContestSetCurrentContestCurrentProblem'
import { ContestSetCurrentContestProblems } from './ContestSetCurrentContestProblems'
import { ContestSetCurrentContestSubmissions } from './ContestSetCurrentContestSubmissions'
import { ContestUnsetCurrentContest } from './ContestUnsetCurrentContest'

export enum ContestActionType {
  SetContests = 'CONTEST_SET_CONTESTS',
  SetCurrentContest = 'CONTEST_SET_CURRENT_CONTEST',
  UnsetCurrentContest = 'CONTEST_UNSET_CURRENT_CONTEST',
  SetCurrentContestAnnouncements = 'CONTEST_SET_CURRENT_CONTEST_ANNOUNCEMENTS',
  SetCurrentContestProblems = 'CONTEST_SET_CURRENT_CONTEST_PROBLEMS',
  SetCurrentContestClarifications = 'CONTEST_SET_CURRENT_CONTEST_CLARIFICATIONS',
  SetCurrentContestCurrentProblem = 'CONTEST_SET_CURRENT_CONTEST_CURRENT_PROBLEM',
  SetCurrentContestSubmissions = 'CONTEST_SET_CURRENT_CONTEST_SUBMISSIONS',
  ReadAnnouncements = 'CONTEST_READ_ANNOUNCEMENTS',
}

export type ContestAction =
  | ContestSetContests
  | ContestSetCurrentContest
  | ContestUnsetCurrentContest
  | ContestSetCurrentContestAnnouncements
  | ContestSetCurrentContestProblems
  | ContestSetCurrentContestClarifications
  | ContestSetCurrentContestCurrentProblem
  | ContestReadAnnouncements
  | ContestSetCurrentContestSubmissions
