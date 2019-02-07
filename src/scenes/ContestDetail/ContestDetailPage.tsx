import React, { SFC } from "react"
import { H5, H2, H6, Button, Alignment, Intent } from "@blueprintjs/core"
import classnames from "classnames"
import moment from "moment"

import "./styles.css"

import TopNavigationBar from "../../components/TopNavigationBar"
import SidebarMiniCard from "../../components/SidebarMiniCard"
import { Contest } from "../../stores/Contest"
import ContestSubmitForm from "./ContestSubmitForm"

export interface ContestDetailProps {
    contest: Contest
    rank?: number
    remainingTime?: number
}

export const ContestDetailPage: SFC<ContestDetailProps> = ({ contest, rank, remainingTime }) => {
    const skeletonClass = classnames({"bp3-skeleton": !contest})
    let remainingTimeStr = "--:--:--"
    if (contest && remainingTime) {
        if (remainingTime >= 0) {
            const rtime = moment.duration(remainingTime)
            const pad = (x: number): string => x < 10 ? `0${x.toString()}` : x.toString()
            remainingTimeStr = rtime.asDays() > 1 ? rtime.humanize() : `${pad(rtime.hours())}:${pad(rtime.minutes())}:${pad(rtime.seconds())}`
        } else
            remainingTimeStr = "Contest Ended"
    }

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
                        <H2>{ contest && rank ? rank : "-" }</H2>
                    </SidebarMiniCard>
                    <SidebarMiniCard className={classnames(skeletonClass, "contest-status-time")}>
                        <H6>Remaining Time</H6>
                        <H2>{ remainingTimeStr }</H2>
                    </SidebarMiniCard>
                </div>
                <div className="contest-menu">
                    <Button icon="home" intent={Intent.PRIMARY} fill minimal alignText={Alignment.LEFT} className={skeletonClass} disabled={!contest} text="Overview"/>
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