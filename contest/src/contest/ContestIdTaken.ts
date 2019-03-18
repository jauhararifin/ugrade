import { ContestError } from './ContestError'

export class ContestIdTaken extends ContestError {
  constructor(m: string = 'Contest ID Already Taken') {
    super(m)
    Object.setPrototypeOf(this, ContestIdTaken.prototype)
  }
}
