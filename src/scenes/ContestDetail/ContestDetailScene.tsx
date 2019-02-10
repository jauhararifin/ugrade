import React, { Component, ComponentType } from "react"
import { compose } from "redux"
import { Route, Switch, withRouter, RouteComponentProps } from "react-router"

import ContestOverview from "./ContestOverview"
import { userOnly } from "../../helpers/auth"
import { ContestDetailPage } from "./ContestDetailPage"
import { TransitionGroup, CSSTransition } from "react-transition-group"

export interface ContestDetailSceneProps extends RouteComponentProps {
}

export class ContestDetailScene extends Component<ContestDetailSceneProps> {
    render() {
        return (
            <ContestDetailPage>
                <TransitionGroup className="eat-them-all">
                    <CSSTransition timeout={300} classNames="fade" key={this.props.location.pathname}>
                        <Switch location={this.props.location}>
                            <Route path="/contests/:contestId/" exact component={ContestOverview} />
                            <Route path="/contests/:contestId/overview" exact component={ContestOverview}  />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </ContestDetailPage>
        )
    }
}

export default compose<ComponentType>(
    userOnly(),
    withRouter
)(ContestDetailScene)