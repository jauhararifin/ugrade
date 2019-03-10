export class UserError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, UserError.prototype)
  }
}
