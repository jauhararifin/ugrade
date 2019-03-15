import { ContestError } from './ContestError'

export class NoSuchLanguage extends ContestError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchLanguage.prototype)
  }
}
