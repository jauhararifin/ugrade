import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import React, { Fragment, FunctionComponent, ReactElement } from 'react'
import { useServer } from '../../app'

import './styles.css'

export interface NetworkStatusProps {
  children?: ReactElement<any> | null
}

export const NetworkStatus: FunctionComponent<NetworkStatusProps> = observer(({ children }) => {
  const serverStore = useServer()
  return (
    <Fragment>
      <div className={classnames('offline-indicator', { on: !serverStore.online })}>You Are Currently Offline</div>
      {children}
    </Fragment>
  )
})
