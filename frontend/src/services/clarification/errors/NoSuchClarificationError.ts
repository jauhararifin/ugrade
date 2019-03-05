import { ClarificationError } from './ClarificationError'

export class NoSuchClarificationError extends ClarificationError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchClarificationError.prototype)
  }
}
