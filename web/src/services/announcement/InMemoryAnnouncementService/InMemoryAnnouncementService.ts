import lodash from 'lodash'
import loremIpsum from 'lorem-ipsum'
import { globalErrorCatcher } from 'ugrade/common'
import { AuthService } from 'ugrade/services/auth'
import { simplePublisher } from 'ugrade/utils'
import { Announcement } from '../Announcement'
import {
  AnnouncementsCallback,
  AnnouncementService,
  AnnouncementsUnsubscribe,
} from '../AnnouncementService'
import { AnnouncementValidationError } from '../errors'
import { announcementsMap } from './fixtures'

export class InMemoryAnnouncementService implements AnnouncementService {
  private authService: AuthService
  private announcementMap: { [contestId: string]: Announcement[] }

  constructor(authService: AuthService) {
    this.authService = authService
    this.announcementMap = announcementsMap

    this.handleSubscribe().catch(globalErrorCatcher)
  }

  async getAnnouncements(token: string): Promise<Announcement[]> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId
    if (!this.announcementMap[contestId]) this.announcementMap[contestId] = []
    return lodash.cloneDeep(this.announcementMap[contestId])
  }

  async createAnnouncement(
    token: string,
    title: string,
    content: string
  ): Promise<Announcement> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId
    if (title === 'Forbidden') {
      throw new AnnouncementValidationError('Forbidden Title Name')
    }
    const newAnnouncement = {
      id: Math.round(Math.random() * 100000).toString(),
      title,
      content,
      read: true,
      issuedTime: new Date(),
    }
    if (!this.announcementMap[contestId]) this.announcementMap[contestId] = []
    this.announcementMap[contestId].push(newAnnouncement)
    return lodash.cloneDeep(newAnnouncement)
  }

  subscribeAnnouncements(
    token: string,
    callback: AnnouncementsCallback
  ): AnnouncementsUnsubscribe {
    return simplePublisher(
      this.getAnnouncements.bind(this, token),
      callback,
      lodash.isEqual,
      lodash.difference
    )
  }

  async readAnnouncements(token: string, ids: string[]): Promise<void> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId
    this.announcementMap[contestId]
      .filter(i => ids.includes(i.id))
      .forEach(val => (val.read = true))
  }

  private async handleSubscribe() {
    setInterval(() => {
      for (const contestId of Object.keys(this.announcementMap)) {
        const newAnnouncement: Announcement = {
          id: Math.round(Math.random() * 100000).toString(),
          title: loremIpsum({ count: 4, units: 'words' }),
          content: loremIpsum({ count: 1, units: 'paragraphs' }),
          issuedTime: new Date(Date.now()),
          read: false,
        }
        this.announcementMap[contestId].push(newAnnouncement)
      }
    }, 60 * 1000)
  }
}
