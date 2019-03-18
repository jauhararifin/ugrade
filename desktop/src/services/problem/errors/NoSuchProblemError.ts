import { ProblemError } from './ProblemError'

export class NoSuchProblemError extends ProblemError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchProblemError.prototype)
  }
}
