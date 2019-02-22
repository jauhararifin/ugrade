export class ContestAlreadyStarted extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ContestAlreadyStarted.prototype)
  }
}
