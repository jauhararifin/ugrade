export class ContestError extends Error {
  constructor(m: string = 'Contest Error') {
    super(m)
    Object.setPrototypeOf(this, ContestError.prototype)
  }
}
