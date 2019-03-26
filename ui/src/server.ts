import { computed, observable } from 'mobx'

export class ServerStore {
  @observable online: boolean = true
  @observable clock?: Date
  @observable localClock: Date = new Date()

  @observable private myClock = new Date()

  constructor() {
    window.addEventListener('keyup', event => {
      const escapeKey = 'Escape'
      if (event.code === escapeKey) this.online = !this.online
    })

    setInterval(() => {
      this.myClock = new Date()
    }, 1000)
  }

  @computed get serverClock() {
    if (!this.clock) return undefined
    return new Date(this.myClock.getTime() - this.localClock.getTime() + this.clock.getTime())
  }
}
