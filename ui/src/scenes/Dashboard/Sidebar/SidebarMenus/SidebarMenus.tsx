import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent, useState } from 'react'
import { useAuth, useRouting } from '../../../../app'
import { Permission } from '../../../../auth'
import { Menu } from './Menu'
import { SidebarMenuLoadingView } from './SidebarMenusLoadingView'
import { IMenu, SidebarMenuView } from './SidebarMenusView'

export interface SidebarMenusProps {
  loading: boolean
}

export const SidebarMenus: FunctionComponent<SidebarMenusProps> = ({ loading }) => {
  const routingStore = useRouting()
  const authStore = useAuth()

  return useObserver(() => {
    const getCurrentMenu = (): Menu => {
      const match = location.pathname.match(/contest\/([a-z]+)/)
      if (match && match[1]) {
        if (match[1] === 'problems') return Menu.Problems
        if (match[1] === 'submissions') return Menu.Submissions
        if (match[1] === 'settings') return Menu.Settings
        if (match[1] === 'members') return Menu.Members
      }
      return Menu.Overview
    }

    const onMenuChoosed = (menu: Menu) => {
      setCurrentMenu(menu)
      if (menu === Menu.Overview) routingStore.push(`/contest`)
      if (menu === Menu.Problems) routingStore.push(`/contest/problems`)
      if (menu === Menu.Submissions) routingStore.push(`/contest/submissions`)
      if (menu === Menu.Settings) routingStore.push(`/contest/settings`)
      if (menu === Menu.Members) routingStore.push(`/contest/members`)
    }

    const [currentMenu, setCurrentMenu] = useState(getCurrentMenu())

    const canUpdateInfo = authStore.can(Permission.UpdateInfo)

    const menus: IMenu[] = [
      {
        icon: 'home',
        onClick: () => onMenuChoosed(Menu.Overview),
        active: currentMenu === Menu.Overview,
        visible: true,
        title: Menu.Overview,
      },
      {
        icon: 'book',
        onClick: () => onMenuChoosed(Menu.Problems),
        active: currentMenu === Menu.Problems,
        visible: true,
        title: Menu.Problems,
      },
      {
        icon: 'layers',
        onClick: () => onMenuChoosed(Menu.Submissions),
        active: currentMenu === Menu.Submissions,
        visible: true,
        title: Menu.Submissions,
      },
      {
        icon: 'cog',
        onClick: () => onMenuChoosed(Menu.Settings),
        active: currentMenu === Menu.Settings,
        visible: canUpdateInfo,
        title: Menu.Settings,
      },
      {
        icon: 'person',
        onClick: () => onMenuChoosed(Menu.Members),
        active: currentMenu === Menu.Members,
        visible: true,
        title: Menu.Members,
      },
    ]

    if (loading) return <SidebarMenuLoadingView />
    return <SidebarMenuView menus={menus} />
  })
}
