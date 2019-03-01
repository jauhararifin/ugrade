import { ContestReadAnnouncements } from './ContestReadAnnouncements'
import { ContestSetAnnouncements } from './ContestSetAnnouncements'
import { ContestSetClarifications } from './ContestSetClarrifications'
import { ContestSetInfo } from './ContestSetInfo'
import { ContestSetProblems } from './ContestSetProblems'
import { ContestSetRegistered } from './ContestSetRegistered'
import { ContestSetSubmissions } from './ContestSetSubmissions'
import { ContestUnsetContest } from './ContestUnsetContest'

export enum ContestActionType {
  SetInfo = 'CONTEST_SET_INFO',
  SetRegistered = 'CONTEST_SET_REGISTERED',
  UnsetContest = 'CONTEST_UNSET_CONTEST',
  SetAnnouncements = 'CONTEST_SET_ANNOUNCEMENTS',
  SetProblems = 'CONTEST_SET_PROBLEMS',
  SetClarifications = 'CONTEST_SET_CLARIFICATIONS',
  SetSubmissions = 'CONTEST_SET_SUBMISSIONS',
  ReadAnnouncements = 'CONTEST_READ_ANNOUNCEMENTS',
}

export type ContestAction =
  | ContestSetInfo
  | ContestSetRegistered
  | ContestUnsetContest
  | ContestSetAnnouncements
  | ContestSetProblems
  | ContestSetClarifications
  | ContestReadAnnouncements
  | ContestSetSubmissions
