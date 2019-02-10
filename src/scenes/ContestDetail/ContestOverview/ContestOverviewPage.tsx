import React, { SFC } from "react"
import ReactMarkdown from "react-markdown"
import { H2 } from "@blueprintjs/core"
import "github-markdown-css"

import "./styles.css"

import { Contest } from "../../../stores/Contest"

export interface ContestOverviewPageProps {
    contest?: Contest
}

export const ContestOverviewPage: SFC<ContestOverviewPageProps> = ({ contest }) => (
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
)

export default ContestOverviewPage