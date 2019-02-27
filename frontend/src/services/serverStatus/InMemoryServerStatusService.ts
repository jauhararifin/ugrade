import { NetworkError } from './errors'
import { ServerStatusService } from './ServerStatusService'

export class InMemoryServerStatusService implements ServerStatusService {
  private isOnline: boolean = true

  constructor() {
    window.addEventListener('keyup', event => {
      const escapeKey = 'Escape'
      if (event.code === escapeKey) this.isOnline = !this.isOnline
    })
  }

  async getClock(): Promise<Date> {
    const date = new Date()
    await new Promise(resolve => setTimeout(resolve, 500))
    return date
  }

  async ping() {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (!this.isOnline) throw new NetworkError('You Are Currently Offline')
  }
}
