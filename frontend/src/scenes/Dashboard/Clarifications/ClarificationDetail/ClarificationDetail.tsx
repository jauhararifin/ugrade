import React, { ComponentType, FunctionComponent, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { useContestOnly } from 'ugrade/auth'
import { Clarification, getUnReadClarification } from 'ugrade/contest/store'
import { withServer, WithServerProps } from 'ugrade/helpers/server'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import { useClarifications } from '../../helpers/useClarifications'
import { readClarificationEntriesAction } from './actions'
import { ClarificationDetailView } from './ClarificationDetailView'

export interface ClarificationDetailSceneOwnProps {
  clarificationId: string
  handleClose: () => any
}

export interface ClarificationDetailSceneReduxProps {
  clarifications?: { [id: string]: Clarification }
  unreadClarificationList: { [id: string]: string[] }
  dispatch: AppThunkDispatch
}

export type ClarificationDetailSceneProps = ClarificationDetailSceneOwnProps &
  ClarificationDetailSceneReduxProps &
  WithServerProps

export const ClarificationDetailScene: FunctionComponent<
  ClarificationDetailSceneProps
> = ({
  clarificationId,
  handleClose,
  clarifications,
  unreadClarificationList,
  dispatch,
  serverClock,
}) => {
  useContestOnly()
  useClarifications(dispatch)

  const clarification = clarifications
    ? clarifications[clarificationId]
    : undefined

  const readAllEntries = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)) // read after 2 seconds
    const unreadEntries = unreadClarificationList[clarificationId] || []
    if (unreadEntries.length > 0) {
      dispatch(readClarificationEntriesAction(clarificationId, unreadEntries))
    }
  }

  useEffect(() => {
    readAllEntries()
  })

  return (
    <ClarificationDetailView
      clarification={clarification}
      handleClose={handleClose}
      serverClock={serverClock}
    />
  )
}

const mapStateToProps = (state: AppState) => ({
  clarifications: state.contest.clarifications,
  unreadClarificationList: getUnReadClarification(state),
})

export default compose<ComponentType<ClarificationDetailSceneOwnProps>>(
  connect(mapStateToProps),
  withServer
)(ClarificationDetailScene)
