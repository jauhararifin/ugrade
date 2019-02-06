export interface Contest {
    id: number
    slug: string
    name: string
    shortDescription: string
    description: string
    startTime: Date
    finishTime: Date
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