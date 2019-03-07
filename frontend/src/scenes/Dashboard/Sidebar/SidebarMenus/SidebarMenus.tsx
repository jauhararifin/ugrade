import lodash from 'lodash'
import React, { FunctionComponent, useMemo, useState } from 'react'
import { useMe, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { useAnnouncements } from 'ugrade/contest/announcement'
import { useClarifications } from 'ugrade/contest/clarification'
import { usePush } from 'ugrade/router'
import { Menu } from './Menu'
import { SidebarMenuLoadingView } from './SidebarMenusLoadingView'
import { IMenu, SidebarMenuView } from './SidebarMenusView'

export interface SidebarMenusProps {
  loading: boolean
}

export const SidebarMenus: FunctionComponent<SidebarMenusProps> = ({
  loading,
}) => {
  const getCurrentMenu = (): Menu => {
    const match = location.pathname.match(/contest\/([a-z]+)/)
    if (match && match[1]) {
      if (match[1] === 'announcements') return Menu.Announcements
      if (match[1] === 'problems') return Menu.Problems
      if (match[1] === 'clarifications') return Menu.Clarifications
      if (match[1] === 'submissions') return Menu.Submissions
      if (match[1] === 'scoreboard') return Menu.Scoreboard
      if (match[1] === 'settings') return Menu.Settings
    }
    return Menu.Overview
  }

  const push = usePush()

  const onMenuChoosed = (menu: Menu) => {
    setCurrentMenu(menu)
    if (menu === Menu.Overview) push(`/contest`)
    if (menu === Menu.Announcements) push(`/contest/announcements`)
    if (menu === Menu.Problems) push(`/contest/problems`)
    if (menu === Menu.Clarifications) push(`/contest/clarifications`)
    if (menu === Menu.Submissions) push(`/contest/submissions`)
    if (menu === Menu.Scoreboard) push(`/contest/scoreboard`)
    if (menu === Menu.Settings) push(`/contest/settings`)
  }

  const me = useMe()
  const [currentMenu, setCurrentMenu] = useState(getCurrentMenu())
  const announcements = useAnnouncements()
  const clarifications = useClarifications()

  const newAnnouncementCount = useMemo(() => {
    if (announcements) {
      return lodash.values(announcements).filter(x => !x.read).length
    }
    return 0
  }, [announcements])

  const newClarificationCount = useMemo(() => {
    if (clarifications && me) {
      const clarifs = lodash.values(clarifications)
      const clarifsCount = clarifs.map(
        clarif =>
          lodash
            .values(clarif.entries)
            .filter(entry => entry.sender !== me.id && !entry.read).length
      )
      return clarifsCount.reduce((a, b) => a + b)
    }
    return 0
  }, [clarifications, me])

  const canReadAnnouncement = usePermissions([UserPermission.AnnouncementRead])
  const canUpdateInfo = usePermissions([UserPermission.InfoUpdate])

  const menus: IMenu[] = [
    {
      icon: 'home',
      onClick: () => onMenuChoosed(Menu.Overview),
      active: currentMenu === Menu.Overview,
      visible: true,
      title: Menu.Overview,
    },
    {
      icon: 'notifications',
      onClick: () => onMenuChoosed(Menu.Announcements),
      active: currentMenu === Menu.Announcements,
      visible: canReadAnnouncement,
      title: Menu.Announcements,
      indicator: newAnnouncementCount,
    },
    {
      icon: 'book',
      onClick: () => onMenuChoosed(Menu.Problems),
      active: currentMenu === Menu.Problems,
      visible: true,
      title: Menu.Problems,
    },
    {
      icon: 'chat',
      onClick: () => onMenuChoosed(Menu.Clarifications),
      active: currentMenu === Menu.Clarifications,
      visible: true,
      title: Menu.Clarifications,
      indicator: newClarificationCount,
    },
    {
      icon: 'layers',
      onClick: () => onMenuChoosed(Menu.Submissions),
      active: currentMenu === Menu.Submissions,
      visible: true,
      title: Menu.Submissions,
    },
    {
      icon: 'th-list',
      onClick: () => onMenuChoosed(Menu.Scoreboard),
      active: currentMenu === Menu.Scoreboard,
      visible: true,
      title: Menu.Scoreboard,
    },
    {
      icon: 'cog',
      onClick: () => onMenuChoosed(Menu.Settings),
      active: currentMenu === Menu.Settings,
      visible: canUpdateInfo,
      title: Menu.Settings,
    },
  ]

  if (loading) return <SidebarMenuLoadingView />
  return <SidebarMenuView menus={menus} />
}
