import { ContestError } from './ContestError'

export class NoSuchContest extends ContestError {
  constructor(m: string = 'No Such Contest') {
    super(m)
    Object.setPrototypeOf(this, NoSuchContest.prototype)
  }
}
