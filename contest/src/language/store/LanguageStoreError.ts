export class LanguageStoreError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, LanguageStoreError.prototype)
  }
}
