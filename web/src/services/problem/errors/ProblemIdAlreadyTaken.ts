import { ProblemError } from './ProblemError'

export class ProblemIdAlreadyTaken extends ProblemError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ProblemIdAlreadyTaken.prototype)
  }
}
