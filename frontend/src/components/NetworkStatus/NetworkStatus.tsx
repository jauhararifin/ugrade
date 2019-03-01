import classnames from 'classnames'
import React, { Fragment, FunctionComponent, ReactElement } from 'react'
import { useOnlineStatus } from 'ugrade/server/useOnlineStatus'

import './styles.css'

export interface NetworkStatusProps {
  children?: ReactElement<any> | null
}

export const NetworkStatus: FunctionComponent<NetworkStatusProps> = ({
  children,
}) => {
  const online = useOnlineStatus()
  return (
    <Fragment>
      <div className={classnames('offline-indicator', { on: !online })}>
        You Are Currently Offline
      </div>
      {children}
    </Fragment>
  )
}
