import React from 'react'
import { connect } from 'react-redux'
import { Path, LocationState } from 'history'
import { push, CallHistoryMethodAction } from 'connected-react-router'
import { H5, H4, H2, HTMLTable, InputGroup, Button } from '@blueprintjs/core'

import './styles.css'
import TopNavigationBar from '../../components/TopNavigationBar'
import UserOnlyPage from '../UserOnlyPage'
import SidebarMiniCard from '../../components/SidebarMiniCard'
import ServerClock from '../../components/ServerClock'
import { AppState, AppThunkDispatch } from '../../stores'
import { Contest } from '../../stores/Contest'
import { ContestList } from './ContestList'
import { getContestsAction } from './actions'

export interface ContestsPageProps {
  dispatch: AppThunkDispatch
  contests: Contest[]
}

class ContestsPage extends React.Component<ContestsPageProps> {
  
  static defaultProps = {
    contests: []
  }

  componentWillMount = () => {
    this.props.dispatch(getContestsAction())
  }

  handleContestChoose = (id: number) => {
    this.props.dispatch(push(`/contests/${id}`))
  }

  render() {
    return (
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
              <ContestList contests={this.props.contests} onContestChoose={this.handleContestChoose} />
            </div>
          </div>
        </div>
      </UserOnlyPage>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contests: state.contest.contests
})

export default connect(mapStateToProps)(ContestsPage as any)
