import { ContestActionType } from './ContestAction'
import { ContestState, Scoreboard } from './ContestState'

export interface ContestSetScoreboard {
  type: ContestActionType.SetScoreboard
  scoreboard: Scoreboard
}

export function setScoreboard(scoreboard: Scoreboard): ContestSetScoreboard {
  return {
    type: ContestActionType.SetScoreboard,
    scoreboard,
  }
}

export function setScoreboardReducer(
  state: ContestState,
  action: ContestSetScoreboard
): ContestState {
  return {
    ...state,
    scoreboard: action.scoreboard,
  }
}
