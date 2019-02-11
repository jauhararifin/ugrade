import { Announcement, Contest, Problem } from './ContestState'

export enum ContestActionType {
  SetContests = 'CONTEST_SET_CONTESTS',
  SetCurrentContest = 'CONTEST_SET_CURRENT_CONTEST',
  SetCurrentContestAnnouncements = 'CONTEST_SET_CURRENT_CONTEST_ANNOUNCEMENTS',
  SetCurrentContestProblems = 'CONTEST_SET_CURRENT_CONTEST_PROBLEMS',
  SetCurrentContestCurrentProblem = 'CONTEST_SET_CURRENT_CONTEST_CURRENT_PROBLEM',
  ReadAnnouncements = 'CONTEST_READ_ANNOUNCEMENTS',
}

export interface ContestActionSetContests {
  type: ContestActionType.SetContests
  contests: Contest[]
}

export const setContests = (contests: Contest[]): ContestActionSetContests => ({
  type: ContestActionType.SetContests,
  contests,
})

export interface ContestActionSetCurrentContest {
  type: ContestActionType.SetCurrentContest
  contest: Contest
}

export const setCurrentContest = (
  contest: Contest
): ContestActionSetCurrentContest => ({
  type: ContestActionType.SetCurrentContest,
  contest,
})

export interface ContestActionSetCurrentContestAnnouncements {
  type: ContestActionType.SetCurrentContestAnnouncements
  contestId: number
  announcements: Announcement[]
}

export const setCurrentContestAnnouncements = (
  contest: number | Contest,
  announcements: Announcement[]
): ContestActionSetCurrentContestAnnouncements => ({
  type: ContestActionType.SetCurrentContestAnnouncements,
  contestId: typeof contest === 'number' ? contest : contest.id,
  announcements,
})

export interface ContestActionSetCurrentContestProblems {
  type: ContestActionType.SetCurrentContestProblems
  contestId: number
  problems: Problem[]
  problemOrder: number[]
}

export const setCurrentContestProblems = (
  contest: number | Contest,
  problems: Problem[],
  problemOrder: number[]
): ContestActionSetCurrentContestProblems => ({
  type: ContestActionType.SetCurrentContestProblems,
  contestId: typeof contest === 'number' ? contest : contest.id,
  problems,
  problemOrder,
})

export interface ContestActionSetCurrentContestCurrentProblem {
  type: ContestActionType.SetCurrentContestCurrentProblem
  contestId: number
  problem: number | Problem
}

export const setCurrentContestCurrentProblem = (
  contest: number | Contest,
  problem: number | Problem
): ContestActionSetCurrentContestCurrentProblem => ({
  type: ContestActionType.SetCurrentContestCurrentProblem,
  contestId: typeof contest === 'number' ? contest : contest.id,
  problem,
})

export interface ContestActionReadAnnouncements {
  type: ContestActionType.ReadAnnouncements
  announcements: number[]
}

export const readAnnouncements = (
  announcements: number[]
): ContestActionReadAnnouncements => ({
  type: ContestActionType.ReadAnnouncements,
  announcements,
})

export type ContestAction =
  | ContestActionSetContests
  | ContestActionSetCurrentContest
  | ContestActionSetCurrentContestAnnouncements
  | ContestActionSetCurrentContestProblems
  | ContestActionSetCurrentContestCurrentProblem
  | ContestActionReadAnnouncements
