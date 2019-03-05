import React, { FunctionComponent } from 'react'
import { useContestOnly, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useContestInfo, useSetContestInfo } from 'ugrade/contest'
import { useProblemList } from 'ugrade/contest/problem'
import { useRank } from 'ugrade/contest/scoreboard'
import { useServerClock } from 'ugrade/server'
import { SidebarView } from './SidebarView'

export const Sidebar: FunctionComponent = () => {
  useContestOnly()
  const contestInfo = useContestInfo()
  const problems = useProblemList()
  const serverClock = useServerClock()
  const rank = useRank()
  const canUpdateInfo = usePermissions([UserPermission.InfoUpdate])
  const setContestInfo = useSetContestInfo()

  const setContestName = async (newName: string) => {
    if (contestInfo && newName !== contestInfo.name) {
      try {
        await setContestInfo(newName)
        TopToaster.showSuccessToast('Contest Name Updated')
      } catch (error) {
        if (!handleCommonError(error)) throw error
      }
    }
  }

  const setContestShortDesc = async (newShortDesc: string) => {
    if (contestInfo && newShortDesc !== contestInfo.shortDescription) {
      try {
        await setContestInfo(undefined, newShortDesc)
        TopToaster.showSuccessToast('Contest Short Description Updated')
      } catch (error) {
        if (!handleCommonError(error)) throw error
      }
    }
  }

  return (
    <SidebarView
      contest={contestInfo}
      problems={problems}
      canUpdateInfo={canUpdateInfo}
      rank={rank}
      serverClock={serverClock}
      onUpdateName={setContestName}
      onUpdateShortDesc={setContestShortDesc}
    />
  )
}
