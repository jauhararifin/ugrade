export class NoSuchLanguage extends Error {
  constructor(m: string = 'No Such Language') {
    super(m)
    Object.setPrototypeOf(this, NoSuchLanguage.prototype)
  }
}
