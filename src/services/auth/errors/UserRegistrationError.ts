export class UserRegistrationError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, UserRegistrationError.prototype)
  }
}
