import { ContestStoreError } from './ContestStoreError'

export class NoSuchContest extends ContestStoreError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchContest.prototype)
  }
}
