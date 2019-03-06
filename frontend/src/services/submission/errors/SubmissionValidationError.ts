import { SubmissionError } from './SubmissionError'

export class SubmissionValidationError extends SubmissionError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, SubmissionValidationError.prototype)
  }
}
