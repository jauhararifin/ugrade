export class AuthError extends Error {
  constructor(m: string = 'Auth Error') {
    super(m)
    Object.setPrototypeOf(this, AuthError.prototype)
  }
}
