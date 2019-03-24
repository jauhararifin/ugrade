import { User } from 'ugrade/services/auth'
import { Contest, Language } from './Contest'

export type SubscriptionCallback<T> = (newItem: T) => any
export type UnsubscriptionFunction = () => any

export interface ContestService {
  /**
   * Get all available languages that supported by ugrade system.
   * @returns List of Language that supported by ugrade.
   */
  getAvailableLanguages(): Promise<Language[]>

  /**
   * Get contest information by it's short id. Short id is used by user to
   * identify a contest. Short id is a unique identifier for contest that human
   * friendly.
   * @param shortId Short id of contest.
   * @returns Contest information
   */
  getContestByShortId(shortId: string): Promise<Contest>

  /**
   * Get user's contest by their token. Every authenticated user have a token
   * that identifies their session. This returns user's current contest info.
   * @param token User's session token
   * @returns User's curent contest
   */
  getMyContest(token: string): Promise<Contest>

  /**
   * Update contest information. To do this, user's need `info:update`
   * permission.
   * @param token User's session token to identify contest
   * @param name Contest name, Ignored when the value is undefined
   * @param shortDescription Contest short description, Short description will
   * shows in the login page after choose contest. Ignored when the value is
   * undefined
   * @param description Contest description. This contains markdown string that
   * describe the contest, may contains contest rule, price, etc.
   * @param startTime Contest start time, contest is considered started when
   * the current time is between `startTime` and `finishTime`
   * @param freezed Is contest freezed. When the contest freezed, scoreboard
   * will not updated when a user submit solutions.
   * @param finishTime Contest finish time, contest is considered started when
   * the current time is between `startTime` and `finishTime`. After finish,
   * contestant cannot submit solution.
   * @param permittedLanguages Contest permitted languages. All languages that
   * permitted to be used in the contest.
   * @returns The new contest information after updated
   */
  updateContestInfo(
    token: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    freezed: boolean,
    finishTime: Date,
    permittedLanguages: string[]
  ): Promise<Contest>

  subscribeMyContest(token: string, callback: SubscriptionCallback<Contest>): UnsubscriptionFunction

  createContest(
    email: string,
    shortId: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    finishTime: Date,
    permittedLanguages?: string[]
  ): Promise<[Contest, User]>
}
