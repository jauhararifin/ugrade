export class NoSuchLanguage extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchLanguage.prototype)
  }
}
