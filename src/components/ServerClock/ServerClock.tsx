import React from 'react'
import { connect } from 'react-redux'
import { AppState, AppThunkDispatch } from '../../stores'
import { getServerClockAction } from './actions'
import moment from 'moment'

export interface ServerClockProps {
    localClock: Date,
    serverClock?: Date,
    undefinedText: string,
    textFormat: string,
    dispatch: AppThunkDispatch
}

export interface ServerClockState {
    displayedClock: string
}

export class ServerClock extends React.Component<ServerClockProps, ServerClockState> {
    
    private timer?: NodeJS.Timeout

    static defaultProps = {
        undefinedText: "Unknown",
        textFormat: "HH:mm:ss"
    }
    
    constructor(props: ServerClockProps) {
        super(props)
        this.state = { displayedClock: props.undefinedText }
    }
    
    tick = () => {
        if (this.props.serverClock) {
            const currentServerClock = new Date().getTime() - this.props.localClock.getTime() + this.props.serverClock.getTime()
            this.setState({ displayedClock: moment(currentServerClock).format(this.props.textFormat) })
        } else {
            this.setState({ displayedClock: this.props.undefinedText  })
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
        return <React.Fragment>{this.state.displayedClock}</React.Fragment>
    }
}

const mapStateToProps = (state: AppState) => ({
    serverClock: state.server.clock,
    localClock: state.server.localClock
})

export default connect(mapStateToProps)(ServerClock)