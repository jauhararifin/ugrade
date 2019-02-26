import { IBreadcrumbProps } from '@blueprintjs/core'
import { AppState } from '../../../stores'

export const selectBreadcrumb = (state: AppState): IBreadcrumbProps[] => {
  const location = state.router.location.pathname
    .slice()
    .split('/')
    .filter(x => x)
    .reverse()

  const result: IBreadcrumbProps[] = []
  const item = location.pop()

  if (item === 'contest' && state.contest.info) {
    result.push({
      href: `/contest`,
      text: state.contest.info.name,
    })
    const menu = location.pop()
    if (menu === 'problems') {
      result.push({
        href: `/contest/problems`,
        text: 'Problems',
      })
      const prob = location.pop()
      if (prob && state.contest.problems && state.contest.problems[prob]) {
        result.push({
          href: `contest/problems/${state.contest.problems[prob].id}`,
          text: state.contest.problems[prob].name,
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
