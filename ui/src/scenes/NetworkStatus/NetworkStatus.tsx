import { useWindow } from '@/window'
import classnames from 'classnames'
import { useObserver } from 'mobx-react-lite'
import React, { Fragment, FunctionComponent, ReactElement } from 'react'

import './styles.css'

export interface NetworkStatusProps {
  children?: ReactElement<any> | null
}

export const NetworkStatus: FunctionComponent<NetworkStatusProps> = ({ children }) => {
  const window = useWindow()
  return useObserver(() => {
    const online = window.online
    return (
      <Fragment>
        <div className={classnames('offline-indicator', { on: !online })}>You Are Currently Offline</div>
        {children}
      </Fragment>
    )
  })
}
