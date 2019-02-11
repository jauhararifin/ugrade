import { H2, H5, InputGroup } from '@blueprintjs/core'
import classnames from 'classnames'
import moment from 'moment'
import React, { SFC } from 'react'

import './styles.css'

import SidebarMiniCard from '../../components/SidebarMiniCard'
import TopNavigationBar from '../../components/TopNavigationBar'
import { Contest } from '../../stores/Contest'
import { ContestsList } from './ContestsList'

export interface ContestsPageProps {
  contests: Contest[]
  onContestChoose: (contest: Contest) => any
  serverClock?: Date
}

export const ContestsPage: SFC<ContestsPageProps> = ({
  contests,
  onContestChoose,
  serverClock,
}) => (
  <div className='full-page'>
    <TopNavigationBar />
    <div className='contests-panel'>
      <div className='contests-navigation'>
        <SidebarMiniCard
          className={classnames({ 'bp3-skeleton': contests.length === 0 })}
        >
          <H5>Server Clock</H5>
          <H2>
            {serverClock ? moment(serverClock).format('HH:mm:ss') : 'Unknown'}
          </H2>
        </SidebarMiniCard>
        <div
          className={classnames(
            { 'bp3-skeleton': contests.length === 0 },
            'contests-tips'
          )}
        >
          <H2>Competitive Programming Tips</H2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
      </div>

      <div className='contests-content'>
        <InputGroup
          className={classnames({ 'bp3-skeleton': contests.length === 0 })}
          leftIcon='search'
          placeholder='Search Contests'
          large={true}
        />
        <ContestsList contests={contests} onContestChoose={onContestChoose} />
      </div>
    </div>
  </div>
)

export default ContestsPage
