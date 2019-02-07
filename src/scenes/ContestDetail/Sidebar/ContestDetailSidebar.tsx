import React, { SFC } from "react"
import { H5, H2, H6, Button, Alignment, Intent, Divider } from "@blueprintjs/core"
import classnames from "classnames"
import moment from "moment"

import "./styles.css"

import SidebarMiniCard from "../../../components/SidebarMiniCard"
import { Contest } from "../../../stores/Contest"
import ContestSubmitForm from "../ContestSubmitForm"

export interface ContestDetailSidebarProps {
    contest?: Contest
    rank?: number
    serverClock?: Date
}

const durationToStr = (duration: moment.Duration | number): string => {
    const rtime = moment.duration(duration)
    const pad = (x: number): string => x < 10 ? `0${x.toString()}` : x.toString()
    return rtime.asDays() > 1 ? rtime.humanize() : `${pad(rtime.hours())}:${pad(rtime.minutes())}:${pad(rtime.seconds())}`
}

export const ContestDetailSidebar: SFC<ContestDetailSidebarProps> = ({ contest, serverClock, rank }) => {
    
    const loading = !contest
    const participated = contest && contest.registered
    const started = serverClock && contest && serverClock >= contest.startTime
    const ended = serverClock && contest && serverClock >= contest.finishTime
    const running = started && !ended
    const freezed = contest && contest.freezed
    const remainingTime = contest && serverClock ? moment.duration(moment(contest.finishTime).diff(moment(serverClock))) : undefined
    const remainingTimeStr = remainingTime ? durationToStr(remainingTime) : "--:--:--"
    const startedIn = contest && serverClock ? durationToStr(moment.duration(moment(contest.startTime).diff(moment(serverClock)))) : undefined
    const skeletonClass = classnames({"bp3-skeleton": loading})

    return (
        <div className="contests-navigation">
            { contest ? <H5>{ contest.name }</H5> :  <H2 className="bp3-skeleton">{ "Fake" }</H2> }
            <p className={skeletonClass} style={{textAlign: "left"}}>{contest && contest.shortDescription}</p>

            <div className="contest-status-bottom">

                {(function(){

                    if (loading)
                        return (<React.Fragment>
                            <SidebarMiniCard className={classnames(skeletonClass, "contest-status-rank", {freezed})}>
                                <H6>Rank</H6><H2>Fake</H2>
                            </SidebarMiniCard>
                            <SidebarMiniCard className={classnames(skeletonClass, "contest-status-time")}>
                                <H6>Remaining Time</H6><H2>Fake Fake</H2>
                            </SidebarMiniCard>
                        </React.Fragment>)
                    
                    else if (!started)
                        return (<SidebarMiniCard className={classnames(skeletonClass, "contest-status-time")}>
                            <H6>Started In</H6><H2>{ startedIn }</H2>
                        </SidebarMiniCard>)
                    
                    else if (running)
                        return (<React.Fragment>
                                { participated && (<SidebarMiniCard className={classnames(skeletonClass, "contest-status-rank", {freezed})}>
                                    <H6>Rank</H6><H2>{ contest && rank ? rank : "-" }</H2>
                                </SidebarMiniCard>)}
                                <SidebarMiniCard className={classnames(skeletonClass, "contest-status-time")}>
                                    <H6>Remaining Time</H6><H2>{ remainingTimeStr }</H2>
                                </SidebarMiniCard>
                        </React.Fragment>)

                    else if (ended)
                        return (<React.Fragment>
                            { participated && (<SidebarMiniCard className={classnames(skeletonClass, "contest-status-rank", {freezed})}>
                                <H6>Rank</H6><H2>{ contest && rank ? rank : "-" }</H2>
                            </SidebarMiniCard>)}
                            <SidebarMiniCard className={classnames(skeletonClass, "contest-status-time")}>
                                <H2>Contest Ended</H2>
                            </SidebarMiniCard>
                        </React.Fragment>)
                    
                })()}
            </div>

            <div className={classnames(["contest-menu",skeletonClass])}>
                { loading ? [0,0,0].map(() => <Button fill text="Fake"/>) : (<React.Fragment>
                    <Button icon="home" intent={Intent.PRIMARY} fill minimal alignText={Alignment.LEFT} disabled={!contest} text="Overview"/>
                    { started && <Button icon="notifications" fill minimal alignText={Alignment.LEFT} disabled={!contest} text="Announcements"/> }
                    { started && <Button icon="book" fill minimal alignText={Alignment.LEFT} disabled={!contest} text="Problems"/> }
                    { participated && started && <Button icon="chat" fill minimal alignText={Alignment.LEFT} disabled={!contest} text="Clarifications"/> }
                    { participated && started && <Button icon="layers" fill minimal alignText={Alignment.LEFT} disabled={!contest} text="Submissions"/> }
                    { started && <Button icon="th-list" fill minimal alignText={Alignment.LEFT} disabled={!contest} text="Scoreboard"/> }
                </React.Fragment>)}
            </div>
            <div className={classnames(skeletonClass, "contest-submit-solution")}>
                { loading ? <ContestSubmitForm /> : participated && started && <ContestSubmitForm /> }
            </div>
            <div className={classnames(skeletonClass, "contest-registration")}>
                { loading ? <Button text="Fake" /> : !participated && !started && <Button fill disabled={!contest} intent={Intent.PRIMARY} text="Register"/>}
            </div>
        </div>
    )
}