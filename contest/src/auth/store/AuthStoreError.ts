export class AuthStoreError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, AuthStoreError.prototype)
  }
}
