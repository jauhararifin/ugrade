export interface ContestModel {
  id: string
  shortId: string
  name: string
  shortDescription: string
  description: string
  startTime: Date
  freezed: boolean
  finishTime: Date
  permittedLanguageIds: string[]
}
