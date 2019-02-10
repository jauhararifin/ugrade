import React, { SFC } from "react"
import ReactMarkdown from "react-markdown"
import { H2 } from "@blueprintjs/core"
import "github-markdown-css"

import "./styles.css"

import TopNavigationBar from "../../../components/TopNavigationBar"
import { Contest } from "../../../stores/Contest"
import { ContestDetailSidebar, ContestMenu } from "../Sidebar"

export interface ContestOverviewPageProps {
    contest?: Contest
    rank?: number
    serverClock?: Date
}

export const ContestOverviewPage: SFC<ContestOverviewPageProps> = ({ contest, rank, serverClock }) => {
    return (
        <div className="full-page">
            <TopNavigationBar />
            <div className="contests-panel">
                <ContestDetailSidebar contest={contest} rank={rank} serverClock={serverClock} menu={ContestMenu.Overview} />
                <div className="contest-content">
                    <div className="contest-overview">
                        { contest ? <ReactMarkdown
                            className="markdown-body"
                            source={contest.description} />
                        : (<React.Fragment>
                            <H2 className="bp3-skeleton">Fake Contest Title</H2>
                            <p className="bp3-skeleton">{"fake content".repeat(100)}</p>
                            <p className="bp3-skeleton">{"fake content".repeat(100)}</p>
                        </React.Fragment>)}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ContestOverviewPage