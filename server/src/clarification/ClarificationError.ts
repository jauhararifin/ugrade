export class ClarificationError extends Error {
  constructor(m: string = 'Clarification Error') {
    super(m)
    Object.setPrototypeOf(this, ClarificationError.prototype)
  }
}
