export interface Contest {
    id: number
    slug: string
    name: string
    shortDescription: string
    description: string
    startTime: Date
    finishTime: Date
    content?: ContestContent
}

export interface ContestContent {
}