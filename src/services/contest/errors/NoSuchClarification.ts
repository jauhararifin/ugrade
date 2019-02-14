export class NoSuchClarification extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchClarification.prototype)
  }
}
