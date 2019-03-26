import { observable } from 'mobx'

export interface User {
  id: string
  name?: string
  username?: string
  email: string
  permissions: string[]
}

export class AuthStore {
  @observable token: string = ''
  @observable me?: User
}
