import { LanguageStoreError } from './LanguageStoreError'

export class NoSuchLanguage extends LanguageStoreError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchLanguage.prototype)
  }
}
