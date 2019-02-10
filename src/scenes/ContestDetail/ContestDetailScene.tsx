import React, { Component, ComponentType } from "react"
import { compose } from "redux"
import { RouteComponentProps, Switch, Route } from "react-router"

import ContestOverview from "./ContestOverview"
import { AppState, AppThunkDispatch } from "../../stores"
import { userOnly } from "../../helpers/auth"
import { getContestById } from "./actions"
import { withServer } from "../../helpers/server"

export interface ContestDetailSceneRoute {
    contestId: string
}

export interface ContestDetailSceneProps extends RouteComponentProps<ContestDetailSceneRoute> {
    dispatch: AppThunkDispatch
}

export class ContestDetailScene extends Component<ContestDetailSceneProps> {
    componentDidMount() {
        const contestId = Number(this.props.match.params.contestId)
        this.props.dispatch(getContestById(contestId))
    }
    render() {
        return (
            <Switch>
                <Route path="/contests/:contestId/" exact component={ContestOverview} />
                <Route path="/contests/:contestId/overview" exact component={ContestOverview}  />
            </Switch>
        )
    }
}

export default compose<ComponentType>(
    userOnly(),
    withServer,
)(ContestDetailScene)