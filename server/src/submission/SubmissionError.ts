export class SubmissionError extends Error {
  constructor(m: string = 'Submission Error') {
    super(m)
    Object.setPrototypeOf(this, SubmissionError.prototype)
  }
}
