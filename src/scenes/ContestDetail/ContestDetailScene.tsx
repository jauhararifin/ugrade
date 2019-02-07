import React, { Component, ComponentType } from "react"
import { connect } from "react-redux"
import { compose } from "redux"

import ContestDetailPage from "./ContestDetailPage"
import { AppState, AppThunkDispatch } from "../../stores"
import { Contest } from "../../stores/Contest"
import { userOnly } from "../../helpers/auth"
import { RouteComponentProps } from "react-router"
import { getContestById } from "./actions";

export interface ContestDetailSceneRoute {
    contestId: string
}

export interface ContestDetailSceneProps extends RouteComponentProps<ContestDetailSceneRoute> {
    contest: Contest
    dispatch: AppThunkDispatch
}

export class ContestDetailScene extends Component<ContestDetailSceneProps> {
    componentDidMount() {
        const contestId = Number(this.props.match.params.contestId)
        this.props.dispatch(getContestById(contestId))
    }
    render() {
        return <ContestDetailPage contest={this.props.contest} />
    }
}

const mapStateToProps = (state: AppState) => ({
    contest: state.contest.currentContest
})

export default compose<ComponentType>(
    userOnly(),
    connect(mapStateToProps)
)(ContestDetailScene)