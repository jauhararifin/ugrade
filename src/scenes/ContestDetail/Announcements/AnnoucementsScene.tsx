import React, { Component, ComponentType } from "react"
import { connect } from "react-redux"
import { compose, Dispatch } from "redux"
import { RouteComponentProps } from "react-router"

import { AppState, AppThunkDispatch, AppAction } from "../../../stores"
import { Contest, readAnnouncements, Announcement } from "../../../stores/Contest"
import { userOnly } from "../../../helpers/auth"
import { withServer } from "../../../helpers/server"
import { AnnouncementsView } from "./AnnouncementsView"
import { getContestAnnouncement } from "./action"

export interface AnnouncementsSceneRoute {
    contestId: string
}

export interface AnnouncementsSceneProps extends RouteComponentProps<AnnouncementsSceneRoute> {
    contest?: Contest
    dispatch: AppThunkDispatch & Dispatch<AppAction>
    serverClock?: Date
}

export class AnnouncementsScene extends Component<AnnouncementsSceneProps> {
    private loadingAnnouncement = false
    componentDidMount() {
        this.reloadAnnoucements()
    }
    componentDidUpdate() {
        this.reloadAnnoucements()
    }
    reloadAnnoucements = () => {
        if (this.props.contest && !this.props.contest.announcements && !this.loadingAnnouncement) {
            this.loadingAnnouncement = true
            this.props.dispatch(getContestAnnouncement(this.props.contest.id))
                .then(annoucements => this.props.dispatch(
                    readAnnouncements(annoucements.map(
                        (it: Announcement): number => it.id
                    )
                )))
                .finally(() => this.loadingAnnouncement = false)
        }
    }
    render() {
        return <AnnouncementsView contest={this.props.contest} serverClock={this.props.serverClock} />
    }
}

const mapStateToProps = (state: AppState) => ({
    contest: state.contest.currentContest
})

export default compose<ComponentType>(
    userOnly(),
    connect(mapStateToProps),
    withServer,
)(AnnouncementsScene)