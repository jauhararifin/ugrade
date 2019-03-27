import lodash from 'lodash'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect } from 'react'
import { useAuth, useContest, useProblem, useServer } from '../../../app'
import { Permission } from '../../../auth'
import { showErrorToast, showSuccessToast, useContestOnly } from '../../../common'
import { SidebarLoadingView } from './SidebarLoadingView'
import { SidebarView } from './SidebarView'

export const Sidebar: FunctionComponent = () => {
  useContestOnly()
  const contestStore = useContest()
  const contestInfo = contestStore.current
  const problemStore = useProblem()
  const problems = lodash.values(problemStore.problems)
  const serverStore = useServer()
  const authStore = useAuth()
  const canUpdateInfo = authStore.can(Permission.UpdateInfo)
  const canReadProblems = authStore.can(Permission.ReadProblems)

  const setContestName = async (newName: string) => {
    if (contestInfo && newName !== contestInfo.name) {
      try {
        await contestStore.update(
          newName,
          contestInfo.shortDescription,
          contestInfo.description,
          contestInfo.startTime,
          contestInfo.freezed,
          contestInfo.finishTime,
          contestInfo.permittedLanguages.map(l => l.id)
        )
        showSuccessToast('Contest Name Updated')
      } catch (error) {
        showErrorToast(error)
      }
    }
  }

  const setContestShortDesc = async (newShortDesc: string) => {
    if (contestInfo && newShortDesc !== contestInfo.shortDescription) {
      try {
        await contestStore.update(
          contestInfo.name,
          newShortDesc,
          contestInfo.description,
          contestInfo.startTime,
          contestInfo.freezed,
          contestInfo.finishTime,
          contestInfo.permittedLanguages.map(l => l.id)
        )
        showSuccessToast('Contest Short Description Updated')
      } catch (error) {
        showErrorToast(error)
      }
    }
  }

  return useObserver(() => {
    const loadingInfo = !contestInfo
    const loadingProbs = !problems && canReadProblems
    const loadingClock = !serverStore.serverClock
    if (loadingInfo || loadingProbs || loadingClock) {
      return <SidebarLoadingView />
    }
    if (!contestInfo) return null
    if (!serverStore.serverClock) return null
    return (
      <SidebarView
        contest={contestInfo}
        canUpdateInfo={canUpdateInfo}
        serverClock={serverStore.serverClock}
        onUpdateName={setContestName}
        onUpdateShortDesc={setContestShortDesc}
      />
    )
  })
}
