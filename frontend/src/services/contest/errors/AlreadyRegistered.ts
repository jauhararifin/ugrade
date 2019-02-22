export class AlreadyRegistered extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, AlreadyRegistered.prototype)
  }
}
