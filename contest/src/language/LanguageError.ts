export class LanguageError extends Error {
  constructor(m: string = 'Language Error') {
    super(m)
    Object.setPrototypeOf(this, LanguageError.prototype)
  }
}
