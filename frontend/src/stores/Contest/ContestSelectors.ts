import { createSelector } from 'reselect'
import { AppState } from '../state'
import { ClarificationEntry, ContestState, Language } from './ContestState'

export function getContest(state: AppState): ContestState {
  return state.contest
}

export const getContestInfo = createSelector(
  getContest,
  contest => contest.info
)

export const getLanguagesMap = createSelector(
  getContest,
  contest => {
    const info = contest.info
    if (info) {
      const languages = info.permittedLanguages
      if (languages) {
        const result: { [id: string]: Language } = {}
        languages.forEach(l => (result[l.id] = l))
        return result
      }
    }
    return undefined
  }
)

export const getProblemList = createSelector(
  getContest,
  contest => {
    const problems = contest.problems
    if (problems) {
      return Object.keys(problems)
        .map(k => problems[k])
        .sort((a, b) => a.order - b.order)
    }
    return undefined
  }
)

export const getAnnouncementList = createSelector(
  getContest,
  contest => {
    const announcements = contest.announcements
    if (announcements) {
      return Object.keys(announcements)
        .map(k => announcements[k])
        .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
    }
    return undefined
  }
)

export const getClarificationList = createSelector(
  getContest,
  contest => {
    const clarifications = contest.clarifications
    if (clarifications) {
      return Object.keys(clarifications)
        .map(k => clarifications[k])
        .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
    }
    return undefined
  }
)

export const getClarificationEntryList = createSelector(
  getContest,
  contest => {
    const clarifMap = contest.clarifications
    const result: { [id: string]: ClarificationEntry[] } = {}
    if (clarifMap) {
      for (const clarifId in clarifMap) {
        if (clarifMap.hasOwnProperty(clarifId)) {
          const clarif = clarifMap[clarifId]
          if (clarif && clarif.entries) {
            result[clarifId] = Object.keys(clarif.entries)
              .map(k => clarif.entries[k])
              .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
          }
        }
      }
    }
    return result
  }
)

export const getUnReadClarification = createSelector(
  getClarificationEntryList,
  clarifEntryList => {
    const result: { [id: string]: string[] } = {}
    for (const clarifId in clarifEntryList) {
      if (clarifEntryList.hasOwnProperty(clarifId)) {
        const entries = clarifEntryList[clarifId]
        if (entries) {
          result[clarifId] = entries
            .filter(entry => !entry.read)
            .map(entry => entry.id)
        }
      }
    }
    return result
  }
)

export const getSubmissionList = createSelector(
  getContest,
  contest => {
    const submissions = contest.submissions
    if (submissions) {
      return Object.keys(submissions)
        .map(k => submissions[k])
        .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
    }
    return undefined
  }
)
