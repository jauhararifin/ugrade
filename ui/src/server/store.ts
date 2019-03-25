import { observable } from 'mobx'

export class ServerStore {
  @observable online: boolean = true
  @observable clock?: Date
  @observable localClock: Date = new Date()

  constructor() {
    window.addEventListener('keyup', event => {
      const escapeKey = 'Escape'
      if (event.code === escapeKey) this.online = !this.online
    })
  }
}
