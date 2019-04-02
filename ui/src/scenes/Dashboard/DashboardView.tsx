import React, { FunctionComponent, ReactNode } from 'react'
// import { Sidebar } from './Sidebar'
import { TopNavigationBar } from './TopNavigationBar/TopNavigationBar'

import './styles.css'

export interface DashboardViewProps {
  children?: ReactNode
}

export const DashboardView: FunctionComponent<DashboardViewProps> = ({ children }) => {
  return (
    <div className='full-page'>
      <TopNavigationBar />
      <div className='contest-panel'>
        {/* <Sidebar /> */}
        <div className='contest-outer-content'>
          <div className='contest-content'>{children}</div>
        </div>
      </div>
    </div>
  )
}
