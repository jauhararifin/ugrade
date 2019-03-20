import { ProblemError } from './ProblemError'

export class NoSuchProblem extends ProblemError {
  constructor(m: string = 'No Such Problem') {
    super(m)
    Object.setPrototypeOf(this, NoSuchProblem.prototype)
  }
}
