export class UserStoreError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, UserStoreError.prototype)
  }
}
