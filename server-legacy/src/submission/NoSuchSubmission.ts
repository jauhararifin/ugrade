import { SubmissionError } from './SubmissionError'

export class NoSuchSubmission extends SubmissionError {
  constructor(m: string = 'No Such Submission') {
    super(m)
    Object.setPrototypeOf(this, NoSuchSubmission.prototype)
  }
}
