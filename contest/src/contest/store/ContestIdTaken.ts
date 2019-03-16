import { ContestStoreError } from './ContestStoreError'

export class ContestIdTaken extends ContestStoreError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ContestIdTaken.prototype)
  }
}
