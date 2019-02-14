import React, { Component, ComponentType } from 'react'

import { connect } from 'react-redux'
import { compose } from 'redux'
import { userOnly } from '../../../../helpers/auth'
import { AppState, AppThunkDispatch } from '../../../../stores'
import { Clarification, Contest } from '../../../../stores/Contest'
import { readClarificationEntries } from './actions'
import { ClarificationDetailView } from './ClarificationDetailView'

export interface ClarificationDetailSceneOwnProps {
  clarification?: Clarification
  handleClose: () => any
  serverClock: Date
}

export interface ClarificationDetailSceneReduxProps {
  contest?: Contest
  dispatch: AppThunkDispatch
}

export type ClarificationDetailSceneProps = ClarificationDetailSceneOwnProps &
  ClarificationDetailSceneReduxProps

export class ClarificationDetailScene extends Component<
  ClarificationDetailSceneProps
> {
  componentDidMount() {
    this.readAllEntries().catch(_ => null)
  }
  componentDidUpdate() {
    this.readAllEntries().catch(_ => null)
  }
  async readAllEntries() {
    const { contest, clarification, dispatch } = this.props
    if (contest && clarification) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // read after 2 seconds
      const unreadEntries = clarification.entries.filter(entry => !entry.read)
      if (unreadEntries.length > 0) {
        dispatch(
          readClarificationEntries(
            contest.id,
            clarification.id,
            unreadEntries.map(entry => entry.id)
          )
        ).catch(_ => null)
      }
    }
  }
  render() {
    const { clarification, handleClose, serverClock } = this.props
    return (
      <ClarificationDetailView
        clarification={clarification}
        handleClose={handleClose}
        serverClock={serverClock}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType<ClarificationDetailSceneOwnProps>>(
  userOnly(),
  connect(mapStateToProps)
)(ClarificationDetailScene)
