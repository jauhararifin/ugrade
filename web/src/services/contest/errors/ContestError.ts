export class ContestError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ContestError.prototype)
  }
}
