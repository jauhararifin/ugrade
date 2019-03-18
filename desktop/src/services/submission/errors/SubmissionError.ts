export class SubmissionError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, SubmissionError.prototype)
  }
}
