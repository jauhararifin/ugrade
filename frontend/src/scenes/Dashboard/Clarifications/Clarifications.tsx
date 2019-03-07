import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { useClarificationList } from 'ugrade/contest/clarification'
import { useProblemList } from 'ugrade/contest/problem'
import { useServerClock } from 'ugrade/server'
import { ClarificationsLoadingView } from './ClarificationsLoadingView'
import { ClarificationsView } from './ClarificationsView'

export const Clarifications: FunctionComponent = () => {
  useContestOnly()
  const problems = useProblemList()
  const clarifications = useClarificationList()
  const serverClock = useServerClock(60 * 1000)

  if (!problems || !clarifications || !serverClock) {
    return <ClarificationsLoadingView />
  }

  return (
    <ClarificationsView
      clarifications={clarifications}
      serverClock={serverClock}
    />
  )
}
