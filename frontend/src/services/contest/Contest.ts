export interface Language {
  id: string
  shortId: string
  name: string
}

export interface Contest {
  id: string
  shortId: string
  name: string
  shortDescription: string
  description: string
  startTime: Date
  freezed: boolean
  finishTime: Date
  permittedLanguages: Language[]
}
