import lodash from 'lodash'
import React, { FunctionComponent } from 'react'
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
  const serverClock = serverStore.serverClock
  const authStore = useAuth()
  const canUpdateInfo = authStore.can(Permission.UpdateInfo)
  const canReadProblems = authStore.can(Permission.ReadProblems)

  const setContestName = async (newName: string) => {
    if (contestInfo && newName !== contestInfo.name) {
      try {
        await contestStore.updateContest(
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
        await contestStore.updateContest(
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

  if (!contestInfo || (canReadProblems && !problems) || !serverClock) {
    return <SidebarLoadingView />
  }

  return (
    <SidebarView
      contest={contestInfo}
      canUpdateInfo={canUpdateInfo}
      serverClock={serverClock}
      onUpdateName={setContestName}
      onUpdateShortDesc={setContestShortDesc}
    />
  )
}
