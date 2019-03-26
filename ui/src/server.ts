import { ApolloClient, gql } from 'apollo-boost'
import { action, computed, observable, runInAction } from 'mobx'
import { convertGraphqlError } from './graphqlError'

export class ServerStore {
  @observable online: boolean = true
  @observable clock?: Date
  @observable localClock: Date = new Date()
  @observable private myClock = new Date()

  private client: ApolloClient<{}>

  constructor(client: ApolloClient<{}>) {
    this.client = client
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

  @action loadClock = async () => {
    if (!this.clock) {
      const now = new Date()
      try {
        const response = await this.client.query({
          query: gql`
            {
              clock
            }
          `,
        })
        const clock = new Date(response.data.clock)
        const localTime = (new Date().getTime() + now.getTime()) / 2.0
        runInAction(() => {
          this.localClock = new Date(localTime)
          this.clock = clock
          this.online = true
        })
      } catch (error) {
        throw convertGraphqlError(error)
      }
    }
  }
}
