import { action } from 'mobx'

export class SubmissionStore {
  @action submit = (problemId: string, languageId: string, sourceCode: string) => {
    return null
  }
}
