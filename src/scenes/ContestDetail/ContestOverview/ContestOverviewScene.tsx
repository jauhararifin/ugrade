import React, { Component, ComponentType } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { RouteComponentProps } from "react-router"

import { AppState, AppThunkDispatch } from "../../../stores"
import { Contest } from "../../../stores/Contest"
import { userOnly } from "../../../helpers/auth"
import { withServer } from "../../../helpers/server"
import ContestOverviewPage from "./ContestOverviewPage"

export interface ContestDetailSceneRoute {
    contestId: string
}

export interface ContestDetailSceneProps extends RouteComponentProps<ContestDetailSceneRoute> {
    contest?: Contest
    dispatch: AppThunkDispatch
    serverClock?: Date
}

export class ContestDetailScene extends Component<ContestDetailSceneProps> {
    render() {
        const { contest, serverClock } = this.props
        return <ContestOverviewPage contest={contest} rank={21} serverClock={serverClock} />
    }
}

const mapStateToProps = (state: AppState) => ({
    contest: state.contest.currentContest
})

export default compose<ComponentType>(
    userOnly(),
    connect(mapStateToProps),
    withServer,
)(ContestDetailScene)