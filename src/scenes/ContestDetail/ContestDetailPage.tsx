import React, { SFC } from "react"
import { H5, H2, H6, Button, Alignment } from "@blueprintjs/core"
import classnames from "classnames"

import "./styles.css"

import TopNavigationBar from "../../components/TopNavigationBar"
import SidebarMiniCard from "../../components/SidebarMiniCard"
import { Contest } from "../../stores/Contest"
import ContestSubmitForm from "./ContestSubmitForm"

export interface ContestDetailProps {
    contest: Contest
}

export const ContestDetailPage: SFC<ContestDetailProps> = ({ contest }) => {
    const skeletonClass = classnames({"bp3-skeleton": !contest})
    return (
        <div className="contests-page">
            <TopNavigationBar />
            <div className="contests-panel">
            <div className="contests-navigation">
                {
                    contest ? <H5>{ contest.name }</H5> :  <H2 className="bp3-skeleton">{ "Fake" }</H2>
                }
                <p style={{textAlign: "left"}}>{contest && contest.shortDescription}</p>

                <div className="contest-status-bottom">
                    <SidebarMiniCard className={classnames(skeletonClass, "contest-status-rank")}>
                        <H6>Rank</H6>
                        <H2>21</H2>
                    </SidebarMiniCard>
                    <SidebarMiniCard className={classnames(skeletonClass, "contest-status-time")}>
                        <H6>Remaining Time</H6>
                        <H2>02:10:23</H2>
                    </SidebarMiniCard>
                </div>
                <div className="contest-menu">
                    <Button icon="home" fill minimal alignText={Alignment.LEFT} className={skeletonClass} disabled={!contest} text="Overview"/>
                    <Button icon="notifications" fill minimal alignText={Alignment.LEFT} className={skeletonClass} disabled={!contest} text="Announcements"/>
                    <Button icon="book" fill minimal alignText={Alignment.LEFT} className={skeletonClass} disabled={!contest} text="Problems"/>
                    <Button icon="chat" fill minimal alignText={Alignment.LEFT} className={skeletonClass} disabled={!contest} text="Clarifications"/>
                    <Button icon="layers" fill minimal alignText={Alignment.LEFT} className={skeletonClass} disabled={!contest} text="Submissions"/>
                    <Button icon="th-list" fill minimal alignText={Alignment.LEFT} className={skeletonClass} disabled={!contest} text="Scoreboard"/>
                </div>
                <div className={classnames(skeletonClass, "contest-submit-solution")}>
                    <ContestSubmitForm />
                </div>
            </div>

            <div className="contests-content">
            </div>
            </div>
        </div>
    )
}

export default ContestDetailPage