import classnames from 'classnames'
import React, {
  ComponentType,
  Fragment,
  FunctionComponent,
  ReactElement,
} from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import './styles.css'

import { AppState, AppThunkDispatch } from '../../stores'
import { useOnlineStatus } from './useOnlineStatus'

export interface NetworkStatusProps {
  dispatch: AppThunkDispatch
  children?: ReactElement<any> | null
  online: boolean
}

export const NetworkStatus: FunctionComponent<NetworkStatusProps> = ({
  dispatch,
  children,
  online,
}) => {
  useOnlineStatus(dispatch)
  return (
    <Fragment>
      <div className={classnames('offline-indicator', { on: !online })}>
        You Are Currently Offline
      </div>
      {children}
    </Fragment>
  )
}

const mapStateToProps = (state: AppState) => ({
  online: state.server.online,
})

export default compose<ComponentType>(connect(mapStateToProps))(NetworkStatus)
