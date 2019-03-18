import { ContestError } from './ContestError'

export class ContestIdTaken extends ContestError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ContestIdTaken.prototype)
  }
}
