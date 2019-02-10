
export interface Problem {
    id: number
    slug: string
    name: string
    description: string
}

export interface Announcement {
    id: string
    title: string
    content: string
    issuedTime: Date
}

export interface Contest {
    id: number
    slug: string
    name: string
    shortDescription: string
    description: string
    startTime: Date
    finishTime: Date
    freezed: boolean
    registered: boolean

    problems?: Problem[]
    announcements?: Announcement[]
}

export interface ContestDetail extends Contest {
}

export interface ContestState {
    contests: Contest[]
    currentContest?: ContestDetail
}

export const initialValue: ContestState = {
    contests: []
}