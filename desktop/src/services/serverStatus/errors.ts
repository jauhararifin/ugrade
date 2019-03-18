export class NetworkError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}
