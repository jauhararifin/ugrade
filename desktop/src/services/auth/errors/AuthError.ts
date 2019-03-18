export class AuthError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, AuthError.prototype)
  }
}
