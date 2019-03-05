import lodash from 'lodash'
import {
  ContestArkav4Final,
  ContestArkav4Qual,
  ContestArkav5Final,
  ContestArkav5Qual,
} from 'ugrade/services/contest/InMemoryContestService'
import { Announcement } from '../Announcement'

export const AnnouncementExample1: Announcement = {
  id: '1',
  title: `Term and Condition`,
  content: `By competing in TLX contests, you agree that:
  
- You will not collaborate with any other contestants.
- You will not use fake or multiple TLX accounts, other than your own account.
- You will not try to hack or attack the contest system in any way.

Failure to comply with the above rules can result to a disqualification or ban.
    
Enjoy the contest!`,
  issuedTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
  read: true,
}

export const AnnouncementExample2: Announcement = {
  id: '2',
  title: `Scoreboard`,
  content: `Ada masalah dengan scoreboard sehingga untuk sementara scoreboard tidak dapat ditampilkan. Kami sedang berusaha memperbaikinya, mohon maaf atas ketidaknyamanannya. Terima kasih.`,
  issuedTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  read: true,
}

export const AnnouncementExample3: Announcement = {
  id: '3',
  title: `Scoreboard Sudah Muncul`,
  content: `Scoreboard sudah bisa ditampilkan. Terima kasih atas kesabarannya!`,
  issuedTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
  read: false,
}

export const annoucements: Announcement[] = [
  AnnouncementExample1,
  AnnouncementExample2,
  AnnouncementExample3,
]

export const announcementsMap = {
  [ContestArkav4Qual.id]: lodash.cloneDeep(annoucements),
  [ContestArkav4Final.id]: lodash.cloneDeep(annoucements),
  [ContestArkav5Qual.id]: lodash.cloneDeep(annoucements),
  [ContestArkav5Final.id]: lodash.cloneDeep(annoucements),
}
