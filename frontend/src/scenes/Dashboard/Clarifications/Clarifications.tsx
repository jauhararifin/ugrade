import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'

import { contestOnly } from '../../../helpers/auth'
import { withServer, WithServerProps } from '../../../helpers/server'
import { AppAction, AppState, AppThunkDispatch } from '../../../stores'
import {
  Clarification,
  getClarificationList,
  getProblemList,
  Problem,
} from '../../../stores/Contest'
import { useProblems } from '../helpers'
import { ClarificationsView } from './ClarificationsView'
import { useClarifications } from './useClarifications'

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
