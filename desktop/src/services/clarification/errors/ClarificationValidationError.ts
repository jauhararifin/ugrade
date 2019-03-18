import { ClarificationError } from './ClarificationError'

export class ClarificationValidationError extends ClarificationError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ClarificationValidationError.prototype)
  }
}
