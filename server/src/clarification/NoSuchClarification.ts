import { ClarificationError } from './ClarificationError'

export class NoSuchClarification extends ClarificationError {
  constructor(m: string = 'No Such Clarification') {
    super(m)
    Object.setPrototypeOf(this, NoSuchClarification.prototype)
  }
}
