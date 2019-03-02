import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { useContestInfo } from 'ugrade/contest'
import { OverviewView } from './OverviewView'

export const Overview: FunctionComponent = () => {
  useContestOnly()
  const contest = useContestInfo()
  return <OverviewView contest={contest} />
}
