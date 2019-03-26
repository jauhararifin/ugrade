import { observable } from 'mobx'

export class AuthStore {
  @observable token: string = ''
}
