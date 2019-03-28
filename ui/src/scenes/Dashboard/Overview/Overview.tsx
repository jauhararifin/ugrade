import { useContest } from '@/app'
import { useContestOnly } from '@/common'
import { ContestInfo } from '@/contest'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { SimpleLoading } from '../components/SimpleLoading'
import { OverviewView } from './OverviewView'

export const Overview: FunctionComponent = () => {
  useContestOnly()
  const contestStore = useContest()
  return useObserver(() => {
    const contest = contestStore.current
    if (!contest) return <SimpleLoading />
    return <OverviewView contest={contest as ContestInfo} />
  })
}
