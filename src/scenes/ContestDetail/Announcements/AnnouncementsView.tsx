import React, { SFC } from "react"
import ReactMarkdown from "react-markdown"
import { H1, Card, H3, Elevation } from "@blueprintjs/core"
import moment from "moment"
import "github-markdown-css"
import classnames from "classnames"

import "./styles.css"

import { Contest } from "../../../stores/Contest"

export interface AnnouncementsViewProps {
    contest?: Contest
    serverClock?: Date
}

export const AnnouncementsView: SFC<AnnouncementsViewProps> = ({ contest, serverClock }) => {
    const loading = !contest || !contest.announcements 
    const currentMoment = moment(serverClock || new Date())
    return (
        <div className="contest-announcements">
            <H1 className={classnames("header", {"bp3-skeleton": loading})}>Announcements</H1>
            <div>
                { loading && <Card className="bp3-skeleton item">{"lorem ipsum".repeat(100)}</Card> }

                { contest && contest.announcements && contest.announcements.length === 0 && <H3>No Announcements Yet</H3> }

                { contest && contest.announcements && contest.announcements.map(announcement => (
                    <Card className="item" elevation={announcement.read ? Elevation.ZERO : Elevation.TWO}>
                        <div className="header">
                            <H3 className="title">{announcement.title}</H3>
                            <p className="info">{
                                moment(announcement.issuedTime).from(currentMoment)
                            }</p>
                        </div>
                        <ReactMarkdown source={announcement.content} />
                    </Card>
                ))}
            </div>
        </div>
    )

}

export default AnnouncementsView