import { Scoreboard } from './Scoreboard'

export type ScoreboardCallback = (scoreboard: Scoreboard) => any

export type ScoreboardUnsubscribe = () => any

export interface ScoreboardService {
  getScoreboard(token: string): Promise<Scoreboard>

  subscribeScoreboard(
    token: string,
    callback: ScoreboardCallback
  ): ScoreboardUnsubscribe
}
