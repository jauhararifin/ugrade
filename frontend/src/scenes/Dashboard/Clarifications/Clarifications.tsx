import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'

import { contestOnly } from 'ugrade/helpers/auth'
import { withServer, WithServerProps } from 'ugrade/helpers/server'
import { AppAction, AppState, AppThunkDispatch } from 'ugrade/store'
import {
  Clarification,
  getClarificationList,
  getProblemList,
  Problem,
} from 'ugrade/stores/Contest'
import { useProblems } from '../helpers'
import { useClarifications } from '../helpers/useClarifications'
import { ClarificationsView } from './ClarificationsView'

export interface ClarificationsSceneProps extends WithServerProps {
  clarifications?: Clarification[]
  problems?: Problem[]
  dispatch: AppThunkDispatch & Dispatch<AppAction>
}

export const ClarificationsScene: FunctionComponent<
  ClarificationsSceneProps
> = ({ clarifications, dispatch, problems, serverClock }) => {
  useProblems(dispatch)
  useClarifications(dispatch)
  return (
    <ClarificationsView
      problems={problems}
      clarifications={clarifications}
      serverClock={serverClock}
    />
  )
}

const mapStateToProps = (state: AppState) => ({
  clarifications: getClarificationList(state),
  problems: getProblemList(state),
})

export default compose<ComponentType>(
  contestOnly(),
  connect(mapStateToProps),
  withServer
)(ClarificationsScene)
