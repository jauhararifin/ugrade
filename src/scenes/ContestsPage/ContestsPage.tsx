import React from 'react'
import { connect } from 'react-redux'
import { Path, LocationState } from 'history'
import { push, CallHistoryMethodAction } from 'connected-react-router'

import './styles.css'
import TopNavigationBar from '../../components/TopNavigationBar'
import UserOnlyPage from '../UserOnlyPage'

export interface ContestsPageProps {
  push(path: Path, state?: LocationState): CallHistoryMethodAction
}

class ContestsPage extends React.Component<ContestsPageProps> {
  render() {
    return (
      <UserOnlyPage>
        <div className="contests-page">
          <TopNavigationBar />
        </div>
      </UserOnlyPage>
    )
  }
}

export default connect(null, { push })(ContestsPage as any)
