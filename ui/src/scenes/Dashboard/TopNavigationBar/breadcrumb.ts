import { ContestInfo } from '@/contest'
import { Problem } from '@/problem'
import { IBreadcrumbProps } from '@blueprintjs/core'
import { Location } from 'history'

export const getBreadcrumb = (
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
      if (prob === 'create') {
        result.push({
          href: `contest/problems/create`,
          text: 'Create',
        })
      } else if (prob && problems && problems[prob]) {
        result.push({
          href: `contest/problems/${problems[prob].id}`,
          text: problems[prob].name,
        })
        const edit = location.pop()
        if (edit === 'edit') {
          result.push({
            href: `contest/problems/${problems[prob].id}/edit`,
            text: 'Edit',
          })
        }
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
    } else if (menu === 'settings') {
      result.push({
        href: `/contest/settings`,
        text: 'Settings',
      })
    } else if (menu === 'members') {
      result.push({
        href: `/contest/members`,
        text: 'Members',
      })
      const uid = location.pop()
      if (uid === 'invite') {
        result.push({
          href: `contest/members/invite`,
          text: 'Invite',
        })
      } else if (uid) {
        result.push({
          href: `contest/problems/${uid}`,
          text: 'Edit',
        })
      }
    }
  }

  return result
}
