import React, { FunctionComponent } from 'react'
import { useContestOnly, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useContestInfo, useSetContestInfo } from 'ugrade/contest'
import { useProblemList } from 'ugrade/contest/problem'
import { useRank } from 'ugrade/contest/scoreboard'
import { useServerClock } from 'ugrade/server'
import { SidebarLoadingView } from './SidebarLoadingView'
import { SidebarView } from './SidebarView'

export const Sidebar: FunctionComponent = () => {
  useContestOnly()
  const contestInfo = useContestInfo()
  const problems = useProblemList()
  const serverClock = useServerClock()
  const rank = useRank()
  const canUpdateInfo = usePermissions([UserPermission.InfoUpdate])
  const canReadProblems = usePermissions([UserPermission.ProblemsRead])
  const setContestInfo = useSetContestInfo()

  const setContestName = async (newName: string) => {
    if (contestInfo && newName !== contestInfo.name) {
      try {
        await setContestInfo(
          newName,
          contestInfo.shortDescription,
          contestInfo.description,
          contestInfo.startTime,
          contestInfo.freezed,
          contestInfo.finishTime,
          contestInfo.permittedLanguages.map(l => l.id)
        )
        TopToaster.showSuccessToast('Contest Name Updated')
      } catch (error) {
        if (!handleCommonError(error)) throw error
      }
    }
  }

  const setContestShortDesc = async (newShortDesc: string) => {
    if (contestInfo && newShortDesc !== contestInfo.shortDescription) {
      try {
        await setContestInfo(
          contestInfo.name,
          newShortDesc,
          contestInfo.description,
          contestInfo.startTime,
          contestInfo.freezed,
          contestInfo.finishTime,
          contestInfo.permittedLanguages.map(l => l.id)
        )
        TopToaster.showSuccessToast('Contest Short Description Updated')
      } catch (error) {
        if (!handleCommonError(error)) throw error
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
      rank={rank}
      serverClock={serverClock}
      onUpdateName={setContestName}
      onUpdateShortDesc={setContestShortDesc}
    />
  )
}
