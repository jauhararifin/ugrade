import React, { SFC } from 'react'
import { H5, H2, InputGroup } from '@blueprintjs/core'

import './styles.css'
import TopNavigationBar from '../../components/TopNavigationBar'
import UserOnlyPage from '../UserOnlyPage'
import SidebarMiniCard from '../../components/SidebarMiniCard'
import ServerClock from '../../components/ServerClock'
import { Contest } from '../../stores/Contest'
import { ContestsList } from './ContestsList'

export interface ContestsPageProps {
  contests: Contest[]
  onContestChoose: (contest: Contest) => any
}

export const ContestsPage: SFC<ContestsPageProps> = ({contests, onContestChoose}) => (
  <UserOnlyPage>
    <div className="contests-page">
      <TopNavigationBar />
      <div className="contests-panel">
        <div className="contests-navigation">
          <SidebarMiniCard>
            <H5>Server Clock</H5>
            <H2><ServerClock /></H2>
          </SidebarMiniCard>
          <div className="contests-tips">
            <H2>Competitive Programming Tips</H2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
          </div>
        </div>

        <div className="contests-content">
          <InputGroup leftIcon="search" placeholder="Search Contests" large />
          <ContestsList contests={contests} onContestChoose={onContestChoose} />
        </div>
      </div>
    </div>
  </UserOnlyPage>
)

export default ContestsPage
