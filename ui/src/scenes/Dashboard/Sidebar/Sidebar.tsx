import { useContestOnly } from '@/auth'
import { showError } from '@/error'
import { showSuccessToast } from '@/toaster'
import { useServerClock } from '@/window'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useMutation, useQuery } from 'react-apollo-hooks'
import { SidebarLoadingView } from './SidebarLoadingView'
import { SidebarView } from './SidebarView'
import { GetMeAndMyContest } from './types/GetMeAndMyContest'

export const Sidebar: FunctionComponent = () => {
  useContestOnly()

  const { data, loading, error } = useQuery<GetMeAndMyContest>(gql`
    query GetMeAndMyContest {
      myContest {
        name
        shortDescription
        startTime
        finishTime
      }
      me {
        permissions
      }
    }
  `)

  const updateContestMutate = useMutation(gql`
    mutation UpdateContest($name: String, $shortDescription: String) {
      id
      name
      shortDescription
    }
  `)

  const serverClock = useServerClock()

  if (error) return null
  if (loading) return <SidebarLoadingView />
  if (!data || !data.myContest || !data.me) return null

  const setContestName = async (name: string) => {
    if (name !== data.myContest.name) {
      try {
        await updateContestMutate({ variables: { name } })
        showSuccessToast('Contest Name Updated')
      } catch (error) {
        showError(error)
      }
    }
  }

  const setContestShortDesc = async (shortDescription: string) => {
    if (shortDescription !== data.myContest.shortDescription) {
      try {
        await updateContestMutate({ variables: { shortDescription } })
        showSuccessToast('Contest Short Description Updated')
      } catch (error) {
        showError(error)
      }
    }
  }

  if (!serverClock) return null
  const canUpdateContest = data.me.permissions.includes('update:contest')
  return (
    <SidebarView
      contest={data.myContest}
      canUpdateContest={canUpdateContest}
      serverClock={serverClock}
      onUpdateName={setContestName}
      onUpdateShortDesc={setContestShortDesc}
    />
  )
}
