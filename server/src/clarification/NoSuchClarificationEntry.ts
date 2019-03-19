import { ClarificationError } from './ClarificationError'

export class NoSuchClarificationEntry extends ClarificationError {
  constructor(m: string = 'No Such Clarification Entry') {
    super(m)
    Object.setPrototypeOf(this, NoSuchClarificationEntry.prototype)
  }
}
