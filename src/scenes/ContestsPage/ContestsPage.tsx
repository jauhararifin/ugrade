import React from 'react'
import { connect } from 'react-redux'
import { Path, LocationState } from 'history'
import { push, CallHistoryMethodAction } from 'connected-react-router'
import { H5, H4, H2, HTMLTable, InputGroup, Button } from '@blueprintjs/core'

import './styles.css'
import TopNavigationBar from '../../components/TopNavigationBar'
import UserOnlyPage from '../UserOnlyPage'
import SidebarMiniCard from '../../components/SidebarMiniCard'
import ServerClock from '../../components/ServerClock';

export interface ContestsPageProps {
  push(path: Path, state?: LocationState): CallHistoryMethodAction
}

class ContestsPage extends React.Component<ContestsPageProps> {
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
              <div className="contests-contests-group">
                <H4 className="contests-contests-title">Active Contests</H4>
                <HTMLTable bordered striped interactive className="contests-contests-table">
                  <thead>
                    <th>Name</th>
                    <th>Short Description</th>
                    <th>Start</th>
                    <th>Duration</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Arkavidia Final Round</td>
                      <td>Lorem ipsum dos color sit amet</td>
                      <td>6 January 2019, 02:23:44</td>
                      <td>5 Hours</td>
                    </tr>
                  </tbody>
                </HTMLTable>
              </div>

              <div className="contests-contests-group">
                <H4 className="contests-contests-title">Upcoming Contests</H4>
                <HTMLTable bordered striped interactive className="contests-contests-table">
                  <thead>
                    <th>Name</th>
                    <th>Short Description</th>
                    <th>Start</th>
                    <th>Duration</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Arkavidia Final Round</td>
                      <td>Lorem ipsum dos color sit amet</td>
                      <td>6 January 2019, 02:23:44</td>
                      <td>5 Hours</td>
                    </tr>
                  </tbody>
                </HTMLTable>
              </div>

              <div className="contests-contests-group">
                <H4 className="contests-contests-title">Pasts Contests</H4>
                <HTMLTable bordered striped interactive className="contests-contests-table">
                  <thead>
                    <th>Name</th>
                    <th>Short Description</th>
                    <th>Start</th>
                    <th>Duration</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Arkavidia Final Round</td>
                      <td>Lorem ipsum dos color sit amet</td>
                      <td>6 January 2019, 02:23:44</td>
                      <td>5 Hours</td>
                    </tr>
                  </tbody>
                </HTMLTable>
              </div>
              
            </div>
          </div>
        </div>
      </UserOnlyPage>
    )
  }
}

export default connect(null, { push })(ContestsPage as any)
