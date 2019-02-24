import { ContestError } from './ContestError'

export class NoSuchContest extends ContestError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchContest.prototype)
  }
}
