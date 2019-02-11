import 'github-markdown-css'
import React, { ReactNode, SFC } from 'react'

import './styles.css'

import TopNavigationBar from '../../components/TopNavigationBar'
import Sidebar from './Sidebar'

export interface ContestDetailPageProps {
  children?: ReactNode
}

export const ContestDetailPage: SFC<ContestDetailPageProps> = ({
  children,
}) => {
  return (
    <div className='full-page'>
      <TopNavigationBar />
      <div className='contests-panel'>
        <Sidebar />
        <div className='contest-outer-content'>
          <div className='contest-content'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default ContestDetailPage
