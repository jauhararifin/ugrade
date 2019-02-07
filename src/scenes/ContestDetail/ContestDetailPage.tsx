import React, { SFC } from "react"

import "./styles.css"

import TopNavigationBar from "../../components/TopNavigationBar"
import { Contest } from "../../stores/Contest"
import { ContestDetailSidebar } from "./Sidebar"

export interface ContestDetailPageProps {
    contest: Contest
    rank?: number
    serverClock?: Date
}

export const ContestDetailPage: SFC<ContestDetailPageProps> = ({ contest, rank, serverClock }) => {

    return (
        <div className="contests-page">
            <TopNavigationBar />
            <div className="contests-panel">
                <ContestDetailSidebar contest={contest} rank={rank} serverClock={serverClock} />
                <div className="contests-content">
                </div>
            </div>
        </div>
    )

}

export default ContestDetailPage