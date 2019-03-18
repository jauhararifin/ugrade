import lodash from 'lodash'
import loremIpsum from 'lorem-ipsum'
import {
  ContestArkav4Final,
  ContestArkav4Qual,
  ContestArkav5Final,
  ContestArkav5Qual,
} from 'ugrade/services/contest/InMemoryContestService/'
import { Clarification } from '../Clarification'

export const SampleClarification1: Clarification = {
  id: Math.round(Math.random() * 100000).toString(),
  title: loremIpsum({ count: 4, units: 'words' }),
  subject: 'General Issue',
  issuedTime: new Date(),
  entries: [
    {
      id: Math.round(Math.random() * 100000).toString(),
      sender: 'test',
      read: true,
      issuedTime: new Date(),
      content: loremIpsum({ count: 1, units: 'paragraphs' }),
    },
  ],
}

export const SampleClarification2: Clarification = {
  id: Math.round(Math.random() * 100000).toString(),
  title: loremIpsum({ count: 4, units: 'words' }),
  subject: 'Technical Issue',
  issuedTime: new Date(),
  entries: [
    {
      id: Math.round(Math.random() * 100000).toString(),
      sender: 'test',
      read: true,
      issuedTime: new Date(),
      content: loremIpsum({ count: 1, units: 'paragraphs' }),
    },
    {
      id: Math.round(Math.random() * 100000).toString(),
      sender: 'jury',
      read: false,
      issuedTime: new Date(),
      content: loremIpsum({ count: 1, units: 'paragraphs' }),
    },
  ],
}

export const clarifications = [SampleClarification1, SampleClarification2]

export const clarificationMap: {
  [contestId: string]: Clarification[]
} = {
  [ContestArkav4Qual.id]: lodash.cloneDeep(clarifications),
  [ContestArkav4Final.id]: lodash.cloneDeep(clarifications),
  [ContestArkav5Qual.id]: lodash.cloneDeep(clarifications),
  [ContestArkav5Final.id]: lodash.cloneDeep(clarifications),
}
