export class ClarificationError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ClarificationError.prototype)
  }
}
