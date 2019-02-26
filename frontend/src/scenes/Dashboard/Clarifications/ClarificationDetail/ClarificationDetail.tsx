import React, { ComponentType, FunctionComponent, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { contestOnly } from '../../../../helpers/auth'
import { withServer, WithServerProps } from '../../../../helpers/server'
import { AppState, AppThunkDispatch } from '../../../../stores'
import { Clarification } from '../../../../stores/Contest'
import { useClarifications } from '../useClarifications'
import { readClarificationEntriesAction } from './actions'
import { ClarificationDetailView } from './ClarificationDetailView'

export interface ClarificationDetailSceneOwnProps {
  clarificationId: string
  handleClose: () => any
}

export interface ClarificationDetailSceneReduxProps {
  clarifications?: { [id: string]: Clarification }
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
  dispatch,
  serverClock,
}) => {
  useClarifications(dispatch)

  const clarification = clarifications
    ? clarifications[clarificationId]
    : undefined
  const readAllEntries = async () => {
    if (clarification) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // read after 2 seconds
      const entries = Object.keys(clarification.entries).map(
        k => clarification.entries[k]
      )
      const unreadEntries = entries.filter(entry => !entry.read)
      if (unreadEntries.length > 0) {
        dispatch(
          readClarificationEntriesAction(
            clarification.id,
            unreadEntries.map(entry => entry.id)
          )
        )
      }
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
})

export default compose<ComponentType<ClarificationDetailSceneOwnProps>>(
  contestOnly(),
  connect(mapStateToProps),
  withServer
)(ClarificationDetailScene)
