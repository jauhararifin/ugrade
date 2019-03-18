import { ProblemError } from './ProblemError'

export class ProblemValidationError extends ProblemError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ProblemValidationError.prototype)
  }
}
