import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { useContestInfo } from 'ugrade/contest'
import { Contest } from 'ugrade/services/contest'
import { OverviewLoadingView } from './OverviewLoadingView'
import { OverviewView } from './OverviewView'

export const Overview: FunctionComponent = () => {
  useContestOnly()
  const contest = useContestInfo()

  const loading = !contest
  if (loading) return <OverviewLoadingView />

  return <OverviewView contest={contest as Contest} />
}
