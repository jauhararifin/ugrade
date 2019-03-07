import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { useClarificationList } from 'ugrade/contest/clarification'
import { useProblemList } from 'ugrade/contest/problem'
import { Clarification, Problem } from 'ugrade/contest/store'
import { useServerClock } from 'ugrade/server'
import { ClarificationsLoadingView } from './ClarificationsLoadingView'
import { ClarificationsView } from './ClarificationsView'

export const Clarifications: FunctionComponent = () => {
  useContestOnly()
  const problems = useProblemList()
  const clarifications = useClarificationList()
  const serverClock = useServerClock(60 * 1000)

  const loading = !problems || !clarifications || !serverClock
  if (loading) return <ClarificationsLoadingView />

  return (
    <ClarificationsView
      clarifications={clarifications as Clarification[]}
      serverClock={serverClock as Date}
    />
  )
}
