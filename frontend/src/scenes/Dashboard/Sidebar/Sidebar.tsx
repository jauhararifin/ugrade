import React, { FunctionComponent, useState } from 'react'
import { useContestOnly, useMe, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useContestInfo, useSetContestInfo } from 'ugrade/contest'
import { useAnnouncements } from 'ugrade/contest/announcement'
import { useClarifications } from 'ugrade/contest/clarification'
import { useProblemList } from 'ugrade/contest/problem'
import { useRank } from 'ugrade/contest/scoreboard'
import { usePush } from 'ugrade/router'
import { useServerClock } from 'ugrade/server'
import { Menu, SidebarView } from './SidebarView'

export const Sidebar: FunctionComponent = () => {
  useContestOnly()
  const me = useMe()
  const contestInfo = useContestInfo()
  const problems = useProblemList()
  const announcements = useAnnouncements()
  const clarifications = useClarifications()
  const serverClock = useServerClock()
  const push = usePush()

  const getCurrentMenu = (): Menu => {
    const match = location.pathname.match(/contest\/([a-z]+)/)
    if (match && match[1]) {
      if (match[1] === 'announcements') return Menu.Announcements
      if (match[1] === 'problems') return Menu.Problems
      if (match[1] === 'clarifications') return Menu.Clarifications
      if (match[1] === 'submissions') return Menu.Submissions
      if (match[1] === 'scoreboard') return Menu.Scoreboard
    }
    return Menu.Overview
  }

  const onMenuChoosed = (menu: Menu) => {
    setCurrentMenu(menu)
    if (menu === Menu.Overview) return push(`/contest`)
    if (menu === Menu.Announcements) return push(`/contest/announcements`)
    if (menu === Menu.Problems) return push(`/contest/problems`)
    if (menu === Menu.Clarifications) return push(`/contest/clarifications`)
    if (menu === Menu.Submissions) return push(`/contest/submissions`)
    if (menu === Menu.Scoreboard) return push(`/contest/scoreboard`)
  }

  const newAnnouncementCount = () => {
    if (announcements) {
      return Object.values(announcements).filter(x => !x.read).length
    }
    return 0
  }

  const newClarificationCount = () => {
    if (clarifications && me) {
      const clarifs = Object.values(clarifications)
      const clarifsCount = clarifs.map(
        clarif =>
          Object.values(clarif.entries).filter(
            entry => entry.sender !== me.id && !entry.read
          ).length
      )
      return clarifsCount.reduce((a, b) => a + b)
    }
    return 0
  }

  const [currentMenu, setCurrentMenu] = useState(getCurrentMenu())
  const rank = useRank()
  const canUpdateInfo = usePermissions([UserPermission.InfoUpdate])

  const setContestInfo = useSetContestInfo()

  const setContestName = async (_newName: string) => {
    try {
      await setContestInfo()
      TopToaster.showSuccessToast('Contest Name Updated')
    } catch (error) {
      if (!handleCommonError(error)) throw error
    }
  }

  const setContestShortDesc = async (_newShortDesc: string) => {
    try {
      await setContestInfo()
      TopToaster.showSuccessToast('Contest Short Description Updated')
    } catch (error) {
      if (!handleCommonError(error)) throw error
    }
  }

  return (
    <SidebarView
      contest={contestInfo}
      problems={problems}
      canUpdateInfo={canUpdateInfo}
      rank={rank}
      serverClock={serverClock}
      menu={currentMenu}
      onChoose={onMenuChoosed}
      newAnnouncementCount={newAnnouncementCount()}
      newClarificationCount={newClarificationCount()}
      onUpdateName={setContestName}
      onUpdateShortDesc={setContestShortDesc}
    />
  )
}
