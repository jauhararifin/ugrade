import { createSelector } from 'reselect'
import { AppState } from 'ugrade/store'
import {
  ClarificationEntry,
  ContestInfo,
  ContestState,
  Language,
} from './ContestState'

export function getContest(state: AppState): ContestState {
  return state.contest
}

export function getContestInfo(state: AppState): ContestInfo | undefined {
  return state.contest.info
}

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

export const getProblems = createSelector(
  getContest,
  contest => contest.problems
)

export const getProblemList = createSelector(
  getProblems,
  problems => {
    if (problems) {
      return Object.keys(problems)
        .map(k => problems[k])
        .sort((a, b) => a.order - b.order)
    }
    return undefined
  }
)

export function getAnnouncements(state: AppState) {
  return state.contest.announcements
}

export const getAnnouncementList = createSelector(
  getAnnouncements,
  announcements => {
    if (announcements) {
      return Object.keys(announcements)
        .map(k => announcements[k])
        .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
    }
    return undefined
  }
)

export const getClarifications = createSelector(
  getContest,
  contest => contest.clarifications
)

export const getClarificationList = createSelector(
  getClarifications,
  clarifications => {
    if (clarifications) {
      return Object.keys(clarifications)
        .map(k => clarifications[k])
        .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
    }
    return undefined
  }
)

export const getClarificationEntryList = createSelector(
  getClarifications,
  clarifMap => {
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

export function getSubmissions(state: AppState) {
  return state.contest.submissions
}

export const getSubmissionList = createSelector(
  getSubmissions,
  submissions => {
    if (submissions) {
      return Object.keys(submissions)
        .map(k => submissions[k])
        .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
    }
    return undefined
  }
)

export function getScoreboard(state: AppState) {
  return state.contest.scoreboard
}
