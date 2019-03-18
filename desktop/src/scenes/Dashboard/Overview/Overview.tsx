import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { useContestInfo } from 'ugrade/contest'
import { Contest } from 'ugrade/services/contest'
import { SimpleLoading } from '../components/SimpleLoading'
import { OverviewView } from './OverviewView'

export const Overview: FunctionComponent = () => {
  useContestOnly()
  const contest = useContestInfo()

  if (!contest) return <SimpleLoading />

  return <OverviewView contest={contest as Contest} />
}
