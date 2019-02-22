import { ContestActionType } from './ContestAction'
import { Clarification, ClarificationEntry, ContestState } from './ContestState'

export interface ContestSetCurrentContestClarifications {
  type: ContestActionType.SetCurrentContestClarifications
  contestId: number
  clarifications: Clarification[]
}

export function setCurrentContestClarrifications(
  contestId: number,
  clarifications: Clarification[]
): ContestSetCurrentContestClarifications {
  return {
    type: ContestActionType.SetCurrentContestClarifications,
    contestId,
    clarifications,
  }
}

export function setCurrentContestClarrificationsReducer(
  state: ContestState,
  action: ContestSetCurrentContestClarifications
): ContestState {
  const currentContest = state.currentContest
  if (currentContest && currentContest.id === action.contestId) {
    const clarifications = (currentContest.clarifications || []).slice()

    const currClarifIdMap: { [id: number]: Clarification } = {}
    clarifications.forEach(clarif => (currClarifIdMap[clarif.id] = clarif))
    for (const newClarif of action.clarifications) {
      if (newClarif.id in currClarifIdMap) {
        const oldClarif = currClarifIdMap[newClarif.id]

        const oldClarifEntryIdMap: { [id: number]: ClarificationEntry } = {}
        oldClarif.entries.forEach(
          entry => (oldClarifEntryIdMap[entry.id] = entry)
        )
        newClarif.entries.forEach(
          entry =>
            (oldClarifEntryIdMap[entry.id] = {
              ...oldClarifEntryIdMap[entry.id],
              ...entry,
            })
        )

        currClarifIdMap[newClarif.id].entries = Object.values(
          oldClarifEntryIdMap
        ).sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
      } else {
        currClarifIdMap[newClarif.id] = newClarif
      }
    }

    const result = Object.values(currClarifIdMap).sort(
      (a, b) => a.issuedTime.getTime() - b.issuedTime.getTime()
    )
    return {
      ...state,
      currentContest: { ...currentContest, clarifications: result },
    }
  }
  return { ...state }
}
