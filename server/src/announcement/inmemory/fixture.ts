import lodash from 'lodash'
import {
  UserTest1,
  UserTest2,
  UserTest3,
  UserTest4,
} from 'ugrade/auth/inmemory'
import {
  ContestArkav4Final,
  ContestArkav4Qual,
  ContestArkav5Final,
  ContestArkav5Qual,
} from 'ugrade/contest/inmemory'
import { Announcement } from '../announcement'

export const AnnouncementExample1 = {
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

export const AnnouncementExample2 = {
  title: `Scoreboard`,
  content: `Ada masalah dengan scoreboard sehingga untuk sementara scoreboard tidak dapat ditampilkan. Kami sedang berusaha memperbaikinya, mohon maaf atas ketidaknyamanannya. Terima kasih.`,
  issuedTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  read: true,
}

export const AnnouncementExample3 = {
  title: `Scoreboard Sudah Muncul`,
  content: `Scoreboard sudah bisa ditampilkan. Terima kasih atas kesabarannya!`,
  issuedTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
  read: false,
}

export const announcements: Announcement[] = [
  {
    ...AnnouncementExample1,
    id: '00000000000000000000000000000001',
    contestId: ContestArkav4Qual.id,
    issuerId: UserTest1.id,
  },
  {
    ...AnnouncementExample2,
    id: '00000000000000000000000000000002',
    contestId: ContestArkav4Qual.id,
    issuerId: UserTest1.id,
  },
  {
    ...AnnouncementExample3,
    id: '00000000000000000000000000000003',
    contestId: ContestArkav4Qual.id,
    issuerId: UserTest1.id,
  },

  {
    ...AnnouncementExample1,
    id: '00000000000000000000000000000004',
    contestId: ContestArkav4Final.id,
    issuerId: UserTest2.id,
  },
  {
    ...AnnouncementExample2,
    id: '00000000000000000000000000000005',
    contestId: ContestArkav4Final.id,
    issuerId: UserTest2.id,
  },
  {
    ...AnnouncementExample3,
    id: '00000000000000000000000000000006',
    contestId: ContestArkav4Final.id,
    issuerId: UserTest2.id,
  },

  {
    ...AnnouncementExample1,
    id: '00000000000000000000000000000007',
    contestId: ContestArkav5Qual.id,
    issuerId: UserTest3.id,
  },
  {
    ...AnnouncementExample2,
    id: '00000000000000000000000000000008',
    contestId: ContestArkav5Qual.id,
    issuerId: UserTest3.id,
  },
  {
    ...AnnouncementExample3,
    id: '00000000000000000000000000000009',
    contestId: ContestArkav5Qual.id,
    issuerId: UserTest3.id,
  },

  {
    ...AnnouncementExample1,
    id: '00000000000000000000000000000010',
    contestId: ContestArkav5Final.id,
    issuerId: UserTest4.id,
  },
  {
    ...AnnouncementExample2,
    id: '00000000000000000000000000000011',
    contestId: ContestArkav5Final.id,
    issuerId: UserTest4.id,
  },
  {
    ...AnnouncementExample3,
    id: '00000000000000000000000000000012',
    contestId: ContestArkav5Final.id,
    issuerId: UserTest4.id,
  },
]
