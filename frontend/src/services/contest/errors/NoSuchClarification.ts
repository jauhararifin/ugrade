import { ContestError } from './ContestError'

export class NoSuchClarification extends ContestError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchClarification.prototype)
  }
}
