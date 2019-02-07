import React, { ComponentType, SFC } from 'react'
import { connect } from 'react-redux'
import moment from "moment"

import { AppState, AppThunkDispatch, AppThunkAction } from '../../stores'
import { setServerClock } from '../../stores/ServerStatus'

const getServerClockAction = (): AppThunkAction => {
    return async (dispatch, getState, { serverStatusService }) => {
        let triedTimes = 0
        while (true) {
            try {
                triedTimes++
                const serverClock = await serverStatusService.getClock()
                const localClock = new Date()
                await dispatch(setServerClock(serverClock, localClock))
                return
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, triedTimes > 10 ? 10000 : 3000))
            }
        }
    }
}

export interface WithServerProps {
    localClock: Date,
    serverClock?: Date,
    dispatch: AppThunkDispatch
}

export interface WithServerState {
    serverClock?: Date
}

export const withServer = <P extends object>(Component: ComponentType<P>): ComponentType<{ serverClock?: Date }> => {
    class WithServer extends React.Component<P & WithServerProps, WithServerState> {

        private timer?: NodeJS.Timeout
        
        constructor(props: P & WithServerProps) {
            super(props)
            this.state = { serverClock: undefined }
        }
        
        tick = () => {
            if (this.props.serverClock) {
                const currentServerClock = new Date().getTime() - this.props.localClock.getTime() + this.props.serverClock.getTime()
                this.setState({ serverClock: moment(currentServerClock).toDate() })
            } else {
                this.setState({ serverClock: undefined })
            }
        }
        
        componentDidMount = () => {
            this.props.dispatch(getServerClockAction())
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
        localClock: state.server.localClock
    })
    return connect(mapStateToProps)(WithServer as any)
}
