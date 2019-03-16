export class ContestStoreError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ContestStoreError.prototype)
  }
}
