import { Announcement } from './Announcement'
import { Clarification } from './Clarification'
import { Contest, ContestDetail } from './Contest'

export type AnnouncementSubscribeCallback = (
  announcements: Announcement[]
) => any

export type AnnouncementUbsubscribeFunction = () => any

export type ProblemIdsSubscribeCallback = (problemIds: number[]) => any

export type ProblemIdsUnsubscribeFunction = () => any

export type ClarificationSubscribeCallback = (
  clarifications: Clarification[]
) => any

export type ClarificationUnsubscribeFunction = () => any

export interface ContestService {
  getAllContests(): Promise<Contest[]>
  getContestDetailById(id: number): Promise<ContestDetail>

  registerContest(token: string, contestId: number): Promise<void>
  unregisterContest(token: string, contestId: number): Promise<void>

  getContestAnnouncements(contestId: number): Promise<Announcement[]>

  subscribeContestAnnouncements(
    contestId: number,
    callback: AnnouncementSubscribeCallback
  ): AnnouncementUbsubscribeFunction

  readContestAnnouncements(
    token: string,
    contestId: number,
    id: number[]
  ): Promise<void>

  getContestProblemIds(token: string, contestId: number): Promise<number[]>

  subscribeContestProblemIds(
    token: string,
    contestId: number,
    callback: ProblemIdsSubscribeCallback
  ): ProblemIdsUnsubscribeFunction

  getContestClarifications(
    token: string,
    contestId: number
  ): Promise<Clarification[]>

  subscribeContestClarifications(
    token: string,
    contestId: number,
    callback: ClarificationSubscribeCallback
  ): Promise<ClarificationUnsubscribeFunction>

  createContestClarification(
    token: string,
    contestId: number,
    title: string,
    subject: string,
    content: string
  ): Promise<Clarification>

  createContestClarificationEntry(
    token: string,
    contestId: number,
    clarificationId: number,
    content: string
  ): Promise<Clarification>

  readContestClarificationEntries(
    token: string,
    contestId: number,
    clarificationId: number,
    entryIds: number[]
  ): Promise<Clarification>
}
