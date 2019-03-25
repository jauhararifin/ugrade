export class ProblemError extends Error {
  constructor(m: string = 'Problem Error') {
    super(m)
    Object.setPrototypeOf(this, ProblemError.prototype)
  }
}
