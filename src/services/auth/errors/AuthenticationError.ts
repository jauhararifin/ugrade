export class AuthenticationError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}
