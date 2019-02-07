import { Problem } from "../problem/Problem"
import { Announcement } from "./Announcement"

export interface Contest {
    id: number
    slug: string
    name: string
    shortDescription: string
    description: string
    startTime: Date
    freezed: boolean
    finishTime: Date
    registered: boolean

    problems?: Problem[]
    announcements?: Announcement[]
}
