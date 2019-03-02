import { IBreadcrumbProps } from '@blueprintjs/core'
import { Location } from 'history'
import { createSelector } from 'reselect'
import {
  ContestInfo,
  getContestInfo,
  getProblems,
  Problem,
} from 'ugrade/contest/store'
import { AppState } from 'ugrade/store'

export const selectBreadcrumb = createSelector(
  (state: AppState) => state.router.location,
  getContestInfo,
  getProblems,
  (
    loc: Location,
    contestInfo?: ContestInfo,
    problems?: { [problemId: string]: Problem }
  ): IBreadcrumbProps[] => {
    const location = loc.pathname
      .slice()
      .split('/')
      .filter(x => x)
      .reverse()

    const result: IBreadcrumbProps[] = []
    const item = location.pop()

    if (item === 'contest' && contestInfo) {
      result.push({
        href: `/contest`,
        text: contestInfo.name,
      })
      const menu = location.pop()
      if (menu === 'problems') {
        result.push({
          href: `/contest/problems`,
          text: 'Problems',
        })
        const prob = location.pop()
        if (prob && problems && problems[prob]) {
          result.push({
            href: `contest/problems/${problems[prob].id}`,
            text: problems[prob].name,
          })
        }
      } else if (menu === 'clarifications') {
        result.push({
          href: `/contest/clarifications`,
          text: 'Clarifications',
        })
      } else if (menu === 'submissions') {
        result.push({
          href: `/contest/submissions`,
          text: 'Submission',
        })
      } else if (menu === 'announcements') {
        result.push({
          href: `/contest/announcements`,
          text: 'Announcements',
        })
      } else if (menu === 'scoreboard') {
        result.push({
          href: `/contest/scoreboard`,
          text: 'Scoreboard',
        })
      }
    }

    return result
  }
)
