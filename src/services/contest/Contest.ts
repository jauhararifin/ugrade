export interface Language {
  id: number
  name: string
}

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
}

export interface ContestDetail extends Contest {
  description: string
  permittedLanguages: Language[]
}
