import { SubmissionError } from './SubmissionError'

export class SubmissionSubmitError extends SubmissionError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, SubmissionSubmitError.prototype)
  }
}
