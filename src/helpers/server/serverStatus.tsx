import moment from 'moment'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'

import { AppState, AppThunkAction, AppThunkDispatch } from '../../stores'
import { setServerClock } from '../../stores/ServerStatus'

const getServerClockAction = (): AppThunkAction => {
  return async (dispatch, _, { serverStatusService }) => {
    let triedTimes = 0
    while (true) {
      try {
        triedTimes++
        const serverClock = await serverStatusService.getClock()
        const localClock = new Date()
        dispatch(setServerClock(serverClock, localClock))
        return
      } catch (error) {
        await new Promise(resolve =>
          setTimeout(resolve, triedTimes > 10 ? 10000 : 3000)
        )
      }
    }
  }
}

export interface WithServerProps {
  localClock: Date
  serverClock?: Date
  dispatch: AppThunkDispatch
}

export interface WithServerState {
  serverClock?: Date
}

export const withServer = <P extends object>(
  Component: ComponentType<P>
): ComponentType<{ serverClock?: Date }> => {
  const reloadMs = 3 * 1000 // refetch every 5 minutes
  class WithServer extends React.Component<
    P & WithServerProps,
    WithServerState
  > {
    private timer?: NodeJS.Timeout
    private timeToRefresh = reloadMs

    constructor(props: P & WithServerProps) {
      super(props)
      if (this.props.serverClock && this.props.localClock) {
        const currentServerClock =
          new Date().getTime() -
          this.props.localClock.getTime() +
          this.props.serverClock.getTime()
        this.state = { serverClock: moment(currentServerClock).toDate() }
      } else {
        this.state = { serverClock: undefined }
      }
    }

    tick = () => {
      if (this.props.serverClock) {
        const currentServerClock =
          new Date().getTime() -
          this.props.localClock.getTime() +
          this.props.serverClock.getTime()
        this.setState({ serverClock: moment(currentServerClock).toDate() })
      } else {
        this.setState({ serverClock: undefined })
      }
      if (--this.timeToRefresh === 0) {
        this.timeToRefresh = reloadMs
        this.props.dispatch(getServerClockAction()).catch(null)
      }
    }

    componentDidMount = () => {
      if (!this.props.serverClock || !this.props.localClock) {
        this.props.dispatch(getServerClockAction()).catch(null)
      }
      this.timer = setInterval(this.tick, 1000)
    }

    componentWillUnmount = () => {
      clearInterval(this.timer as NodeJS.Timeout)
    }

    render() {
      return <Component {...this.props} serverClock={this.state.serverClock} />
    }
  }

  const mapStateToProps = (state: AppState) => ({
    serverClock: state.server.clock,
    localClock: state.server.localClock,
  })
  return connect(mapStateToProps)(WithServer as any)
}
