import React, { Component, ComponentType } from "react"
import { compose } from "redux"
import { Route } from "react-router"

import ContestOverview from "./ContestOverview"
import { userOnly } from "../../helpers/auth"
import { ContestDetailPage } from "./ContestDetailPage"

export class ContestDetailScene extends Component {
    render() {
        return (
            <ContestDetailPage>
                <Route path="/contests/:contestId/" exact component={ContestOverview} />
                <Route path="/contests/:contestId/overview" exact component={ContestOverview}  />
            </ContestDetailPage>
        )
    }
}

export default compose<ComponentType>(
    userOnly(),
)(ContestDetailScene)