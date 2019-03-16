import { Language } from 'ugrade/language/language'

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
