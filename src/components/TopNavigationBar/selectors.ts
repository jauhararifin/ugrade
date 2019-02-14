import { IBreadcrumbProps } from '@blueprintjs/core'
import { AppState } from '../../stores'

export const selectBreadcrumb = (state: AppState): IBreadcrumbProps[] => {
  const location = state.router.location.pathname
    .slice()
    .split('/')
    .filter(x => x)
    .reverse()

  const result: IBreadcrumbProps[] = []
  const item = location.pop()

  if (item === 'contests') {
    result.push({ href: '/contests', text: 'Contests' })
    const currentContest = state.contest.currentContest
    const currentContestId = location.pop()
    if (currentContestId && currentContest) {
      result.push({
        href: `/contests/${currentContestId}`,
        text: currentContest.name,
      })
      const contestMenu = location.pop()
      if (contestMenu === 'problems') {
        result.push({
          href: `/contests/${currentContestId}/problems`,
          text: 'Problems',
        })
        const problemId = location.pop()
        const currentProblem = currentContest.currentProblem
        if (
          problemId &&
          currentProblem &&
          problemId === currentProblem.id.toString()
        ) {
          result.push({
            href: `/contests/${currentContestId}/problems/${problemId}`,
            text: currentProblem.name,
          })
        }
      } else if (contestMenu === 'clarifications') {
        result.push({
          href: `/contests/${currentContestId}/problems`,
          text: 'Clarifications',
        })
      }
    }
  }

  return result
}
