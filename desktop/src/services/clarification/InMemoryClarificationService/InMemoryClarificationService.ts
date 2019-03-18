import lodash from 'lodash'
import loremIpsum from 'lorem-ipsum'
import { globalErrorCatcher } from 'ugrade/common'
import { AuthService } from 'ugrade/services/auth'
import { simplePublisher } from 'ugrade/utils'
import { Clarification } from '../Clarification'
import { ClarificationEntry } from '../ClarificationEntry'
import {
  ClarificationsCallback,
  ClarificationService,
  ClarificationsUnsubscribe,
} from '../ClarificationService'
import { NoSuchClarificationError } from '../errors'
import { ClarificationValidationError } from '../errors/ClarificationValidationError'
import { clarificationMap } from './fixtures'

export class InMemoryClarificationService implements ClarificationService {
  private authService: AuthService
  private clarificationsMap: { [contestId: string]: Clarification[] }

  constructor(authService: AuthService) {
    this.authService = authService
    this.clarificationsMap = lodash.cloneDeep(clarificationMap)
    this.handleSubscription().catch(globalErrorCatcher)
  }

  async getClarifications(token: string): Promise<Clarification[]> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId
    if (!this.clarificationsMap[contestId]) {
      this.clarificationsMap[contestId] = []
    }
    return lodash.cloneDeep(this.clarificationsMap[contestId])
  }

  subscribeClarifications(
    token: string,
    callback: ClarificationsCallback
  ): ClarificationsUnsubscribe {
    return simplePublisher(this.getClarifications.bind(this, token), callback)
  }

  async createClarification(
    token: string,
    title: string,
    subject: string,
    content: string
  ): Promise<Clarification> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId
    if (title === 'Forbidden') {
      throw new ClarificationValidationError('Forbidden Title')
    }
    const clarification: Clarification = {
      id: Math.round(Math.random() * 100000).toString(),
      title,
      subject,
      issuedTime: new Date(),
      entries: [
        {
          id: Math.round(Math.random() * 100000).toString(),
          sender: me.username,
          content,
          read: true,
          issuedTime: new Date(),
        },
      ],
    }

    if (!this.clarificationsMap[contestId]) {
      this.clarificationsMap[contestId] = []
    }
    this.clarificationsMap[contestId].push(clarification)
    return lodash.cloneDeep(clarification)
  }

  async createClarificationEntry(
    token: string,
    clarificationId: string,
    content: string
  ): Promise<Clarification> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId

    if (content === 'Forbidden') {
      throw new ClarificationValidationError('Forbidden Content')
    }

    const clarification = lodash
      .values(this.clarificationsMap[contestId])
      .filter(c => c.id === clarificationId)
      .pop()

    if (!clarification) {
      throw new NoSuchClarificationError('No Such Clarification')
    }

    clarification.entries.push({
      id: Math.round(Math.random() * 100000).toString(),
      sender: me.username,
      issuedTime: new Date(),
      read: true,
      content,
    })
    return lodash.cloneDeep(clarification)
  }

  async readClarificationEntries(
    token: string,
    clarificationId: string,
    entryIds: string[]
  ): Promise<Clarification> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId

    const clarification = lodash.find(
      this.clarificationsMap[contestId],
      c => c.id === clarificationId
    )

    if (!clarification) {
      throw new NoSuchClarificationError('No Such Clarification')
    }

    clarification.entries.forEach(entry => {
      if (entryIds.includes(entry.id)) {
        entry.read = true
      }
    })
    return lodash.cloneDeep(clarification)
  }

  private async handleSubscription() {
    setInterval(() => {
      for (const contestId of Object.keys(this.clarificationsMap)) {
        const clarifArr = this.clarificationsMap[contestId]
        for (const clarif of clarifArr) {
          const newEntry: ClarificationEntry = {
            id: Math.round(Math.random() * 100000).toString(),
            sender: 'jury',
            content: loremIpsum({ count: 1, units: 'paragraphs' }),
            read: false,
            issuedTime: new Date(),
          }
          clarif.entries.push(newEntry)
        }
      }
    }, 60 * 1000)
  }
}
