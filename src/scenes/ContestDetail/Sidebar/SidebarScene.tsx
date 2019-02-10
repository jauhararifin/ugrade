import React, { Component, ComponentType } from "react"
import { compose } from "redux"
import { RouteComponentProps, withRouter } from "react-router"
import { push } from "connected-react-router"

import { AppThunkDispatch, AppState } from "../../../stores"
import { userOnly } from "../../../helpers/auth"
import { getContestById } from "./actions"
import { withServer } from "../../../helpers/server"
import { Menu } from "./SidebarView"
import { Contest } from "../../../stores/Contest"
import { connect } from "react-redux"
import { SidebarView } from "./SidebarView"

export interface SidebarSceneRoute {
    contestId: string
}

export interface ContestDetailSceneProps extends RouteComponentProps<SidebarSceneRoute> {
    contest?: Contest
    serverClock: Date
    dispatch: AppThunkDispatch
}

export interface ContestDetailSceneState {
    menu: Menu
}

export class ContestDetailScene extends Component<ContestDetailSceneProps, ContestDetailSceneState> {
    constructor(props: ContestDetailSceneProps) {
        super(props)
        this.state = {
            menu: Menu.Overview
        }
    }
    componentDidMount() {
        const contestId = Number(this.props.match.params.contestId)
        if (!this.props.contest)
            this.props.dispatch(getContestById(contestId))
    }
    onMenuChoosed = (menu: Menu) => {
        const contestId = Number(this.props.match.params.contestId)

        this.setState({ menu })
        switch (menu) {
            case Menu.Overview:
                return this.props.dispatch(push(`/contests/${contestId}`))
            case Menu.Announcements:
                return this.props.dispatch(push(`/contests/${contestId}/announcements`))
            case Menu.Problems:
                return this.props.dispatch(push(`/contests/${contestId}/problems`))
            case Menu.Clarifications:
                return this.props.dispatch(push(`/contests/${contestId}/clarifications`))
            case Menu.Submissions:
                return this.props.dispatch(push(`/contests/${contestId}/submissions`))
            case Menu.Scoreboard:
                return this.props.dispatch(push(`/contests/${contestId}/scoreboard`))
        }
    }
    render() {
        const { contest, serverClock } = this.props
        const menu = this.state.menu
        const rank = 21
        return <SidebarView
            contest={contest}
            rank={rank}
            serverClock={serverClock}
            menu={menu}
            onChoose={this.onMenuChoosed}
        />
    }
}

const mapStateToProps = (state: AppState) => ({
    contest: state.contest.currentContest
})

export default compose<ComponentType>(
    userOnly(),
    withServer,
    connect(mapStateToProps),
    withRouter,
)(ContestDetailScene)