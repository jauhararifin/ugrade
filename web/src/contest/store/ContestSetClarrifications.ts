import lodash from 'lodash'
import { ContestActionType } from './ContestAction'
import { Clarification, ContestState } from './ContestState'

export interface ContestSetClarifications {
  type: ContestActionType.SetClarifications
  clarifications: Clarification[]
}

export function setClarifications(clarifications: Clarification[]): ContestSetClarifications {
  return {
    type: ContestActionType.SetClarifications,
    clarifications,
  }
}

export function setClarrificationsReducer(state: ContestState, action: ContestSetClarifications): ContestState {
  const nextState = lodash.cloneDeep(state)
  const clarifications = nextState.clarifications || {}
  for (const newClarif of action.clarifications) {
    if (newClarif.id in clarifications) {
      const oldClarif = clarifications[newClarif.id]
      const nextClarif = {
        ...oldClarif,
        ...newClarif,
        entries: { ...oldClarif.entries, ...newClarif.entries },
      }
      clarifications[newClarif.id] = nextClarif
    } else {
      clarifications[newClarif.id] = newClarif
    }
  }
  nextState.clarifications = clarifications
  return nextState
}
