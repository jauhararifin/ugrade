import { ServerStatusService } from './ServerStatusService'

export class InMemoryServerStatusService implements ServerStatusService {
  async getClock(): Promise<Date> {
    const date = new Date()
    await new Promise(resolve => setTimeout(resolve, 500))
    return date
  }
}
