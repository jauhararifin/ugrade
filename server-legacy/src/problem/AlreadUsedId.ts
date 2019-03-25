import { ProblemError } from './ProblemError'

export class AlreadyUsedId extends ProblemError {
  constructor(m: string = 'Problem ID Already Used') {
    super(m)
    Object.setPrototypeOf(this, AlreadyUsedId.prototype)
  }
}
