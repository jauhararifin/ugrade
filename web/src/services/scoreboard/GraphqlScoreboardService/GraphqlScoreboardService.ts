import { Scoreboard } from '../Scoreboard'
import { ScoreboardCallback, ScoreboardService, ScoreboardUnsubscribe } from '../ScoreboardService'

export class GraphqlScoreboardService implements ScoreboardService {
  // TODO: implement
  async getScoreboard(_token: string): Promise<Scoreboard> {
    return {
      contestId: '',
      lastUpdated: new Date(),
      freezed: true,
      entries: [],
    }
  }

  // TODO: implement
  subscribeScoreboard(_token: string, _callback: ScoreboardCallback): ScoreboardUnsubscribe {
    return () => null
  }
}
