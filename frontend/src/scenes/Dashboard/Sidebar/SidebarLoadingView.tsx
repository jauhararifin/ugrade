import { H2, H6 } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { SidebarMenus } from './SidebarMenus'
import { SidebarMiniCard } from './SidebarMiniCard'

import './styles.css'

export const SidebarLoadingView: FunctionComponent = () => {
  return (
    <div className='contest-sidebar'>
      <H2 className='bp3-skeleton'>Fake</H2>
      <p className='bp3-skeleton'>{'fake '.repeat(50)}</p>

      <div className='contest-status-bottom'>
        <SidebarMiniCard className='bp3-skeleton contest-status-rank'>
          <H6>Rank</H6>
          <H2>Fake</H2>
        </SidebarMiniCard>
        <SidebarMiniCard className='bp3-skeleton contest-status-time'>
          <H6>Remaining Time</H6>
          <H2>Fake Fake</H2>
        </SidebarMiniCard>
      </div>

      <div className='contest-menu'>
        <SidebarMenus loading={true} />
      </div>

      <div className='contest-submit-solution'>
        <p className='bp3-skeleton'>{'fake '.repeat(50)}</p>
      </div>
    </div>
  )
}
